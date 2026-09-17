# backend/database.py
"""
SQLite database and seed repository for Dhara-Sanket AI.
Provides persistent storage with zero external database dependencies for hackathon simplicity.
Includes: Projects, Cadastral Parcels, Digital Document Submissions, Alerts, and Audit Trails.
"""

import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dhara_sanket.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Projects Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            district TEXT NOT NULL,
            area TEXT NOT NULL,
            status TEXT NOT NULL,
            risk TEXT NOT NULL,
            startDate TEXT NOT NULL,
            landRecords INTEGER NOT NULL,
            progress INTEGER NOT NULL
        )
    ''')

    # Parcels Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS parcels (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            district TEXT NOT NULL,
            area TEXT NOT NULL,
            riskScore INTEGER NOT NULL,
            riskFactors TEXT NOT NULL,
            owner TEXT NOT NULL,
            landUse TEXT NOT NULL,
            lastUpdated TEXT NOT NULL,
            confidence TEXT,
            primaryDelayer TEXT,
            recommendedAction TEXT
        )
    ''')

    # Alerts Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            project TEXT NOT NULL,
            severity TEXT NOT NULL,
            time TEXT NOT NULL,
            description TEXT NOT NULL
        )
    ''')

    # Digital Document Submissions & AI Verification Table (Slide 2)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            docType TEXT NOT NULL,
            parcelId TEXT NOT NULL,
            project TEXT NOT NULL,
            uploadedBy TEXT NOT NULL,
            uploadDate TEXT NOT NULL,
            verificationStatus TEXT NOT NULL,
            ocrMatchPct REAL NOT NULL,
            discrepancyDetails TEXT
        )
    ''')

    # Audit Trails & Compliance Logs Table (Slide 3 & 6)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id TEXT PRIMARY KEY,
            action TEXT NOT NULL,
            officer TEXT NOT NULL,
            target TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            details TEXT NOT NULL,
            complianceRule TEXT NOT NULL
        )
    ''')

    # Seed Initial Data if empty
    cursor.execute('SELECT COUNT(*) FROM projects')
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)

    # Seed documents if empty
    cursor.execute('SELECT COUNT(*) FROM documents')
    if cursor.fetchone()[0] == 0:
        seed_documents_and_audit(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    initial_projects = [
        ('PRJ-001', 'Bhopal Smart City Ring Road Extension', 'Bhopal', '245.8 ha', 'In Progress', 'high', '2026-03-15', 1842, 35),
        ('PRJ-002', 'Indore Metro Phase-II Land Acquisition', 'Indore', '182.3 ha', 'In Progress', 'medium', '2026-01-20', 1356, 58),
        ('PRJ-003', 'Dewas Industrial Corridor Development', 'Dewas', '520.1 ha', 'Planning', 'low', '2026-06-01', 2104, 12),
        ('PRJ-004', 'Raisen Highway Bypass Construction', 'Raisen', '98.7 ha', 'In Progress', 'high', '2026-02-10', 876, 42),
        ('PRJ-005', 'Sehore Agricultural Zone Reallocation', 'Sehore', '310.4 ha', 'Review', 'medium', '2026-04-22', 1589, 68),
        ('PRJ-006', 'Bhopal Lake Front Urban Renewal', 'Bhopal', '75.2 ha', 'In Progress', 'high', '2026-05-08', 634, 25),
        ('PRJ-007', 'Indore SEZ Phase-III Expansion', 'Indore', '420.0 ha', 'Approved', 'low', '2026-07-15', 2890, 5),
        ('PRJ-008', 'Dewas Solar Park Land Acquisition', 'Dewas', '680.5 ha', 'In Progress', 'medium', '2026-02-28', 1245, 51),
        ('PRJ-009', 'Raisen Tribal Rehabilitation Settlement', 'Raisen', '156.3 ha', 'Review', 'high', '2026-01-05', 945, 72),
        ('PRJ-010', 'Sehore Water Pipeline Corridor', 'Sehore', '89.6 ha', 'In Progress', 'low', '2026-08-01', 412, 18),
        ('PRJ-011', 'Bhopal Eastern Freight Corridor', 'Bhopal', '345.2 ha', 'Planning', 'medium', '2026-09-10', 1678, 8),
        ('PRJ-012', 'Indore Riverfront Development', 'Indore', '128.9 ha', 'In Progress', 'high', '2026-04-01', 756, 44)
    ]
    cursor.executemany('''
        INSERT INTO projects (id, name, district, area, status, risk, startDate, landRecords, progress)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', initial_projects)

    initial_parcels = [
        (
            'PCL-BPL-001',
            'Survey No. 234/1A, Kolar',
            'Bhopal',
            '12.5 ha',
            87,
            json.dumps({'ownershipDispute': 92, 'documentMismatch': 78, 'encroachment': 85, 'landUseViolation': 65, 'priceAnomaly': 45}),
            'Multiple Claimants (Joint Title)',
            'Residential / Agricultural (Disputed)',
            '2026-09-15',
            '92% (High)',
            'Ownership Dispute & Multiple Title Claims',
            'Trigger automated gazette notification audit; freeze compensation disbursement until dual title claim in District Court is resolved.'
        ),
        (
            'PCL-IND-001',
            'Khasra No. 45/2, Rau',
            'Indore',
            '8.2 ha',
            54,
            json.dumps({'ownershipDispute': 30, 'documentMismatch': 72, 'encroachment': 15, 'landUseViolation': 60, 'priceAnomaly': 55}),
            'Rajesh Sharma & 2 Others',
            'Commercial / Light Industrial',
            '2026-09-14',
            '88% (High)',
            'Document & Registry Mismatch',
            'Request urgent re-survey by Indore Revenue Department and cross-check Circle Rate multiplier.'
        ),
        (
            'PCL-DWS-001',
            'Plot 78-B, Industrial Area',
            'Dewas',
            '45.0 ha',
            22,
            json.dumps({'ownershipDispute': 10, 'documentMismatch': 15, 'encroachment': 5, 'landUseViolation': 30, 'priceAnomaly': 25}),
            'MP State Industrial Dev. Corp.',
            'Industrial Estate',
            '2026-09-13',
            '95% (Very High)',
            'None (Verified Clear)',
            'Ready for possession transfer and Stage 4 RFCTLARR statutory award gazette.'
        ),
        (
            'PCL-RSN-001',
            'Survey No. 112, Bareli',
            'Raisen',
            '18.7 ha',
            79,
            json.dumps({'ownershipDispute': 85, 'documentMismatch': 60, 'encroachment': 90, 'landUseViolation': 75, 'priceAnomaly': 40}),
            'Tribal Community (Schedule V)',
            'Forest / Agricultural',
            '2026-09-12',
            '91% (High)',
            'Tribal Land & Forest Boundary Dispute',
            'Convene Special Gram Sabha under FRA 2006 and schedule rehabilitation hearing with District Collector.'
        )
    ]
    cursor.executemany('''
        INSERT INTO parcels (id, name, district, area, riskScore, riskFactors, owner, landUse, lastUpdated, confidence, primaryDelayer, recommendedAction)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', initial_parcels)

    initial_alerts = [
        ('ALT-001', 'Ownership Dispute Detected', 'Bhopal Smart City Ring Road Extension', 'high', '12 min ago', 'Multiple ownership claims found for Survey No. 234/1A in Kolar area.'),
        ('ALT-002', 'Land Use Violation', 'Raisen Highway Bypass Construction', 'high', '34 min ago', 'Agricultural land re-classified without proper revenue documentation.'),
        ('ALT-003', 'Encroachment Alert', 'Bhopal Lake Front Urban Renewal', 'high', '1 hr ago', 'Unauthorized construction detected on acquired parcel BPL-045.'),
        ('ALT-004', 'Document Mismatch', 'Indore Metro Phase-II Land Acquisition', 'medium', '2 hrs ago', 'Registry records do not match revenue mutation records for 3 parcels.'),
        ('ALT-005', 'Price Anomaly Flagged', 'Sehore Agricultural Zone Reallocation', 'medium', '3 hrs ago', 'Market value deviates by 42% from government circle rate.'),
        ('ALT-006', 'Survey Boundary Update', 'Dewas Industrial Corridor Development', 'low', '5 hrs ago', 'Digital survey boundaries updated for 12 parcels in Sector 4.'),
        ('ALT-007', 'Compliance Check Passed', 'Indore SEZ Phase-III Expansion', 'low', '6 hrs ago', 'Environmental clearance documents verified successfully.'),
        ('ALT-008', 'Tribal Land Classification Issue', 'Raisen Tribal Rehabilitation Settlement', 'high', '8 hrs ago', 'Schedule V land parcels require additional governmental Gram Sabha approval.')
    ]
    cursor.executemany('''
        INSERT INTO alerts (id, title, project, severity, time, description)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', initial_alerts)

def seed_documents_and_audit(cursor):
    initial_docs = [
        ('DOC-001', 'Khasra Form B-1 Extract (Survey 234/1A)', 'Khasra Extract', 'PCL-BPL-001', 'Bhopal Smart City Ring Road', 'Revenue Inspector Kolar', '2026-09-14', 'Discrepancy Flagged', 71.4, 'Title holder mismatch: 2 unregistered co-claimants detected against MP Bhulekh database.'),
        ('DOC-002', 'Registry Sale Deed No. 4412/2021', 'Sale Deed', 'PCL-IND-001', 'Indore Metro Phase-II', 'Rajesh Sharma', '2026-09-12', 'Verified', 96.8, 'All boundary coordinates and stamp duty verified against Sub-Registrar records.'),
        ('DOC-003', 'Gram Sabha Resolution under FRA 2006', 'Gram Sabha Resolution', 'PCL-RSN-001', 'Raisen Tribal Settlement', 'Bareli Panchayat Secretary', '2026-09-10', 'Pending Review', 84.0, 'Quorum verified (68% attendees); awaiting signature confirmation of 4 tribal elders.'),
        ('DOC-004', 'Industrial Estate Title Allotment Order', 'Allotment Order', 'PCL-DWS-001', 'Dewas Industrial Corridor', 'MPIDC Regional Office', '2026-09-08', 'Verified', 99.2, 'Statutory land classification verified clear under MP Land Revenue Code.'),
        ('DOC-005', 'MoEFCC Stage-I Forest Clearance NOC', 'Environmental NOC', 'PCL-RSN-001', 'Raisen Highway Bypass', 'Divisional Forest Officer', '2026-09-05', 'Verified', 94.0, 'Compensatory afforestation land earmarked in Sehore district.')
    ]
    cursor.executemany('''
        INSERT INTO documents (id, name, docType, parcelId, project, uploadedBy, uploadDate, verificationStatus, ocrMatchPct, discrepancyDetails)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', initial_docs)

    initial_audits = [
        ('AUD-001', 'DISPUTE_FLAGGED', 'Automated ML Anomaly Scanner', 'Survey No. 234/1A (PCL-BPL-001)', '2026-09-17 13:45:10', 'Dual title claims detected between Revenue record and Court caveat.', 'RFCTLARR Act Sec 15(2)'),
        ('AUD-002', 'SIMULATION_APPLIED', 'Chief Secretary Revenue MP', 'Indore-Bhopal Corridor', '2026-09-17 12:30:45', 'What-If simulation executed: 1.8x multiplier reduces predicted delay from 30.4 to 7.0 months.', 'MP Land Policy Guidelines 2026'),
        ('AUD-003', 'DOCUMENT_VERIFIED', 'Sub-Registrar Rau, Indore', 'Khasra No. 45/2 (PCL-IND-001)', '2026-09-16 16:20:00', 'Automated OCR cross-matched cadastral polygons with MP Bhulekh.', 'Digital India Land Records Modernization'),
        ('AUD-004', 'COMPENSATION_CALIBRATED', 'District Collector Dewas', 'Plot 78-B (PCL-DWS-001)', '2026-09-16 11:15:30', 'Section 23 statutory award approved; zero pending encumbrances.', 'RFCTLARR Act Sec 23'),
        ('AUD-005', 'LOK_ADALAT_REFERRAL', 'Special Land Acquisition Officer', 'Survey No. 112 (PCL-RSN-001)', '2026-09-15 09:40:12', 'Referred compensation dispute to Revenue Lok Adalat for fast-track 30-day settlement.', 'Fast-Track Land Dispute Protocol')
    ]
    cursor.executemany('''
        INSERT INTO audit_logs (id, action, officer, target, timestamp, details, complianceRule)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', initial_audits)

# Initialize on import
init_db()
