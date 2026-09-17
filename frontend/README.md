# Dhara-Sanket AI — Frontend (Next.js 16 + React 19)

This is the responsive Gov-Tech frontend portal for **Dhara-Sanket AI** (SIH Problem Statement **SIH26017**).

---

## 🚀 Getting Started

First, ensure the Python backend is running on `http://localhost:8000`:
```bash
# In backend directory
python -m uvicorn main:app --port 8000 --reload
```

Then start the Next.js frontend development server:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Application Routes

* `/` — **Landing Page**: Real-time corridor survey alignment tracking across 5 Madhya Pradesh checkpoints (Indore, Ujjain, Bhopal, Raisen, Jabalpur).
* `/dashboard` — **Command Dashboard**: Executive KPIs, live hotspot radar, real-time alert feed, and the 6-Step Decision Stepper (Slide 5).
* `/gis-map` — **Cadastral GIS Map & What-If Simulation**: Interactive parcel risk score inspector (0-100), 5-factor XAI breakdown, and live policy intervention simulation sliders.
* `/documents` — **Digital Document Submission & AI Verification**: Deed upload and automated OCR cross-matching against MP Bhulekh (Slide 2).
* `/active-projects` — **Active Projects Registry**: Filterable corridor table with search and "+ Add Project" modal.
* `/high-risk` — **High-Risk Triage**: Focused view for parcels with active court stays and urgent dispute alerts.
* `/reports` — **RFCTLARR 2013 Compliance Analytics**: Donut, Bar, and Line charts for risk distribution and district trends.
* `/audit-logs` — **Statutory Audit Trails**: Immutable event ledger tagged by RFCTLARR Act sections.

---

## 🔌 API Client Architecture (`lib/api.js`)

All pages fetch dynamic data from the FastAPI REST API via `lib/api.js`:
* `getProjects(params)` &rarr; `GET /api/projects`
* `createProject(data)` &rarr; `POST /api/projects`
* `getParcels()` &rarr; `GET /api/parcels`
* `runSimulation(payload)` &rarr; `POST /api/simulate`
* `getDocuments()` &rarr; `GET /api/documents`
* `verifyDocument(data)` &rarr; `POST /api/documents/verify`
* `getAuditLogs()` &rarr; `GET /api/audit-logs`
* `getPlatformStats()` &rarr; `GET /api/stats`

**Resilient Fallback**: If the backend is temporarily offline, `lib/api.js` automatically falls back to local seed data in `lib/mockData.js`, ensuring the frontend remains 100% demo-ready during presentations.
