# backend/models.py
"""
Pydantic data models & request/response schemas for Dhara-Sanket AI REST API.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# ----------------- Project Models -----------------
class ProjectCreate(BaseModel):
    name: str = Field(..., example="Bhopal Smart City Western Bypass")
    district: str = Field(..., example="Bhopal")
    area_ha: float = Field(..., example=145.5)
    status: Optional[str] = Field("Planning", example="In Progress")
    risk: Optional[str] = Field("medium", example="high")
    start_date: Optional[str] = Field("2026-10-01", example="2026-10-01")
    land_records: Optional[int] = Field(500, example=850)
    progress: Optional[int] = Field(0, example=25)

class ProjectResponse(BaseModel):
    id: str
    name: str
    district: str
    area: str
    status: str
    risk: str
    startDate: str
    landRecords: int
    progress: int

# ----------------- Parcel Models -----------------
class ParcelResponse(BaseModel):
    id: str
    name: str
    district: str
    area: str
    riskScore: int
    riskFactors: Dict[str, int]
    owner: str
    landUse: str
    lastUpdated: str
    coords: Optional[List[float]] = None
    confidence: Optional[str] = "92%"
    primaryDelayer: Optional[str] = "Ownership Dispute"
    recommendedAction: Optional[str] = None

# ----------------- Prediction Models -----------------
class PredictionRequest(BaseModel):
    area_ha: float = Field(12.5, description="Area in hectares")
    num_title_holders: int = Field(3, description="Number of joint claimants")
    rate_deviation_pct: float = Field(35.0, description="Deviation of market rate above circle rate (%)")
    active_court_stays: int = Field(0, description="Active court stays (0, 1, 2)")
    deed_mismatch: int = Field(0, description="Revenue vs Registry discrepancy (0 or 1)")
    gram_sabha_pending: int = Field(0, description="FRA Gram Sabha consent pending (0 or 1)")
    is_forest: int = Field(0, description="Forest or eco-sensitive boundary (0 or 1)")
    rr_required: int = Field(0, description="Rehabilitation & resettlement needed (0 or 1)")
    infra_proximity_km: float = Field(5.0, description="Proximity to highway/infra (km)")

class PredictionResponse(BaseModel):
    risk_score: int
    risk_level: str
    confidence_pct: int
    estimated_delay_months: float
    xai_drivers: Dict[str, int]
    primary_delayer: str
    recommended_action: str

# ----------------- What-If Simulation Models -----------------
class SimulationRequest(BaseModel):
    base_features: PredictionRequest
    compensation_multiplier: float = Field(1.0, ge=1.0, le=3.0, description="RFCTLARR compensation factor (1.0 - 3.0)")
    title_fast_tracked: bool = Field(False, description="Fast-track title clearance via Special Revenue Tribunal")
    court_stay_resolved: bool = Field(False, description="Resolve court stays via Lok Adalat")
    gram_sabha_cleared: bool = Field(False, description="Pre-clear FRA 2006 Gram Sabha")
    rehab_package_enhanced: bool = Field(False, description="Standardize rehabilitation & resettlement package")

class SimulationResponse(BaseModel):
    baseline: Dict[str, Any]
    simulated: Dict[str, Any]
    impact: Dict[str, Any]

# ----------------- Alert & Telemetry Models -----------------
class AlertResponse(BaseModel):
    id: str
    title: str
    project: str
    severity: str
    time: str
    description: str

class StatItem(BaseModel):
    id: str
    label: str
    value: Any
    trend: str
    trendUp: bool
    icon: str
