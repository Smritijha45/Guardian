import { IncidentReport, SafetyAlert, CampusLocation, UserProfile } from './types';

// Maharishi Markandeshwar University (MMDU), Mullana, Ambala, Haryana, India
export const CAMPUS_CENTER = {
  lat: 30.2520,
  lng: 77.0474,
  zoom: 16,
};

export const DEFAULT_COUNTRY = 'India';
export const DEFAULT_STATE = 'Haryana';
export const DEFAULT_CAMPUS = 'MM(DU) Mullana, Haryana';

export const MOCK_USER: UserProfile = {
  id: 'usr_student_01',
  name: 'Aarav Sharma',
  full_name: 'Aarav Sharma',
  email: 'aarav.sharma@mmumullana.edu.in',
  role: 'student',
  department: 'Computer Science & Engineering',
};

export const MOCK_ADMIN: UserProfile = {
  id: 'usr_admin_01',
  name: 'Captain Rajesh Kumar',
  full_name: 'Captain Rajesh Kumar',
  email: 'r.kumar@mmumullana.edu.in',
  role: 'admin',
  department: 'Campus Safety & Security, MM(DU) Mullana',
};

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 'loc_1', name: 'MMDU Central Library, Mullana, Haryana', code: 'MMDU-LIB', latitude: 30.2525, longitude: 77.0470, category: 'library' },
  { id: 'loc_2', name: 'MMEC Engineering Block, MMDU, Mullana, Haryana', code: 'MMEC-ENG', latitude: 30.2518, longitude: 77.0480, category: 'academic' },
  { id: 'loc_3', name: 'MMIMSR Medical College & Hospital, Mullana, Haryana', code: 'MMIMSR-MED', latitude: 30.2530, longitude: 77.0465, category: 'academic' },
  { id: 'loc_4', name: 'MMDU Student Quad & Activity Center, Mullana, Haryana', code: 'MMDU-QUAD', latitude: 30.2520, longitude: 77.0474, category: 'academic' },
  { id: 'loc_5', name: 'MMDU Hostels Complex, Mullana, Haryana', code: 'MMDU-HOSTEL', latitude: 30.2510, longitude: 77.0485, category: 'dorm' },
  { id: 'loc_6', name: 'MMDU Sports Complex & Stadium, Mullana, Haryana', code: 'MMDU-SPORTS', latitude: 30.2505, longitude: 77.0460, category: 'sports' },
  { id: 'loc_7', name: 'MMDU Administrative Block, Mullana, Haryana', code: 'MMDU-ADMIN', latitude: 30.2528, longitude: 77.0478, category: 'academic' },
];

export const INITIAL_ALERTS: SafetyAlert[] = [
  {
    id: 'alt_1',
    title: 'Advisory: Fog & Dusk Visibility Notice (MMDU Mullana)',
    message: 'Reduced visibility on MMDU campus pathways after dusk. 24/7 security escorts available (+91 1731-274475).',
    level: 'warning',
    location_scope: 'MMDU Campus-Wide, Mullana, Haryana',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'alt_2',
    title: 'Maintenance Alert: MMEC Pathway Lighting Repair',
    message: 'Facilities repair underway near MMEC Engineering Block pathway, Mullana, Haryana. Temporary lighting installed.',
    level: 'info',
    location_scope: 'MMEC Pathway, Mullana, Haryana',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'REP-2026-101',
    user_id: 'usr_student_01',
    title: 'Unlit Walkway Light near MMDU Central Library',
    category: 'lighting',
    description: 'The street lamps along the north pathway leading from MMDU Central Library to Hostel Block are completely dark after 7 PM.',
    latitude: 30.2525,
    longitude: 77.0470,
    location_name: 'MMDU Central Library, Mullana, Haryana',
    severity: 'medium',
    status: 'under_review',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    is_anonymous: false,
    ai_severity: 'medium',
    ai_category: 'Lighting Infrastructure',
    ai_risk_reason: 'Poor nocturnal lighting near student library route poses slip hazard and reduces surveillance visibility. Facilities dispatch recommended.',
  },
  {
    id: 'REP-2026-102',
    user_id: null,
    title: 'Exposed Electrical Wiring near MMEC Engineering Gate',
    category: 'hazard',
    description: 'Exposed wire conduit sticking out of ground near MMEC Engineering Block entrance steps, Mullana, Haryana.',
    latitude: 30.2518,
    longitude: 77.0480,
    location_name: 'MMEC Engineering Block, MMDU, Mullana, Haryana',
    severity: 'high',
    status: 'reported',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    is_anonymous: true,
    ai_severity: 'high',
    ai_category: 'Physical Hazard',
    ai_risk_reason: 'Exposed high-voltage electrical hazard in high-foot-traffic student zone. Priority cordoning and emergency electrical repair required.',
  },
];
