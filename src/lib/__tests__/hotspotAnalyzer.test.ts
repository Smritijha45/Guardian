import { describe, it, expect } from 'vitest';
import { analyzeHotspots } from '../hotspotAnalyzer';
import { IncidentReport } from '../types';

describe('analyzeHotspots Unit Tests', () => {
  it('returns empty array when reports list is empty', () => {
    const result = analyzeHotspots([]);
    expect(result).toEqual([]);
  });

  it('clusters reports by landmark and generates proactive hotspot alerts for risk scores >= 80', () => {
    const sampleReports: IncidentReport[] = [
      {
        id: 'REP-1',
        title: 'Unlit lamp post',
        category: 'lighting',
        description: 'Dark pathway near Hostel complex',
        latitude: 30.2520,
        longitude: 77.0474,
        status: 'reported',
        severity: 'emergency',
        location_name: 'MMDU Hostels Complex, Mullana, Haryana',
        created_at: '2026-08-19T20:00:00Z',
        updated_at: '2026-08-19T20:00:00Z',
      },
      {
        id: 'REP-2',
        title: 'Suspicious person',
        category: 'suspicious',
        description: 'Stranger tailgating hostel gate',
        latitude: 30.2522,
        longitude: 77.0475,
        status: 'under_action',
        severity: 'high',
        location_name: 'MMDU Hostels Complex, Mullana, Haryana',
        created_at: '2026-08-19T21:00:00Z',
        updated_at: '2026-08-19T21:00:00Z',
      },
      {
        id: 'REP-3',
        title: 'Broken window',
        category: 'hazard',
        description: 'Glass hazard near hostel entrance',
        latitude: 30.2521,
        longitude: 77.0476,
        status: 'reported',
        severity: 'high',
        location_name: 'MMDU Hostels Complex, Mullana, Haryana',
        created_at: '2026-08-19T21:30:00Z',
        updated_at: '2026-08-19T21:30:00Z',
      },
    ];

    const alerts = analyzeHotspots(sampleReports);
    expect(alerts.length).toBeGreaterThan(0);
    const alert = alerts[0];
    expect(alert.location).toContain('Hostels Complex');
    expect(alert.riskScore).toBeGreaterThanOrEqual(80);
    expect(alert.incidentCount).toBe(3);
    expect(alert.recommendedAction).toBeDefined();
  });

  it('filters out location clusters with risk score under 80', () => {
    const lowRiskReports: IncidentReport[] = [
      {
        id: 'REP-LOW',
        title: 'Minor litter',
        category: 'other',
        description: 'Small trash bin full near sports field',
        latitude: 30.2500,
        longitude: 77.0400,
        status: 'reported',
        severity: 'low',
        location_name: 'MMDU Sports Complex, Mullana, Haryana',
        created_at: '2026-08-19T10:00:00Z',
        updated_at: '2026-08-19T10:00:00Z',
      },
    ];

    const alerts = analyzeHotspots(lowRiskReports);
    expect(alerts).toHaveLength(0);
  });
});
