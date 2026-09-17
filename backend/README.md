# Dhara-Sanket AI — Backend API (FastAPI)

FastAPI REST backend serving delay predictions, Explainable AI attributions, cadastral parcels, document verification, and statutory audit logs for **SIH26017**.

---

## 🚀 Running the Server

```bash
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

* **Base URL**: `http://localhost:8000`
* **Interactive Swagger UI**: `http://localhost:8000/docs`
* **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 🔌 API Endpoints

### 1. Projects & Corridors
* `GET /api/projects`: List corridors with optional query filters (`district`, `risk`, `search`).
* `POST /api/projects`: Register a new infrastructure acquisition corridor.
* `GET /api/projects/{id}`: Fetch project details by ID.

### 2. Cadastral Parcels
* `GET /api/parcels`: List cadastral survey parcels with coordinates & ownership data.
* `GET /api/parcels/{id}`: Fetch individual parcel details.

### 3. AI/ML Inference & What-If Simulation
* `POST /api/predict/parcel`: Run Scikit-Learn `GradientBoosting` prediction to compute risk score (0-100), estimated delay (months), and 5-factor XAI breakdown.
* `POST /api/simulate`: Execute policy intervention counterfactual simulation (*Compensation Multiplier*, *Title Fast-Tracking*, *Lok Adalat Stays*, *FRA Gram Sabha Consent*).

### 4. Digital Document Verification (Slide 2)
* `GET /api/documents`: List uploaded land deeds with verification status.
* `POST /api/documents/verify`: Simulate AI OCR cross-matching against MP Bhulekh records.

### 5. Statutory Audit Trails (Slide 3 & 6)
* `GET /api/audit-logs`: Immutable event ledger tagged by RFCTLARR Act 2013 sections.

### 6. Telemetry & Analytics
* `GET /api/stats`: High-level platform KPIs.
* `GET /api/alerts`: Real-time dispute and discrepancy ticker stream.
* `GET /api/reports/summary`: Statistical aggregations for compliance charts.

---

## 💾 Embedded Database (`dhara_sanket.db`)

Uses an embedded SQLite database managed via `database.py`. Automatically initializes schema and seeds realistic Madhya Pradesh project data on server startup with **zero external database setup required**.
