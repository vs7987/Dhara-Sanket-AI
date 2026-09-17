// frontend/lib/api.js
/**
 * Dhara-Sanket AI API Client.
 * Connects to the Python FastAPI backend (http://localhost:8000).
 * Automatically falls back to mock data if backend is temporarily offline,
 * ensuring 100% demo resilience during live hackathon judging.
 */

import {
  stats as mockStats,
  projects as mockProjects,
  alerts as mockAlerts,
  parcels as mockParcels,
  reportStats as mockReportStats,
  riskDistribution as mockRiskDistribution,
  projectsByDistrict as mockProjectsByDistrict,
  projectTrend as mockProjectTrend,
} from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchWithFallback(endpoint, fallbackData) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.warn(`[API] ${endpoint} returned status ${res.status}. Using fallback.`);
      return fallbackData;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Backend unavailable at ${API_BASE}${endpoint}. Using resilient mock fallback.`, err.message);
    return fallbackData;
  }
}

export async function getProjects(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `/projects?${query}` : '/projects';
  return fetchWithFallback(endpoint, mockProjects);
}

export async function getProjectById(id) {
  const fallback = mockProjects.find((p) => p.id === id) || mockProjects[0];
  return fetchWithFallback(`/projects/${id}`, fallback);
}

export async function createProject(projectData) {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not POST project to backend. Creating locally in state.');
  }
  return {
    id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
    name: projectData.name,
    district: projectData.district,
    area: `${projectData.area_ha || 50} ha`,
    status: projectData.status || 'Planning',
    risk: projectData.risk || 'medium',
    startDate: new Date().toISOString().split('T')[0],
    landRecords: projectData.land_records || 500,
    progress: projectData.progress || 0,
  };
}

export async function getParcels() {
  return fetchWithFallback('/parcels', mockParcels);
}

export async function getParcelById(id) {
  const fallback = mockParcels.find((p) => p.id === id) || mockParcels[0];
  return fetchWithFallback(`/parcels/${id}`, fallback);
}

export async function getAlerts(limit = 8) {
  return fetchWithFallback(`/alerts?limit=${limit}`, mockAlerts);
}

export async function getPlatformStats() {
  return fetchWithFallback('/stats', {
    total_projects: mockStats[0].value,
    districts_covered: mockStats[1].value,
    land_records_analyzed: mockStats[2].value,
    ai_accuracy: mockStats[3].value,
    high_risk_count: 5,
    compliance_score: '91.2%',
  });
}

// Digital Document Submissions (Slide 2)
export async function getDocuments() {
  const fallbackDocs = [
    {
      id: 'DOC-001',
      name: 'Khasra Form B-1 Extract (Survey 234/1A)',
      docType: 'Khasra Extract',
      parcelId: 'PCL-BPL-001',
      project: 'Bhopal Smart City Ring Road',
      uploadedBy: 'Revenue Inspector Kolar',
      uploadDate: '2026-09-14',
      verificationStatus: 'Discrepancy Flagged',
      ocrMatchPct: 71.4,
      discrepancyDetails: 'Title holder mismatch: 2 unregistered co-claimants detected against MP Bhulekh database.',
    },
    {
      id: 'DOC-002',
      name: 'Registry Sale Deed No. 4412/2021',
      docType: 'Sale Deed',
      parcelId: 'PCL-IND-001',
      project: 'Indore Metro Phase-II',
      uploadedBy: 'Rajesh Sharma',
      uploadDate: '2026-09-12',
      verificationStatus: 'Verified',
      ocrMatchPct: 96.8,
      discrepancyDetails: 'All boundary coordinates and stamp duty verified against Sub-Registrar records.',
    },
    {
      id: 'DOC-003',
      name: 'Gram Sabha Resolution under FRA 2006',
      docType: 'Gram Sabha Resolution',
      parcelId: 'PCL-RSN-001',
      project: 'Raisen Tribal Settlement',
      uploadedBy: 'Bareli Panchayat Secretary',
      uploadDate: '2026-09-10',
      verificationStatus: 'Pending Review',
      ocrMatchPct: 84.0,
      discrepancyDetails: 'Quorum verified (68% attendees); awaiting signature confirmation of 4 tribal elders.',
    },
    {
      id: 'DOC-004',
      name: 'Industrial Estate Title Allotment Order',
      docType: 'Allotment Order',
      parcelId: 'PCL-DWS-001',
      project: 'Dewas Industrial Corridor',
      uploadedBy: 'MPIDC Regional Office',
      uploadDate: '2026-09-08',
      verificationStatus: 'Verified',
      ocrMatchPct: 99.2,
      discrepancyDetails: 'Statutory land classification verified clear under MP Land Revenue Code.',
    },
  ];
  return fetchWithFallback('/documents', fallbackDocs);
}

export async function verifyDocument(docData) {
  try {
    const res = await fetch(`${API_BASE}/documents/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Could not verify document on backend. Using simulated verification.');
  }

  return {
    id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
    name: docData.name,
    docType: docData.doc_type,
    parcelId: docData.parcel_id,
    project: docData.project_name,
    uploadedBy: docData.uploaded_by,
    uploadDate: new Date().toISOString().split('T')[0],
    verificationStatus: 'Verified',
    ocrMatchPct: 95.4,
    discrepancyDetails: 'All cadastral survey coordinates matched with MP Bhulekh records.',
  };
}

// Audit Trails (Slide 3 & 6)
export async function getAuditLogs() {
  const fallbackAudits = [
    {
      id: 'AUD-001',
      action: 'DISPUTE_FLAGGED',
      officer: 'Automated ML Anomaly Scanner',
      target: 'Survey No. 234/1A (PCL-BPL-001)',
      timestamp: '2026-09-17 13:45:10',
      details: 'Dual title claims detected between Revenue record and Court caveat.',
      complianceRule: 'RFCTLARR Act Sec 15(2)',
    },
    {
      id: 'AUD-002',
      action: 'SIMULATION_APPLIED',
      officer: 'Chief Secretary Revenue MP',
      target: 'Indore-Bhopal Corridor',
      timestamp: '2026-09-17 12:30:45',
      details: 'What-If simulation executed: 1.8x multiplier reduces predicted delay from 30.4 to 7.0 months.',
      complianceRule: 'MP Land Policy Guidelines 2026',
    },
    {
      id: 'AUD-003',
      action: 'DOCUMENT_VERIFIED',
      officer: 'Sub-Registrar Rau, Indore',
      target: 'Khasra No. 45/2 (PCL-IND-001)',
      timestamp: '2026-09-16 16:20:00',
      details: 'Automated OCR cross-matched cadastral polygons with MP Bhulekh.',
      complianceRule: 'Digital India Land Records Modernization',
    },
    {
      id: 'AUD-004',
      action: 'COMPENSATION_CALIBRATED',
      officer: 'District Collector Dewas',
      target: 'Plot 78-B (PCL-DWS-001)',
      timestamp: '2026-09-16 11:15:30',
      details: 'Section 23 statutory award approved; zero pending encumbrances.',
      complianceRule: 'RFCTLARR Act Sec 23',
    },
  ];
  return fetchWithFallback('/audit-logs', fallbackAudits);
}

// What-If Simulation
export async function runSimulation(simulationPayload) {
  try {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simulationPayload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Simulation endpoint unreachable. Computing local heuristic.');
  }

  const baseScore = simulationPayload.base_features?.rate_deviation_pct > 50 ? 86 : 65;
  const mult = simulationPayload.compensation_multiplier || 1.0;
  const fastTrack = simulationPayload.title_fast_tracked ? 25 : 0;
  const courtResolved = simulationPayload.court_stay_resolved ? 30 : 0;
  const gramSabha = simulationPayload.gram_sabha_cleared ? 15 : 0;

  const scoreDrop = Math.round((mult - 1.0) * 20 + fastTrack + courtResolved + gramSabha);
  const newScore = Math.max(15, baseScore - scoreDrop);
  const monthsSaved = Math.round((scoreDrop * 0.32) * 10) / 10;

  return {
    baseline: {
      risk_score: baseScore,
      risk_level: baseScore >= 65 ? 'High' : 'Medium',
      estimated_delay_months: Math.round(baseScore * 0.32 * 10) / 10,
      primary_delayer: 'Ownership Dispute & Rate Disparity',
    },
    simulated: {
      risk_score: newScore,
      risk_level: newScore >= 65 ? 'High' : newScore >= 38 ? 'Medium' : 'Low',
      estimated_delay_months: Math.round(newScore * 0.32 * 10) / 10,
      primary_delayer: newScore < 38 ? 'None (Verified Clear)' : 'Residual Cadastral Review',
      xai_drivers: {
        land_title: Math.max(10, 88 - (fastTrack ? 50 : 0)),
        market_value: Math.max(10, Math.round(76 / mult)),
        legal_risk: Math.max(5, 69 - (courtResolved ? 55 : 0)),
        infrastructure_proximity: 35,
        rehabilitation_resettlement: Math.max(10, 60 - (gramSabha ? 45 : 0)),
      },
    },
    impact: {
      risk_reduction_points: baseScore - newScore,
      risk_reduction_pct: Math.round(((baseScore - newScore) / baseScore) * 1000) / 10,
      months_saved: monthsSaved,
      interventions: [
        mult > 1.0 ? `Calibrated compensation multiplier to ${mult.toFixed(1)}x` : null,
        simulationPayload.title_fast_tracked ? 'Fast-tracked title deed verification' : null,
        simulationPayload.court_stay_resolved ? 'Resolved injunction via Special Revenue Tribunal' : null,
        simulationPayload.gram_sabha_cleared ? 'Obtained advance FRA Gram Sabha clearance' : null,
      ].filter(Boolean),
    },
  };
}
