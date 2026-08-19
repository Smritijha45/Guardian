export type ReportCategory = 
  | 'hazard' 
  | 'lighting' 
  | 'suspicious' 
  | 'theft' 
  | 'harassment' 
  | 'medical' 
  | 'other';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'emergency';

export type ReportStatus = 'reported' | 'under_review' | 'under_action' | 'resolved';

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

  // Phase 3 Response Workflow
  assigned_action?: string;
  action_note?: string;

  // AI Safety Intelligence
  ai_severity?: 'low' | 'medium' | 'high';
  ai_category?: string;
  ai_risk_reason?: string;
}

export interface ProactiveHotspotAlert {
  id: string;
  location: string;
  riskScore: number;
  incidentCount: number;
  mainIssue: string;
  whyRisky: string;
  timePattern: string;
  recommendedAction: string;
  latitude: number;
  longitude: number;
  created_at: string;
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
