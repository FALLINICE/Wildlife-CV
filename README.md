# Wildlife Camera-Trap Intelligence System

An end-to-end system for classifying wildlife species from real camera-trap
imagery and generating grounded, RAG-based ecological context for each
detection. Built on field data from LILA BC's **Desert Lion Conservation
Camera Traps** dataset (Northern Namibia).

**Status:** Week 3 (FastAPI serving) complete. Weeks 4-8 (RAG, evaluation,
reporting, deployment) pending.

---

## 1. Project Overview

Conservation researchers deploy motion-triggered cameras across large field
sites, generating tens of thousands of images that must be manually
reviewed. This project builds a system that:

1. **Classifies** the species in a camera-trap image
2. **Routes** low-confidence predictions to human review instead of
   forcing a guess, surfacing alternative candidates when it does
3. **Serves** predictions via a documented, tested REST API
4. Will **ground** detections in real ecological/conservation context via
   RAG (Weeks 4-5, not yet built)
5. Is evaluated throughout on real, honestly-reported numbers — including
   where it struggles, not just where it succeeds

---

## 2. Dataset

**Source:** [LILA BC](https://lila.science) — Desert Lion Conservation
Camera Traps, Northern Namibia, COCO Camera Traps annotation format.

**Species selected (10 of 46 available categories):** the highest-count
true species (excluding coarse group labels like `cn-raptors`, `aves`,
etc., which are not species-level).

| Species (scientific name) | Common name | Train | Val | Test | Total |
|---|---|---|---|---|---|
| struthio_camelus | Ostrich | 1,337 | 286 | 287 | 1,910 |
| equus_zebra_hartmannae | Hartmann's mountain zebra | 1,324 | 283 | 285 | 1,892 |
| oryx_gazella | Oryx/Gemsbok | 1,278 | 273 | 275 | 1,826 |
| antidorcas_marsupialis | Springbok | 1,214 | 260 | 261 | 1,735 |
| diceros_bicornis | **Black rhino** | 1,164 | 249 | 251 | 1,664 |
| panthera_leo | Lion | 1,093 | 234 | 235 | 1,562 |
| hyaena_brunnea | Brown hyena | 1,078 | 231 | 232 | 1,541 |
| giraffa_camelopardalis | Giraffe | 889 | 190 | 191 | 1,270 |
| loxodanta_africana | Elephant | 836 | 179 | 180 | 1,195 |
| canis_mesomelas | Black-backed jackal | 730 | 156 | 158 | 1,044 |

**Total: 15,639 images** (70/15/15 split, stratified per species).

Original download totaled 18,626 images; ~3,000 were undercounted due to
camera-trap sequences reusing generic filenames (e.g. `PICT0034.JPG`)
across different dates, which silently collided with the download
script's skip-if-exists logic. Not corrected, as remaining per-class
counts are still ample.

**Species selection rationale:** black rhino's inclusion is deliberate
beyond its image count — as a critically endangered species, it gives the
planned RAG/reasoning layer a genuinely meaningful conservation-status
case to reason about.

**Imbalance-handling decision:** rather than force equal sampling
(which was tested and found to collapse nearly all natural imbalance at a
1,500/species cap), a soft cap of 2,000/species was applied to the 7 most
common species, while the 3 rarest (lion, jackal, elephant) were kept at
full natural counts — preserving a real, ~1.4-1.8x imbalance ratio. This
mirrors the class-weighting philosophy (preserve data, correct at the
model level) used in a separate project, AthNext.

**Known data quality notes:**
- ~26% of images carry a placeholder timestamp (`2012:01:01 01:01:01`)
  rather than a real capture time — not used in any current feature
- A recurring small number of images per run trigger "Invalid SOS
  parameters" JPEG warnings; `ultralytics` auto-repairs and continues in
  all observed cases
- A small number of images (1 in validation) are entirely unreadable and
  excluded from evaluation

---

## 3. Data Pipeline

1. **Metadata exploration** — COCO Camera Traps JSON (`images`,
   `annotations`, `categories`) loaded and joined via `pandas`, verifying
   row counts after each merge (63,468 → 63,468, no drops/duplicates)
2. **Species/subset selection** — see above
3. **Image download** — all images downloaded via concurrent HTTP
   requests (`ThreadPoolExecutor`, 12 workers) with per-image retry logic
   and skip-if-exists behavior; reduced total download time from a
   projected 12+ hours (sequential) to ~25 minutes
4. **Train/val/test split** — stratified 70/15/15, split independently
   per species. An early version of this script had a critical bug: it
   didn't clear previous output before re-running, causing the split to
   silently accumulate across multiple runs (final corrupted state: test
   set 3.7x larger than intended, at 50% of the data instead of 15%).
   Caught via a total-row-count sanity check against the known raw image
   count, root-caused, and fixed by adding an explicit cleanup step at
   the start of the script. The corrupted-split baseline model (initially
   trained before the bug was found) was fully discarded and retrained
   from the corrected split.

---

## 4. Classification Model

**Architecture:** `yolo11n-cls` (YOLO11 nano classification variant),
fine-tuned via transfer learning from ImageNet-pretrained weights (1.5M
parameters). Chosen over raw PyTorch/torchvision for its concise training
API — though this introduced a real limitation (see Section 5).

**Training config:** 30 epochs, batch size 64, image size 224,
MPS-accelerated (Apple M5), early-stopping patience of 10 (never
triggered — both runs converged to full 30 epochs).

**Baseline (natural distribution, unweighted) results:**
- **Best validation top1 accuracy: 94.8%** (converged by epoch 26-30)
- Per-class recall range: 0.85 (jackal) – 0.98 (elephant) on the initial
  validation confusion matrix
- Primary confusion: jackal misclassified as brown hyena — visually
  explainable, as both are similarly-sized, similarly-colored carnivores
  that can look alike in low-light or motion-blurred frames

---

## 5. Ablation: Class-Weighted Training

**Motivation:** `ultralytics`'s classification training pipeline has no
built-in per-class loss-weighting argument (unlike, e.g., scikit-learn's
`class_weight='balanced'`, used in a separate project, AthNext). Rather
than skip the imbalance question, a custom weighted-sampling mechanism was
built from scratch: subclassing `ClassificationTrainer.get_dataloader()`
to inject a `WeightedRandomSampler` (inverse-frequency per-class weights,
computed from each dataset split's actual sample counts) into the
*training* dataloader only, leaving validation/test dataloaders
untouched.

This required reaching into `ultralytics`'s internal source (confirming
`ClassificationDataset` wraps a `.base` `ImageFolder`-like object rather
than inheriting from it directly, and that `.samples` entries are 4-tuples
including caching fields, not the 2-tuples a plain `ImageFolder` returns)
— genuinely the most technically demanding part of the project to date.

**Weighted model results:**
- Best validation top1 accuracy: 94.7% — statistically indistinguishable
  from baseline
- Jackal recall: 0.85 → 0.87 (small, positive shift)
- **McNemar's exact test on paired validation predictions: p = 0.635** —
  no statistically significant difference between baseline and weighted
  models

**Conclusion:** at this dataset's imbalance ratio (max ~1.8x), class
weighting did not produce a measurable improvement. Given equivalent
performance, the simpler unweighted **baseline model was retained** —
added implementation complexity should be justified by measurable
benefit, which this ablation did not demonstrate. Jackal's specific
confusion pattern appears better explained by visual similarity to brown
hyena than by data scarcity, which reweighting cannot address.

---

## 6. Confidence-Based Review Routing

Since even the strong baseline (94.8% val accuracy) misclassifies roughly
1 in 20 predictions, a confidence threshold determines which predictions
are trusted automatically vs. routed for human review.

**Method:** validation predictions were split into correct/incorrect
groups by outcome; their confidence distributions showed real but
imperfect separation (correct: median 0.9999, IQR 0.998–1.0; incorrect:
median 0.632, IQR 0.485–0.825).

**Threshold selected: 0.85**, chosen from a full sweep (0.5–0.9) as the
point where trusted-prediction accuracy gains begin to plateau relative
to the growing review burden.

### Validation results (threshold selection basis)
| Metric | Value |
|---|---|
| % flagged for review | 8.7% |
| Trusted accuracy | 98.88% |
| Flagged accuracy | 52.5% |

### Per-species stress test (added after external review identified this gap)
A single aggregate accuracy number can mask species-specific weaknesses.
Breaking down by species revealed **jackal (canis_mesomelas) as a clear
outlier** — 23.1% of jackal predictions flagged (vs. 4-10% for every other
species) and only 94.2% trusted accuracy (below the 98.9% aggregate).
Lion, rhino, and elephant — the other rare/harder species — were *not*
problems; their trusted accuracy matched or exceeded the aggregate.

### Overconfidence / calibration finding
12 validation predictions were both wrong and highly confident (≥0.95).
These skewed toward the model over-predicting majority classes (oryx,
zebra) — a qualitative sign of residual majority-class bias not visible
in aggregate accuracy alone. This reflects a well-known property of
neural network softmax outputs: they are not inherently calibrated
probabilities of correctness. The classifier exhibits strong confidence
separation between correct and incorrect predictions overall, though a
small number of misclassifications remain highly confident — a more
scientifically precise statement than "the model is confident when
correct."

---

## 7. Final Test-Set Evaluation (touched once)

All decisions above (model choice, threshold value) were finalized using
validation data only. The test set was evaluated exactly once, with no
retuning based on the outcome.

| Metric | Validation | Test |
|---|---|---|
| % flagged for review | 8.7% | 9.13% |
| **Trusted accuracy** | 98.88% | **98.36%** |
| Flagged accuracy | 52.5% | 58.1% |

The small, expected drop from validation to test confirms the threshold
generalizes to unseen data rather than being overfit to the validation
split.

**Jackal finding replicated:** jackal remained the lowest-ranked species
on test (95.56% trusted accuracy, 14.6% flagged) — confirming this is a
real, reproducible weakness rather than a validation-split artifact.
The exact magnitude differed between splits, plausibly reflecting real
sampling variance given jackal's modest size (~156-158 images per split);
the *direction* of the finding (jackal is the hardest class) was stable
across both.

**Overconfidence pattern replicated:** 19 high-confidence-wrong cases on
test (proportionally similar to validation's 12), with the same
majority-class over-prediction pattern (oryx, zebra, ostrich), confirming
this is a real, consistent model behavior rather than a one-off.

### Final, honest summary
> On a held-out test set (2,355 images, evaluated once), the baseline
> classifier achieved 98.36% trusted-prediction accuracy at a 0.85
> confidence threshold, closely matching validation performance (98.88%).
> Species-level analysis, replicated across both splits, identified
> jackal as the consistently weakest-performing class. High-confidence
> misclassifications skewed toward over-predicting majority classes on
> both splits, consistent with the finding that class-weighting produced
> no statistically significant correction (McNemar's p=0.635).

---

## 8. FastAPI Serving Layer (Week 3)

### 8.1 Overview
The trained baseline classifier is served via a FastAPI REST API with a
single primary endpoint, `POST /predict`, which accepts an image upload
and returns a species classification with confidence-based review routing.

### 8.2 Endpoint: `POST /predict`

**Request:** multipart/form-data upload, field name `file`. Accepted types:
JPEG, JPG, PNG. Max size: 10MB.

**Response (confident prediction):**
```json
{
  "species": "struthio_camelus",
  "confidence": 0.9997,
  "review_needed": false
}
```

**Response (low-confidence prediction):** when `confidence` falls below
the locked-in threshold (0.85, see Section 6), the response additionally
includes up to 3 ranked alternative candidates, giving a human reviewer a
head start rather than just an unqualified "uncertain":
```json
{
  "species": "struthio_camelus",
  "confidence": 0.6286,
  "review_needed": true,
  "alternative_candidates": [
    {"species": "struthio_camelus", "confidence": 0.6286},
    {"species": "antidorcas_marsupialis", "confidence": 0.1531},
    {"species": "giraffa_camelopardalis", "confidence": 0.0904}
  ]
}
```

**Design rationale:** `alternative_candidates` is included conditionally,
not on every response. An always-on top-3 output would introduce noise on
confident predictions where a single clean answer is already reliable;
surfacing alternatives specifically when `review_needed` is true targets
exactly the cases where a human reviewer benefits from a head start,
leveraging the model's known top-5 accuracy of 99.7% (vs. 94.8% top-1) —
when the top guess is wrong, the correct answer is very often still among
the next few.

### 8.3 Error Handling

| Condition | Status | Response |
|---|---|---|
| Invalid file type (not JPEG/PNG) | 400 | `"Invalid file type: {type}. Only JPEG, JPG, PNG format accepted."` |
| Empty file (0 bytes) | 400 | `"Uploaded file is empty."` |
| File exceeds 10MB | 400 | `"File too large. Max size is 10MB."` |
| Corrupted/unreadable image | 422 | `"Could not process image. The file may be corrupted or unreadable."` |

All uploaded files are written to a temporary directory with a randomly
generated filename (UUID-based, not the user-supplied filename, to avoid
path-traversal and filename-collision risks) and are deleted after
processing via a `try/finally` block — verified to execute cleanup on both
success and failure paths, including when prediction itself fails midway.

### 8.4 Automated Test Suite

Six tests in `tests/test_api.py`, using FastAPI's `TestClient`:
1. `/docs` loads successfully
2. Valid image → correct response shape and value ranges
3. Invalid file type → 400, correct error message
4. Empty file → 400, correct error message
5. Corrupted image (the same file identified as unreadable throughout
   Week 2's evaluation) → 422, no server crash
6. Low-confidence prediction → conditionally includes exactly 3 distinct
   alternative candidates; confident prediction → field absent entirely

All 6 tests pass. Test data reuses the project's real train/val/test
imagery rather than synthetic stand-ins, so the suite exercises the actual
model and actual data-quality issues (e.g., the known corrupted file) the
project has already characterized.

### 8.5 Logging

Requests are logged via Python's `logging` module (not `print()`, to
support severity filtering): successful predictions at `INFO` (species,
confidence, review flag), validation rejections (wrong type, empty,
oversized) at `WARNING`, and genuine prediction failures (corrupted/
unreadable images) at `ERROR`.

### 8.6 Out-of-Distribution Behavior — An Informal but Important Finding

The classifier is a **closed-set** model — it can only choose among its
10 trained species and has no built-in mechanism to express "none of
these." Informal testing with genuinely out-of-distribution animals
(not among the 10 trained classes) surfaced inconsistent behavior worth
documenting honestly:

- **Striped hyena** (not a trained class) → classified as `hyaena_brunnea`
  (brown hyena) at 55.8% confidence, correctly flagged for review. The
  second-ranked alternative was `equus_zebra_hartmannae` (zebra) at 43.2%
  — an interpretable confusion, plausibly driven by both animals sharing
  a prominent striped coat pattern.
- **Spotted hyena** (also not a trained class) → confidently (91.2%)
  misclassified as `giraffa_camelopardalis` (giraffe), and **not** flagged
  for review, despite being an equally out-of-distribution input.

This is a concrete demonstration of a well-known limitation of softmax-
based closed-set classifiers: confidence scores are not a reliable
calibrated measure of "is this actually one of my known classes," only of
"how sure am I about my top choice among the classes I know." The system
sometimes expresses appropriate uncertainty on novel inputs and sometimes
does not. A more robust future iteration could incorporate explicit
open-set recognition or out-of-distribution detection, rather than relying
solely on softmax confidence.

---

## 9. Known Limitations

- **Jackal remains the weakest class** even after confidence routing;
  a single global threshold does not fully compensate. A species-specific
  threshold for jackal is a reasonable future improvement, deliberately
  not implemented in Week 2 to avoid scope creep.
- Class weighting was tested and found ineffective at this imbalance
  ratio — this should not be read as "weighting never helps," only that
  this specific technique, at this specific imbalance level, did not.
- ~3,000 raw images were likely undercounted at download time due to
  filename collisions (Section 2).
- Confidence scores are uncalibrated softmax outputs, not true
  probabilities — a small number of confident errors persist.
- **The classifier has no out-of-distribution detection** — genuinely
  novel species can produce confidently wrong, unflagged predictions
  (Section 8.6). This is the most significant limitation surfaced during
  Week 3 and a strong candidate for future work.
- The file-size validation reads the full upload into memory before
  checking its size, rather than inspecting `Content-Length` beforehand —
  an accepted simplification for a project at this scale, not a
  production-grade safeguard against memory exhaustion from oversized
  uploads.

---

## 10. Project Structure

```
wildlife-cv-rag/
├── data/
│   ├── raw/images/<species>/*.JPG
│   └── processed/{train,val,test}/<species>/*.JPG
├── notebooks/
│   └── wildlife_metadata.ipynb
├── src/
│   ├── data/
│   │   ├── download_images.py
│   │   └── split_dataset.py
│   ├── models/
│   │   ├── train.py                    # baseline
│   │   ├── weighted_sampler.py          # custom WeightedRandomSampler trainer
│   │   └── train_weighted.py
│   ├── api/
│   │   └── app.py                       # Week 3: FastAPI serving
│   └── rag/              (Weeks 4-5, pending)
├── tests/
│   └── test_api.py                       # Week 3: 6-test suite
├── eval/
│   ├── compare_baseline_vs_weighted.py  # Day 13, McNemar's test
│   ├── confidence_threshold.py           # Day 14, validation-based
│   ├── test_evaluation.py                # Day 15, test-set (touched once)
│   ├── model_comparison.csv
│   ├── baseline_confidence.csv
│   ├── per_species_threshold_report.csv       (validation)
│   ├── per_species_threshold_TEST.csv          (test)
│   └── confidence_distribution.png
├── models/
│   ├── baseline_unweighted.pt
│   └── weighted_sampling.pt
├── pytest.ini
├── requirements.txt
└── README.md
```

---

## 11. Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Run the API:**
```bash
uvicorn src.api.app:app --reload --port 8000
```
Interactive docs: `http://localhost:8000/docs`

**Run tests:**
```bash
pytest tests/test_api.py -v
```

---

## 12. Roadmap

- [x] **Week 1** — Data collection, species selection, download pipeline
- [x] **Day 8** — Train/val/test split (70/15/15, stratified; corruption bug caught and fixed)
- [x] **Day 9** — YOLO/environment setup, MPS confirmed
- [x] **Day 10** — Baseline classifier trained (94.8% val accuracy)
- [x] **Day 11** — Custom weighted-sampling dataloader implemented (hardest technical task in the project)
- [x] **Day 12** — Weighted classifier trained (94.7% val accuracy)
- [x] **Day 13** — Baseline vs. weighted comparison, McNemar's test (p=0.635, no significant difference)
- [x] **Day 14** — Confidence threshold selected (0.85), per-species and overconfidence analysis added
- [x] **Day 15** — Final test-set evaluation (98.36% trusted accuracy, findings replicated)
- [x] **Day 16** — Buffer / cleanup
- [x] **Day 17** — FastAPI endpoint skeleton, model loading via `lifespan`
- [x] **Day 18** — Confidence + review-flag logic, conditional top-3 alternatives
- [x] **Day 19** — Full input validation and error handling
- [x] **Day 20** — 6-test automated suite (pytest + TestClient)
- [x] **Day 21** — Logging, endpoint documentation
- [x] **Day 22** — Final manual pass, README update, out-of-distribution findings documented
- [ ] **Week 4-5** — RAG knowledge base + grounded reasoning layer
- [ ] **Week 6** — Full evaluation set + retrieval-relevance reporting
- [ ] **Week 7** — Report-generation agent
- [ ] **Week 8** — Frontend + deployment
