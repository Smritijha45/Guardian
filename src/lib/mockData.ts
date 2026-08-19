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
    title: 'Advisory: Monsoon Fog & Fogging Notice (MMDU Mullana)',
    message: 'Poor visibility expected on MMDU campus pathways after dusk. Campus security patrols operate 24/7.',
    level: 'warning',
    location_scope: 'MMDU Campus-Wide, Mullana, Haryana',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'alt_2',
    title: 'Maintenance Alert: MMEC Block Walkway Lighting Repair',
    message: 'Facilities repair underway near MMEC Engineering Block pathway, Mullana, Haryana. Temporary lighting installed.',
    level: 'info',
    location_scope: 'MMEC Pathway, Mullana, Haryana',
    is_active: true,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

export const INITIAL_REPORTS: IncidentReport[] = [];
