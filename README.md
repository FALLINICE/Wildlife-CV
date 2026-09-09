# Wildlife-CV 🦁

> **Camera Trap Wildlife Species Classification using YOLO11, Retrieval-Augmented Generation (RAG), and Gemini-powered AI Explanations**

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![YOLO11](https://img.shields.io/badge/YOLO11-Ultralytics-red.svg)](https://docs.ultralytics.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-46E3B7.svg)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

---

## 🌍 Live Demo

### Frontend

**https://wildlife-cv-1.onrender.com**

### Repository

**https://github.com/FALLINICE/Wildlife-CV**

---

# Project Overview

Wildlife conservation projects deploy thousands of motion-triggered camera traps across protected landscapes. These cameras continuously capture wildlife activity, producing **tens of thousands of images** that traditionally require manual inspection by researchers.

Manual annotation is slow, expensive, and difficult to scale. Although modern computer vision models can automate species classification, they often provide little insight into *why* a prediction was made and can produce highly confident yet incorrect predictions.

Wildlife-CV addresses these challenges by combining modern computer vision with Retrieval-Augmented Generation (RAG) and Large Language Models to produce predictions that are both accurate and interpretable.

The system performs four major tasks:

- Classifies African wildlife species from camera trap images using a fine-tuned YOLO11 image classification model.
- Flags low-confidence predictions for human review instead of forcing unreliable classifications.
- Retrieves verified ecological knowledge about the predicted species using a Retrieval-Augmented Generation (RAG) pipeline.
- Generates grounded natural-language explanations using Google's Gemini model based only on retrieved documentation.

The application is deployed as a full-stack web application consisting of:

- **FastAPI backend**
- **React + TypeScript frontend**
- **YOLO11 classifier**
- **ChromaDB vector database**
- **Sentence Transformer embeddings**
- **Google Gemini API**

---

# Features

## Computer Vision

- Fine-tuned YOLO11 image classification model
- Supports 10 African wildlife species
- Confidence score for every prediction
- Alternative candidate predictions for uncertain classifications

---

## Human Review Workflow

Instead of forcing every prediction, Wildlife-CV identifies uncertain classifications using a confidence threshold.

Predictions below **0.85 confidence** are automatically marked for human verification.

The API returns:

- prediction confidence
- review flag
- top alternative candidate species

This allows conservation experts to review only uncertain cases instead of every uploaded image.

---

## Retrieval-Augmented Generation (RAG)

The project does **not** ask an LLM to generate explanations from memory.

Instead it:

1. Retrieves species information from a curated knowledge base.
2. Supplies only the retrieved document to Gemini.
3. Produces grounded explanations using retrieved evidence.

This greatly reduces hallucination while ensuring explanations remain relevant to the predicted species.

---

## REST API

A documented FastAPI backend exposes the prediction pipeline through REST endpoints.

The API performs:

- image validation
- inference
- confidence evaluation
- retrieval
- explanation generation
- structured JSON responses

---

## Modern Frontend

The React frontend provides:

- drag-and-drop image upload
- prediction dashboard
- confidence visualization
- human-review indicators
- species gallery
- markdown-rendered AI explanations
- responsive design

---

# Application Workflow

```text
User Upload
      │
      ▼
YOLO11 Classification
      │
      ▼
Prediction Confidence
      │
      ├──────── Confidence ≥ 0.85
      │
      │          ▼
      │   Retrieve Species Knowledge
      │          ▼
      │   Gemini Explanation
      │          ▼
      │   Display Results
      │
      └──────── Confidence < 0.85
                 │
                 ▼
        Flag Human Review
                 │
                 ▼
      Return Alternative Candidates
                 │
                 ▼
         Retrieve Knowledge
                 │
                 ▼
        Gemini Explanation
                 │
                 ▼
           Display Results
```

---


# Dataset

## Source

**LILA BC – Desert Lion Conservation Camera Trap Dataset**

https://lila.science/

The original dataset contains images collected from motion-triggered camera traps deployed across Northern Namibia for wildlife monitoring and conservation research.

---

## Selected Species

This project focuses on the ten most frequently represented true wildlife species in the dataset.

| Scientific Name | Common Name |
|-----------------|-------------|
| *Struthio camelus* | Ostrich |
| *Equus zebra hartmannae* | Hartmann's Mountain Zebra |
| *Oryx gazella* | Oryx (Gemsbok) |
| *Antidorcas marsupialis* | Springbok |
| *Diceros bicornis* | Black Rhino |
| *Panthera leo* | Lion |
| *Hyaena brunnea* | Brown Hyena |
| *Giraffa camelopardalis* | Giraffe |
| *Loxodonta africana* | African Elephant |
| *Canis mesomelas* | Black-backed Jackal |

---

## Dataset Statistics

| Split | Images |
|--------|--------:|
| Training | 10,943 |
| Validation | 2,341 |
| Testing | 2,355 |
| **Total** | **15,639** |

The dataset was divided using a **70 / 15 / 15 stratified split**, ensuring class proportions were maintained across training, validation, and testing sets.

---

# Model

Wildlife-CV uses **Ultralytics YOLO11 Classification** as the primary image classification model.

Rather than object detection, the project focuses on **whole-image species classification**, making it suitable for camera-trap photographs containing a dominant animal subject.

## Model Highlights

- YOLO11 Classification
- Transfer Learning
- Fine-tuned on 15,639 wildlife images
- PyTorch backend
- GPU-compatible training
- Confidence-based prediction output
- Integrated into a FastAPI inference service

The classifier predicts one of ten supported wildlife species and returns a calibrated confidence score that determines whether the prediction should be trusted automatically or routed for human review.


# Retrieval-Augmented Generation (RAG)

Traditional image classifiers return only a class label and confidence score. Wildlife-CV extends this pipeline by providing **grounded ecological explanations** using Retrieval-Augmented Generation (RAG).

Instead of allowing the Large Language Model to generate information from its own knowledge, the system first retrieves verified species documentation and supplies only that context to the model.

This approach improves factual consistency while reducing hallucination.

---

## RAG Pipeline

```text
Predicted Species
        │
        ▼
Retrieve Species Document
        │
        ▼
Sentence Embedding Search
        │
        ▼
Relevant Context
        │
        ▼
Gemini Prompt Construction
        │
        ▼
Grounded AI Explanation
```

---

## Knowledge Base

Each supported wildlife species has an associated knowledge document containing ecological and conservation information.

Example topics include:

- scientific classification
- habitat
- geographical distribution
- conservation status
- ecological behaviour
- identifying characteristics
- interesting facts

These documents are embedded using a Sentence Transformer model and indexed inside a ChromaDB vector database.

During inference:

1. the predicted species is used as the retrieval query
2. the most relevant document is retrieved
3. the retrieved document becomes the only context supplied to Gemini

---

## Gemini Explanation Generation

Google Gemini is responsible for converting retrieved factual information into a concise explanation suitable for end users.

The model is **not** used to identify species.

Instead, it receives:

- predicted species
- confidence score
- review status
- retrieved knowledge document

and generates a grounded explanation describing:

- why the prediction is reasonable
- ecological context
- conservation relevance
- interpretation of the confidence score

If explanation generation fails, the classification result is still returned, ensuring graceful degradation rather than complete request failure.

---

# Confidence-Based Human Review

Machine learning models inevitably encounter uncertain predictions.

Instead of forcing a potentially incorrect classification, Wildlife-CV identifies low-confidence predictions and flags them for manual verification.

---

## Confidence Threshold

A threshold of **0.85** was selected after validation-set analysis.

Predictions are separated into two categories.

### Confidence ≥ 0.85

- trusted prediction
- explanation generated
- returned directly to user

### Confidence < 0.85

- marked for human review
- alternative candidate species returned
- confidence warning displayed in UI

This design prioritizes reliability over automation, making the system more suitable for conservation workflows where incorrect classifications may influence ecological analyses.

---

## Alternative Candidate Species

When confidence falls below the review threshold, the API also returns the top candidate species.

Example:

```json
{
  "review_needed": true,
  "alternative_candidates": [
    {
      "species": "canis_mesomelas",
      "confidence": 0.776
    },
    {
      "species": "hyaena_brunnea",
      "confidence": 0.145
    },
    {
      "species": "panthera_leo",
      "confidence": 0.061
    }
  ]
}
```

This assists researchers during manual verification.

---

# REST API

The backend is implemented using **FastAPI** and exposes a REST interface for prediction.

## Base URL

```
https://wildlife-cv.onrender.com
```

Interactive API documentation is automatically generated by FastAPI.

```
/docs
```

---

## POST /predict

Uploads an image for wildlife species classification.

### Request

Multipart form data

```
file=image.jpg
```

---

### Successful Response

```json
{
  "species": "panthera_leo",
  "confidence": 0.9874,
  "review_needed": false,
  "description": "...",
  "explanation": "..."
}
```

---

### Low Confidence Response

```json
{
  "species": "canis_mesomelas",
  "confidence": 0.7759,
  "review_needed": true,
  "alternative_candidates": [
    ...
  ],
  "description": "...",
  "explanation": "..."
}
```

---

### Validation

The API validates:

- supported image types
- maximum upload size (10 MB)
- corrupted images
- unreadable files

Structured error responses are returned for invalid requests.

---

# Frontend

The frontend is built using **React**, **TypeScript**, and **Vite**.

The interface focuses on usability for researchers by providing a clean workflow from image upload to explanation.

## Features

- Drag-and-drop upload
- Image preview
- Upload progress indicator
- Confidence gauge
- Human review warning
- Alternative candidate display
- Species knowledge card
- AI-generated explanation
- Responsive layout
- Sample image selector

---

# Running Locally

## Backend

Clone the repository.

```bash
git clone https://github.com/FALLINICE/Wildlife-CV.git
cd Wildlife-CV
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate it.

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file containing:

```text
GEMINI_API_KEY=your_api_key
```

Run the API.

```bash
uvicorn src.api.app:app --reload
```

The backend will be available at

```
http://localhost:8000
```

---

## Frontend

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```text
VITE_API_URL=http://localhost:8000
```

Run the development server.

```bash
npm run dev
```

The frontend will be available at

```
http://localhost:5173
```

---

# Deployment

The application is deployed using **Render**.

## Frontend

Static Site

```
https://wildlife-cv-1.onrender.com
```

---

## Backend

FastAPI Web Service

```
https://wildlife-cv.onrender.com
```

The frontend communicates with the backend using the `VITE_API_URL` environment variable.

---





## Confidence Distribution

/Users/anuj/Documents/Wildlife/eval/confidence_distribution.png



---

## Example Prediction

**Input**

Camera trap image

↓

**Prediction**

```
Species:
Panthera leo

Confidence:
98.74%

Review Needed:
No
```

↓

**Retrieved Knowledge**

```
Habitat:
Savannas and grasslands

Conservation Status:
Vulnerable

Diet:
Carnivore
```

↓

**Generated Explanation**

> The uploaded image is classified as a lion with high confidence. Lions are large social carnivores native to sub-Saharan Africa and play a vital role as apex predators. Since the prediction confidence exceeds the review threshold, the classification is considered reliable.

---

# Limitations

Although Wildlife-CV demonstrates strong performance on the selected dataset, several limitations remain.

- The model supports only **10 wildlife species**.
- Images containing multiple prominent animals are classified as a single species.
- Performance may decrease on unseen environments or different camera trap deployments.
- Knowledge retrieval currently relies on one curated document per species.
- The system assumes English-language knowledge documents.
- LLM explanations depend on the availability of the Gemini API.
- The free deployment on Render may experience cold starts after periods of inactivity.

These limitations present opportunities for future improvements.

---

# Future Work

Potential extensions include:

- Support all species available in the Desert Lion Conservation dataset.
- Multi-label wildlife classification.
- Object detection and localization.
- Animal counting within images.
- Temporal analysis of camera trap sequences.
- Automatic biodiversity reporting.
- Interactive conservation dashboards.
- Hybrid retrieval using multiple ecological sources.
- Explainable AI visualizations such as Grad-CAM.
- Offline LLM support for fully self-contained deployments.

---

# Technology Stack

## Machine Learning

- PyTorch
- Ultralytics YOLO11
- NumPy
- Pillow

---

## Retrieval-Augmented Generation

- ChromaDB
- Sentence Transformers
- Google Gemini API

---

## Backend

- FastAPI
- Uvicorn
- Pydantic

---

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Markdown

---

## Deployment

- Render
- GitHub

---



# Design Principles

This project was developed with the following goals:

- Accuracy before automation.
- Transparent confidence reporting.
- Human-in-the-loop decision making.
- Grounded AI explanations.
- Modular architecture.
- Production-oriented REST API.
- Reproducible machine learning workflow.

---

# Acknowledgements

This project builds upon several outstanding open-source projects and datasets.

- **LILA BC** for providing the Desert Lion Conservation Camera Trap Dataset.
- **Ultralytics** for the YOLO11 framework.
- **Google DeepMind** for the Gemini API.
- **ChromaDB** for vector similarity search.
- **Sentence Transformers** for semantic embeddings.
- **FastAPI** for the backend framework.
- **React** and **Vite** for the frontend.

---

# License

This project is released under the **MIT License**.

See the `LICENSE` file for details.

---

# Citation

If you use this repository in academic work, please cite it as:

```bibtex
@software{dengale2026wildlifecv,
  author = {Anuj Dengale},
  title = {Wildlife-CV: Camera Trap Wildlife Classification using YOLO11, Retrieval-Augmented Generation, and Gemini},
  year = {2026},
  url = {https://github.com/FALLINICE/Wildlife-CV}
}
```

---

# Author

**Anuj Dengale**

GitHub: https://github.com/FALLINICE

---

## Star the Repository

If you found this project useful, consider giving it a ⭐ on GitHub.

Contributions, suggestions, and feedback are always welcome.