export type ReportCategory = 
  | 'hazard' 
  | 'lighting' 
  | 'suspicious' 
  | 'theft' 
  | 'harassment' 
  | 'medical' 
  | 'other';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'emergency';

export type ReportStatus = 'reported' | 'under_review' | 'resolved';

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  created_at?: string;
  full_name?: string;
}

export interface IncidentReport {
  id: string;
  user_id?: string | null;
  category: ReportCategory;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;

  title: string;
  severity: ReportSeverity;
  location_name: string;
  is_anonymous?: boolean;
  user_name?: string;
  resolution_notes?: string;
}

export interface SafetyAlert {
  id: string;
  title: string;
  message: string;
  level: 'emergency' | 'warning' | 'info';
  location_scope: string;
  is_active: boolean;
  created_at: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  category: 'library' | 'dorm' | 'dining' | 'sports' | 'academic' | 'parking';
}
