# backend/main.py
"""
Dhara-Sanket AI — FastAPI Backend Server
Problem Statement: SIH26017 (Predictive Analytics System for Early Detection of Land Acquisition Delays)
Team Catalyst — Smart India Hackathon 2026
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Ensure backend root is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from database import init_db
from routes.projects import router as projects_router
from routes.parcels import router as parcels_router
from routes.predict import router as predict_router
from routes.analytics import router as analytics_router
from routes.documents import router as documents_router
from routes.audit import router as audit_router

app = FastAPI(
    title="Dhara-Sanket AI API",
    description="Predictive Analytics & Explainable AI REST API for Land Acquisition Delay Prevention (SIH26017)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(projects_router)
app.include_router(parcels_router)
app.include_router(predict_router)
app.include_router(analytics_router)
app.include_router(documents_router)
app.include_router(audit_router)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Dhara-Sanket AI Backend",
        "problem_id": "SIH26017",
        "state": "Madhya Pradesh Cadastral Hub",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
