# backend/routes/projects.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import sqlite3

from models import ProjectResponse, ProjectCreate
from database import get_connection

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    district: Optional[str] = Query(None, description="Filter by MP district"),
    risk: Optional[str] = Query(None, description="Filter by risk (high, medium, low)"),
    search: Optional[str] = Query(None, description="Search name or ID")
):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM projects WHERE 1=1"
    params = []

    if district:
        query += " AND LOWER(district) = LOWER(?)"
        params.append(district)
    if risk:
        query += " AND LOWER(risk) = LOWER(?)"
        params.append(risk)
    if search:
        query += " AND (LOWER(name) LIKE LOWER(?) OR LOWER(id) LIKE LOWER(?))"
        params.extend([f"%{search}%", f"%{search}%"])

    query += " ORDER BY id ASC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [
        ProjectResponse(
            id=r['id'],
            name=r['name'],
            district=r['district'],
            area=r['area'],
            status=r['status'],
            risk=r['risk'],
            startDate=r['startDate'],
            landRecords=r['landRecords'],
            progress=r['progress']
        )
        for r in rows
    ]

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    return ProjectResponse(
        id=row['id'],
        name=row['name'],
        district=row['district'],
        area=row['area'],
        status=row['status'],
        risk=row['risk'],
        startDate=row['startDate'],
        landRecords=row['landRecords'],
        progress=row['progress']
    )

@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM projects")
    count = cursor.fetchone()[0]
    new_id = f"PRJ-{str(count + 1).zfill(3)}"

    area_str = f"{data.area_ha:.1f} ha"

    cursor.execute('''
        INSERT INTO projects (id, name, district, area, status, risk, startDate, landRecords, progress)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (new_id, data.name, data.district, area_str, data.status, data.risk, data.start_date, data.land_records, data.progress))

    conn.commit()
    conn.close()

    return ProjectResponse(
        id=new_id,
        name=data.name,
        district=data.district,
        area=area_str,
        status=data.status,
        risk=data.risk,
        startDate=data.start_date,
        landRecords=data.land_records,
        progress=data.progress
    )
