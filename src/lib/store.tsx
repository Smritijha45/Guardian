'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IncidentReport, SafetyAlert, UserProfile, UserRole, ReportStatus, ReportCategory } from './types';
import { INITIAL_REPORTS, INITIAL_ALERTS, MOCK_USER, MOCK_ADMIN } from './mockData';
import { createClient } from './supabase/client';

interface SafetyContextType {
  reports: IncidentReport[];
  alerts: SafetyAlert[];
  currentUser: UserProfile;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  addReport: (newReport: {
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    imageFile?: File | null;
    image_url?: string | null;
    title?: string;
    severity?: any;
    location_name?: string;
    is_anonymous?: boolean;
  }) => Promise<IncidentReport | null>;
  updateReportStatus: (reportId: string, status: ReportStatus, resolutionNotes?: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  activeAlertCount: number;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [alerts] = useState<SafetyAlert[]>(INITIAL_ALERTS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USER);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Helper function to fetch profile and reports from Supabase
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);

        // Fetch user profile from Supabase
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData) {
          const userProf: UserProfile = {
            id: profileData.id,
            name: profileData.name || user.user_metadata?.full_name || user.user_metadata?.name || 'Campus Member',
            full_name: profileData.name || user.user_metadata?.full_name || user.user_metadata?.name || 'Campus Member',
            email: profileData.email || user.email || '',
            role: (profileData.role as UserRole) || 'student',
            created_at: profileData.created_at,
          };
          setCurrentUser(userProf);
          setCurrentRole(userProf.role);
        } else {
          const fallbackProf: UserProfile = {
            id: user.id,
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
            full_name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            role: (user.user_metadata?.role as UserRole) || 'student',
          };
          setCurrentUser(fallbackProf);
          setCurrentRole(fallbackProf.role);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(MOCK_USER);
        setCurrentRole('student');
      }

      // Fetch reports from Supabase (RLS applies automatically)
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsData && !reportsError) {
        const mappedReports: IncidentReport[] = reportsData.map((r: any) => ({
          id: r.id,
          user_id: r.user_id,
          category: r.category as ReportCategory,
          description: r.description,
          latitude: r.latitude,
          longitude: r.longitude,
          image_url: r.image_url,
          status: r.status as ReportStatus,
          created_at: r.created_at,
          updated_at: r.updated_at,
          title: r.description.slice(0, 40) + (r.description.length > 40 ? '...' : ''),
          location_name: `Lat: ${r.latitude.toFixed(3)}, Lng: ${r.longitude.toFixed(3)}`,
          severity: 'medium',
        }));
        setReports(mappedReports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.warn('Error refreshing data from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refreshData();

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
      refreshData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshData, supabase]);

  // Auth: Sign Up
  const signUp = async (email: string, password: string, name: string, role: UserRole = 'student') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
          role,
        },
      },
    });

    if (!error && data.user) {
      // Ensure profile entry exists
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        email,
        role,
      });
      await refreshData();
    }
    return { error };
  };

  // Auth: Sign In
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      await refreshData();
    }
    return { error };
  };

  // Auth: Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(MOCK_USER);
    setCurrentRole('student');
    setReports([]);
  };

  // Set Role manual override for simulator/testing UI
  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'admin') {
      setCurrentUser(MOCK_ADMIN);
    } else {
      setCurrentUser(MOCK_USER);
    }
  };

  // Storage upload helper
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.warn('Storage upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage.from('report-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (e) {
      console.warn('Image upload exception:', e);
      return null;
    }
  };

  // Add Report (inserts into Supabase database & uploads image to storage)
  const addReport = async (reportData: {
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    imageFile?: File | null;
    image_url?: string | null;
    title?: string;
    severity?: any;
    location_name?: string;
    is_anonymous?: boolean;
  }): Promise<IncidentReport | null> => {
    try {
      let finalImageUrl: string | null = reportData.image_url || null;

      if (reportData.imageFile) {
        const uploadedUrl = await uploadImage(reportData.imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();

      const insertPayload = {
        user_id: user && !reportData.is_anonymous ? user.id : null,
        category: reportData.category || 'hazard',
        description: reportData.description || reportData.title || '',
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        image_url: finalImageUrl,
        status: 'reported',
      };

      if (user) {
        const { data, error } = await supabase
          .from('reports')
          .insert([insertPayload])
          .select('*')
          .single();

        if (error) {
          console.error('Supabase report insert error:', error);
        } else if (data) {
          const newRep: IncidentReport = {
            id: data.id,
            user_id: data.user_id,
            category: data.category,
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            image_url: data.image_url,
            status: data.status as ReportStatus,
            created_at: data.created_at,
            updated_at: data.updated_at,
            title: reportData.title || data.description.slice(0, 40),
            location_name: reportData.location_name || `Lat: ${data.latitude.toFixed(3)}, Lng: ${data.longitude.toFixed(3)}`,
            severity: reportData.severity || 'medium',
            is_anonymous: reportData.is_anonymous,
          };
          setReports((prev) => [newRep, ...prev]);
          return newRep;
        }
      }

      // Fallback local report if not authenticated
      const timestamp = new Date().toISOString();
      const fallbackRep: IncidentReport = {
        id: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        user_id: reportData.is_anonymous ? null : currentUser.id,
        category: (reportData.category as ReportCategory) || 'hazard',
        description: reportData.description,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        image_url: finalImageUrl,
        status: 'reported',
        created_at: timestamp,
        updated_at: timestamp,
        title: reportData.title || reportData.description.slice(0, 40),
        location_name: reportData.location_name || 'Campus Location',
        severity: reportData.severity || 'medium',
        is_anonymous: reportData.is_anonymous,
      };

      setReports((prev) => [fallbackRep, ...prev]);
      return fallbackRep;
    } catch (e) {
      console.error('Add report exception:', e);
      return null;
    }
  };

  // Update Report Status
  const updateReportStatus = async (reportId: string, status: ReportStatus, resolutionNotes?: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) {
        console.warn('Supabase status update error:', error);
      }

      setReports((prev) =>
        prev.map((rep) => {
          if (rep.id === reportId) {
            return {
              ...rep,
              status,
              resolution_notes: resolutionNotes !== undefined ? resolutionNotes : rep.resolution_notes,
              updated_at: new Date().toISOString(),
            };
          }
          return rep;
        })
      );
    } catch (e) {
      console.error('Update status exception:', e);
    }
  };

  // Delete Report
  const deleteReport = async (reportId: string) => {
    try {
      await supabase.from('reports').delete().eq('id', reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (e) {
      console.error('Delete report exception:', e);
    }
  };

  const activeAlertCount = alerts.filter((a) => a.is_active).length;

  return (
    <SafetyContext.Provider
      value={{
        reports,
        alerts,
        currentUser,
        currentRole,
        setRole,
        signUp,
        signIn,
        signOut,
        addReport,
        updateReportStatus,
        deleteReport,
        activeAlertCount,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
