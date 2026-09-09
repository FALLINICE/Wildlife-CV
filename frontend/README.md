# Wildlife AI Intelligence System — Frontend Application

A portfolio-grade, production-ready frontend for **Wildlife Species Classification using Computer Vision (YOLOv8) + RAG (ChromaDB) + Gemini Grounded LLM**.

Designed with a field-research visual theme (dark charcoal, forest green, warm sand, gold accents) inspired by National Geographic, WWF, and field ecology AI platforms.

---

## 🚀 Quick Start

### 1. Install Dependencies
Run from either the root directory or `frontend/`:
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

The application will launch at `http://localhost:5173`.

---

## ⚙️ Environment Configuration

Backend URL is configured via `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

### Backend API Contract

- **Endpoint:** `POST /predict`
- **Format:** `multipart/form-data`
- **Payload:** `file`
- **Response Structure:**
```json
{
  "species": "diceros_bicornis",
  "confidence": 0.9342,
  "review_needed": false,
  "description": "...",
  "explanation": "...",
  "alternative_candidates": [
    {
      "species": "equus_zebra_hartmannae",
      "confidence": 0.0615
    }
  ]
}
```

---

## 🌿 Key Features

1. **Camera Trap Inspection Station:**
   - Large drag-and-drop dropzone with viewfinder crosshairs.
   - Live image preview with file size validation (<10 MB) and format constraints (JPG, JPEG, PNG).
   - Preset field sample selector for instant one-click pipeline testing.

2. **Step-by-Step Processing Timeline:**
   - Animated progress tracking across stages: *Tensor Preparation → YOLOv8 Classification → ChromaDB Retrieval → Gemini LLM Synthesis*.
   - Animated laser scanner overlay on uploaded images.

3. **Field Inspection Report Dashboard:**
   - **Confidence Gauge:** Animated radial SVG progress ring with color thresholds (`>= 85%` trusted green vs `< 85%` review amber).
   - **Review Warning Banner:** Prominent flag when `review_needed: true` detailing field review protocols.
   - **Alternative Candidate Species:** Ranked probability list for ambiguous or low-confidence captures.
   - **Species Knowledge:** Field guide presentation of ChromaDB vector-retrieved factual documentation.
   - **AI Explanation:** Gemini LLM grounded reasoning report formatted with paragraph preservation and key takeaways.

4. **Built-in Demo Mode:**
   - Toggleable offline mode allowing full pipeline simulation for all 10 African wildlife species even when local FastAPI server is not running.

---

## 🛠️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/         # Navbar, Footer, Badge, ErrorCard
│   │   ├── home/           # HeroSection, PipelineSection, SpeciesGallery
│   │   ├── upload/         # DragDropZone, FilePreview, SampleSelector, LoadingOverlay
│   │   └── results/        # ResultsDashboard, ConfidenceGauge, FieldReviewWarning,
│   │                       # AlternativeCandidatesCard, SpeciesKnowledgeCard, AIExplanationCard
│   ├── hooks/
│   │   └── usePredict.ts   # State management & stage timeline hook
│   ├── services/
│   │   ├── api.ts          # Axios client with structured error mapping
│   │   └── mockData.ts     # Offline demo responses for all 10 species
│   ├── types/
│   │   └── api.ts          # TypeScript interfaces & contracts
│   └── utils/
│       ├── formatters.ts   # Byte formatters, percentages, timestamp generators
│       └── speciesMetadata.ts # Taxonomy & conservation status metadata
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```
