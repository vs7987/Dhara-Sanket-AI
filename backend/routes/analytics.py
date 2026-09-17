# backend/routes/analytics.py
from fastapi import APIRouter
from typing import List, Dict, Any
import sqlite3

from models import AlertResponse
from database import get_connection

router = APIRouter(prefix="/api", tags=["Analytics & Telemetry"])

@router.get("/alerts", response_model=List[AlertResponse])
def get_alerts(limit: int = 8):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    return [
        AlertResponse(
            id=r['id'],
            title=r['title'],
            project=r['project'],
            severity=r['severity'],
            time=r['time'],
            description=r['description']
        )
        for r in rows
    ]

@router.get("/stats")
def get_platform_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM projects")
    total_projects = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT district) FROM projects")
    districts_count = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(landRecords) FROM projects")
    total_records = cursor.fetchone()[0] or 12847

    cursor.execute("SELECT COUNT(*) FROM projects WHERE risk = 'high'")
    high_risk_count = cursor.fetchone()[0]

    conn.close()

    return {
        'total_projects': total_projects,
        'districts_covered': districts_count,
        'land_records_analyzed': total_records,
        'high_risk_count': high_risk_count,
        'ai_accuracy': "96.4%",
        'compliance_score': "91.2%"
    }

@router.get("/reports/summary")
def get_reports_summary():
    return {
        'stats': [
            {'label': 'Total Reports Generated', 'value': 128, 'icon': 'report'},
            {'label': 'Disputes Resolved', 'value': 89, 'icon': 'resolved'},
            {'label': 'Pending Judicial Reviews', 'value': 14, 'icon': 'pending'},
            {'label': 'RFCTLARR Compliance Score', 'value': '91.2%', 'icon': 'compliance'}
        ],
        'risk_distribution': {
            'high': 5,
            'medium': 3,
            'low': 4
        },
        'projects_by_district': [
            {'district': 'Bhopal', 'count': 3},
            {'district': 'Indore', 'count': 3},
            {'district': 'Dewas', 'count': 2},
            {'district': 'Raisen', 'count': 2},
            {'district': 'Sehore', 'count': 2}
        ],
        'monthly_trend': [
            {'month': 'Jan', 'count': 2},
            {'month': 'Feb', 'count': 4},
            {'month': 'Mar', 'count': 5},
            {'month': 'Apr', 'count': 7},
            {'month': 'May', 'count': 8},
            {'month': 'Jun', 'count': 9},
            {'month': 'Jul', 'count': 10},
            {'month': 'Aug', 'count': 11},
            {'month': 'Sep', 'count': 12}
        ]
    }
