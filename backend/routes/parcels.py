# backend/routes/parcels.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json

from models import ParcelResponse
from database import get_connection

router = APIRouter(prefix="/api/parcels", tags=["Parcels"])

@router.get("", response_model=List[ParcelResponse])
def list_parcels(district: Optional[str] = Query(None)):
    conn = get_connection()
    cursor = conn.cursor()

    if district:
        cursor.execute("SELECT * FROM parcels WHERE LOWER(district) = LOWER(?)", (district,))
    else:
        cursor.execute("SELECT * FROM parcels")

    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        factors = json.loads(r['riskFactors']) if r['riskFactors'] else {}
        results.append(ParcelResponse(
            id=r['id'],
            name=r['name'],
            district=r['district'],
            area=r['area'],
            riskScore=r['riskScore'],
            riskFactors=factors,
            owner=r['owner'],
            landUse=r['landUse'],
            lastUpdated=r['lastUpdated'],
            confidence=r['confidence'],
            primaryDelayer=r['primaryDelayer'],
            recommendedAction=r['recommendedAction']
        ))
    return results

@router.get("/{parcel_id}", response_model=ParcelResponse)
def get_parcel(parcel_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM parcels WHERE id = ?", (parcel_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"Parcel {parcel_id} not found")

    factors = json.loads(row['riskFactors']) if row['riskFactors'] else {}
    return ParcelResponse(
        id=row['id'],
        name=row['name'],
        district=row['district'],
        area=row['area'],
        riskScore=row['riskScore'],
        riskFactors=factors,
        owner=row['owner'],
        landUse=row['landUse'],
        lastUpdated=row['lastUpdated'],
        confidence=row['confidence'],
        primaryDelayer=row['primaryDelayer'],
        recommendedAction=row['recommendedAction']
    )
