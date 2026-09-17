# backend/routes/documents.py
"""
Digital Document Submission and AI Verification API (Slide 2).
Automates document verification against MP Bhulekh revenue records,
extracts title claimants, and detects mismatches.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional
import random

from database import get_connection

router = APIRouter(prefix="/api/documents", tags=["Digital Document Verification"])

class DocumentResponse(BaseModel):
    id: str
    name: str
    docType: str
    parcelId: str
    project: str
    uploadedBy: str
    uploadDate: str
    verificationStatus: str
    ocrMatchPct: float
    discrepancyDetails: Optional[str] = None

class DocumentVerifyRequest(BaseModel):
    name: str = Field(..., example="Khasra B-1 Record Survey 45/2")
    doc_type: str = Field(..., example="Khasra Extract")
    parcel_id: str = Field(..., example="PCL-IND-001")
    project_name: str = Field(..., example="Indore Metro Phase-II")
    uploaded_by: str = Field(..., example="Revenue Inspector")

@router.get("", response_model=List[DocumentResponse])
def list_documents(status: Optional[str] = Query(None)):
    conn = get_connection()
    cursor = conn.cursor()

    if status:
        cursor.execute("SELECT * FROM documents WHERE LOWER(verificationStatus) = LOWER(?)", (status,))
    else:
        cursor.execute("SELECT * FROM documents ORDER BY uploadDate DESC")

    rows = cursor.fetchall()
    conn.close()

    return [
        DocumentResponse(
            id=r['id'],
            name=r['name'],
            docType=r['docType'],
            parcelId=r['parcelId'],
            project=r['project'],
            uploadedBy=r['uploadedBy'],
            uploadDate=r['uploadDate'],
            verificationStatus=r['verificationStatus'],
            ocrMatchPct=r['ocrMatchPct'],
            discrepancyDetails=r['discrepancyDetails']
        )
        for r in rows
    ]

@router.post("/verify", response_model=DocumentResponse)
def verify_document(req: DocumentVerifyRequest):
    """
    Simulates AI OCR cross-matching document metadata with MP Bhulekh cadastral repository.
    """
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM documents")
    count = cursor.fetchone()[0]
    new_id = f"DOC-{str(count + 1).zfill(3)}"

    # Determine simulated verification outcome
    is_mismatch = random.random() < 0.25
    if is_mismatch:
        status = "Discrepancy Flagged"
        match_pct = round(random.uniform(68.0, 79.5), 1)
        details = "Title holder name discrepancy: 1 unrecorded legal heir detected in mutation history."
    else:
        status = "Verified"
        match_pct = round(random.uniform(93.0, 99.8), 1)
        details = "All survey coordinates, seal, and stamp registration numbers successfully matched with MP Bhulekh."

    upload_date = "2026-09-17"

    cursor.execute('''
        INSERT INTO documents (id, name, docType, parcelId, project, uploadedBy, uploadDate, verificationStatus, ocrMatchPct, discrepancyDetails)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (new_id, req.name, req.doc_type, req.parcel_id, req.project_name, req.uploaded_by, upload_date, status, match_pct, details))

    conn.commit()
    conn.close()

    return DocumentResponse(
        id=new_id,
        name=req.name,
        docType=req.doc_type,
        parcelId=req.parcel_id,
        project=req.project_name,
        uploadedBy=req.uploaded_by,
        uploadDate=upload_date,
        verificationStatus=status,
        ocrMatchPct=match_pct,
        discrepancyDetails=details
    )
