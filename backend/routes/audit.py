# backend/routes/audit.py
"""
Audit Trails & Compliance Logs API (Slide 3 & 6).
Provides immutable event tracking for statutory RFCTLARR compliance and decision governance.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

from database import get_connection

router = APIRouter(prefix="/api/audit-logs", tags=["Audit & Security"])

class AuditLogResponse(BaseModel):
    id: str
    action: str
    officer: str
    target: str
    timestamp: str
    details: str
    complianceRule: str

@router.get("", response_model=List[AuditLogResponse])
def get_audit_logs(limit: int = 15):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    return [
        AuditLogResponse(
            id=r['id'],
            action=r['action'],
            officer=r['officer'],
            target=r['target'],
            timestamp=r['timestamp'],
            details=r['details'],
            complianceRule=r['complianceRule']
        )
        for r in rows
    ]
