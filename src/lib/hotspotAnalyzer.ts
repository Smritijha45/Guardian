import { IncidentReport, ProactiveHotspotAlert } from './types';

export function analyzeHotspots(reports: IncidentReport[]): ProactiveHotspotAlert[] {
  if (!reports || reports.length === 0) return [];

  // Group active or recent reports by location landmark
  const locationGroups: { [key: string]: IncidentReport[] } = {};

  reports.forEach((report) => {
    let locKey = report.location_name || 'MMDU Campus Area, Mullana, Haryana';
    
    // Normalize location names to cluster nearby reports
    if (locKey.toLowerCase().includes('library')) locKey = 'MMDU Central Library, Mullana, Haryana';
    else if (locKey.toLowerCase().includes('hostel')) locKey = 'MMDU Hostels Complex, Mullana, Haryana';
    else if (locKey.toLowerCase().includes('engineering') || locKey.toLowerCase().includes('mmec')) locKey = 'MMEC Engineering Block, MMDU, Mullana, Haryana';
    else if (locKey.toLowerCase().includes('medical') || locKey.toLowerCase().includes('hospital') || locKey.toLowerCase().includes('mmimsr')) locKey = 'MMIMSR Medical College, Mullana, Haryana';
    else if (locKey.toLowerCase().includes('quad') || locKey.toLowerCase().includes('activity')) locKey = 'MMDU Student Quad, Mullana, Haryana';
    else if (locKey.toLowerCase().includes('sports') || locKey.toLowerCase().includes('stadium')) locKey = 'MMDU Sports Complex, Mullana, Haryana';

    if (!locationGroups[locKey]) {
      locationGroups[locKey] = [];
    }
    locationGroups[locKey].push(report);
  });

  const alerts: ProactiveHotspotAlert[] = [];

  Object.entries(locationGroups).forEach(([location, groupReports], index) => {
    const incidentCount = groupReports.length;
    
    let highSevCount = 0;
    let emergencyCount = 0;
    let totalScoreWeight = 0;

    groupReports.forEach((r) => {
      if (r.severity === 'emergency') {
        emergencyCount++;
        totalScoreWeight += 45;
      } else if (r.severity === 'high' || r.ai_severity === 'high') {
        highSevCount++;
        totalScoreWeight += 35;
      } else if (r.severity === 'medium' || r.ai_severity === 'medium') {
        totalScoreWeight += 20;
      } else {
        totalScoreWeight += 10;
      }
    });

    // Calculate dynamic risk score capped at 98
    let riskScore = Math.min(98, Math.round(55 + (incidentCount * 12) + (highSevCount * 10) + (emergencyCount * 15)));

    // Only include high-risk hotspots (80+)
    if (riskScore >= 80) {
      // Determine peak hour window from timestamps
      const hours = groupReports.map((r) => new Date(r.created_at).getHours());
      const avgHour = hours.length > 0 ? Math.round(hours.reduce((a, b) => a + b, 0) / hours.length) : 20;
      const startHourStr = avgHour > 12 ? `${avgHour - 12} PM` : `${avgHour} AM`;
      const endHourStr = (avgHour + 3) > 12 ? `${(avgHour + 3) - 12} PM` : `${avgHour + 3} AM`;
      const timePattern = `Most incidents occurred between ${startHourStr}–${endHourStr}.`;

      // Main issue & Rationale
      const categories = groupReports.map((r) => r.ai_category || r.category);
      const topCategory = categories[0] || 'Physical Hazards & Low Lighting';

      let whyRisky = 'Multiple high-risk safety concerns and low visibility reported along primary walkways.';
      if (topCategory.toLowerCase().includes('light')) {
        whyRisky = 'Frequent streetlight outages combined with unlit dark pathways create severe night visibility hazards.';
      } else if (topCategory.toLowerCase().includes('suspicious') || topCategory.toLowerCase().includes('harass')) {
        whyRisky = 'Repeated reports of suspicious followers or unauthorized presence near student residential access gates.';
      } else if (topCategory.toLowerCase().includes('hazard') || topCategory.toLowerCase().includes('electric')) {
        whyRisky = 'Unrepaired environmental infrastructure hazards and exposed conduit pathways posing immediate physical threat.';
      }

      let recommendedAction = 'Use lit main campus boulevards, travel with peers, and avoid unlit pathways during peak risk hours.';
      if (location.toLowerCase().includes('hostel')) {
        recommendedAction = 'Use the main security-monitored gate entrance and request a campus security escort after dusk (+91 1731-274475).';
      }

      const sampleLat = groupReports[0]?.latitude || 30.2520;
      const sampleLng = groupReports[0]?.longitude || 77.0474;

      alerts.push({
        id: `HOTSPOT-ALERT-${index + 1}`,
        location,
        riskScore,
        incidentCount,
        mainIssue: topCategory,
        whyRisky,
        timePattern,
        recommendedAction,
        latitude: sampleLat,
        longitude: sampleLng,
        created_at: new Date().toISOString(),
      });
    }
  });

  return alerts;
}
