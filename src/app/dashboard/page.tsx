'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSafety } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/badge';
import { PlusCircle, Map, AlertTriangle, ShieldCheck, Clock, Lightbulb, ShieldAlert, ArrowRight, User, X } from 'lucide-react';

const DynamicSafetyMap = dynamic(() => import('@/components/map/SafetyMapComponent'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />,
});

export default function StudentDashboard() {
  const { reports, alerts, proactiveAlerts, dismissedAlertIds, dismissAlert, currentUser } = useSafety();

  const totalReports = reports.length;
  const activeReports = reports.filter((r) => r.status !== 'resolved');
  const resolvedReports = reports.filter((r) => r.status === 'resolved');
  const myReports = reports.filter((r) => r.user_id === currentUser.id);

  // Active non-dismissed proactive hotspot alerts
  const visibleProactiveAlerts = proactiveAlerts.filter((a) => !dismissedAlertIds.includes(a.id));

  const quickCategories = [
    { title: 'Broken Lighting', category: 'lighting', icon: Lightbulb, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Physical Hazard', category: 'hazard', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { title: 'Suspicious Activity', category: 'suspicious', icon: ShieldAlert, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { title: 'Theft / Property', category: 'theft', icon: ShieldCheck, color: 'text-brand-600 bg-brand-50 border-brand-200' },
  ];

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 space-y-8 min-w-0">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  Student Safety Portal &bull; Haryana, India
                </span>
                {currentUser.department && <span className="text-xs text-slate-400">&bull; {currentUser.department}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {currentUser.full_name || currentUser.name}
              </h1>
              <p className="text-sm text-slate-500">
                Here is the real-time AI safety intelligence for MM(DU) Mullana campus today.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/report">
                <Button icon={<PlusCircle className="w-4 h-4" />}>
                  File Safety Report
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Phase 3: Proactive Safety Alert Cards (Hotspots >= 80) */}
        {visibleProactiveAlerts.length > 0 && (
          <div className="space-y-4">
            {visibleProactiveAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 shadow-soft-md relative space-y-3 transition-all"
              >
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-colors shadow-xs"
                  title="Dismiss alert banner on dashboard (Remains visible on Safety Map)"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                  <span>HIGH-RISK AREA ALERT</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {alert.location} &bull; <span className="text-rose-600">Risk {alert.riskScore}/100</span>
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {alert.incidentCount} related incidents detected. {alert.timePattern}
                  </p>
                </div>

                <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 text-xs space-y-1">
                  <div className="text-slate-800 font-bold">Why Risky:</div>
                  <p className="text-slate-600 leading-relaxed">{alert.whyRisky}</p>
                </div>

                <div className="p-3 bg-brand-600 text-white rounded-2xl text-xs space-y-1 shadow-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-200" />
                    Recommended Action:
                  </div>
                  <p className="text-brand-50 leading-relaxed">{alert.recommendedAction}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Campus Issues</div>
              <div className="text-2xl font-bold text-amber-600">{activeReports.length}</div>
              <p className="text-[11px] text-slate-400">Currently under handling</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved Issues</div>
              <div className="text-2xl font-bold text-emerald-600">{resolvedReports.length}</div>
              <p className="text-[11px] text-slate-400">Fixed & closed</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Submissions</div>
              <div className="text-2xl font-bold text-brand-600">{myReports.length}</div>
              <p className="text-[11px] text-slate-400">Submitted by you</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Advisories</div>
              <div className="text-2xl font-bold text-rose-600">{alerts.length + visibleProactiveAlerts.length}</div>
              <p className="text-[11px] text-slate-400">Safety broadcasts</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Report Shortcuts */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Quick Incident Shortcuts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickCategories.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.category}
                  href={`/report?category=${item.category}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md hover:border-slate-300 transition-all flex flex-col items-center text-center space-y-2 group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Interactive Map & Active Reports Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Map Preview */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Map className="w-4 h-4 text-brand-600" />
                Live Campus Safety Map
              </h2>
              <Link href="/map" className="text-xs font-semibold text-brand-600 hover:underline">
                Full Screen Map →
              </Link>
            </div>
            <DynamicSafetyMap reports={reports} height="360px" />
          </div>

          {/* Recent Reports Timeline */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Recent Incidents
              </h2>
              <Link href="/my-reports" className="text-xs font-semibold text-brand-600 hover:underline">
                My Reports →
              </Link>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {reports.slice(0, 4).map((report) => (
                <Card key={report.id} hoverEffect className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{report.title}</h4>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{report.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>📍 {report.location_name}</span>
                    <SeverityBadge severity={report.severity || 'medium'} />
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
