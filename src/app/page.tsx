'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, MapPin, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, EyeOff, Bell, Activity, PhoneCall } from 'lucide-react';
import { useSafety } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge, StatusBadge, SeverityBadge } from '@/components/ui/badge';

export default function LandingPage() {
  const { reports, alerts, proactiveAlerts } = useSafety();

  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const activeCount = reports.filter((r) => r.status !== 'resolved').length;
  const recentReports = reports.slice(0, 3);

  return (
    <div className="space-y-16 py-4">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-brand-50/40 to-slate-50 border border-slate-200/80 p-8 sm:p-12 md:p-16 shadow-soft-md text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 text-brand-700 text-xs font-semibold border border-brand-200 shadow-2xs">
              <Shield className="w-4 h-4 text-brand-600" />
              Official MMDU Campus Safety & Incident Platform &bull; Haryana, India
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Empowering University Safety <span className="text-brand-600 underline decoration-brand-200 decoration-wavy">Together</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Report campus hazards, track unlit pathways, view AI-driven proactive hotspot advisories, and track real-time incident resolution at Maharishi Markandeshwar University.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center md:justify-start">
              <Link href="/report" className="w-full sm:w-auto">
                <Button size="lg" icon={<AlertTriangle className="w-5 h-5" />} className="w-full justify-center">
                  Report Safety Issue
                </Button>
              </Link>
              <Link href="/map" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" icon={<MapPin className="w-5 h-5 text-brand-600" />} className="w-full justify-center">
                  Explore Safety Map
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs font-medium text-slate-500 justify-center md:justify-start">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Student Access
              </span>
              <span className="flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-brand-600" />
                Optional Anonymous Mode
              </span>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="md:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-lg space-y-4 relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Campus Feed</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">MMDU Mullana</span>
              </div>

              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 text-brand-600 shadow-2xs">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{report.title}</h4>
                        <StatusBadge status={report.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">📍 {report.location_name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>{activeCount} Active Reports Being Handled</span>
                <Link href="/dashboard" className="text-brand-600 font-semibold hover:underline flex items-center gap-1">
                  Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK STATS METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hoverEffect>
          <CardContent className="p-6 text-center space-y-1">
            <div className="text-3xl font-extrabold text-brand-600">{resolvedCount}</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Incidents Resolved</div>
            <p className="text-[11px] text-slate-400">Addressed by campus safety crew</p>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-6 text-center space-y-1">
            <div className="text-3xl font-extrabold text-emerald-600">12 Min</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Avg Response Time</div>
            <p className="text-[11px] text-slate-400">For high priority reports</p>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-6 text-center space-y-1">
            <div className="text-3xl font-extrabold text-slate-900">24/7</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Campus Patrols</div>
            <p className="text-[11px] text-slate-400">Security escorts available</p>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="p-6 text-center space-y-1">
            <div className="text-3xl font-extrabold text-brand-600">100%</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Identity Option</div>
            <p className="text-[11px] text-slate-400">Submit anonymously anytime</p>
          </CardContent>
        </Card>
      </section>

      {/* PROACTIVE HOTSPOT SAFETY ALERTS (RISK 80+) */}
      {proactiveAlerts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h2 className="text-xl font-bold text-slate-900">Proactive High-Risk Hotspot Alerts</h2>
            </div>
            <span className="text-xs text-slate-500">AI-detected from active incident clusters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proactiveAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50 text-slate-900 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white">
                    ⚠️ HIGH-RISK AREA
                  </span>
                  <span className="text-xs font-bold text-rose-700">Risk {alert.riskScore}/100</span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{alert.location}</h3>
                <p className="text-xs font-semibold text-slate-700">
                  {alert.incidentCount} related incidents detected. {alert.timePattern}
                </p>
                <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200">
                  <strong>Why Risky: </strong>{alert.whyRisky}
                </div>
                <div className="p-2.5 bg-brand-600 text-white rounded-xl font-medium">
                  <strong>Recommended: </strong>{alert.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAMPUS ADVISORIES & ALERTS */}
      {alerts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900">Campus Safety Advisories</h2>
            </div>
            <span className="text-xs text-slate-500">Official security broadcasts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border ${
                  alert.level === 'emergency'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : alert.level === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 border">
                      {alert.level}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">📍 {alert.location_scope}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {new Date(alert.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="font-bold text-base">{alert.title}</h3>
                <p className="text-xs leading-relaxed text-slate-700">{alert.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CORE FEATURES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">Designed for University Safety & Fast Action</h2>
          <p className="text-sm text-slate-500">
            Guardian combines intuitive incident submission with real-time geographic awareness for students and administrative dispatchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Interactive Safety Map</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visualize active hazards, lighting outages, and security advisories on a dynamic campus map with status color indicators.
            </p>
            <Link href="/map" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline">
              View Campus Map →
            </Link>
          </Card>

          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Protected & Anonymous</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit sensitive harassment, theft, or safety concerns anonymously with one toggle, ensuring zero fear of retribution.
            </p>
            <Link href="/report" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline">
              Submit Anonymous Report →
            </Link>
          </Card>

          <Card hoverEffect className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Admin Resolution Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Campus Security updates status from &quot;Reported&quot; to &quot;Under Review&quot; and &quot;Resolved&quot; with transparent log notes.
            </p>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline">
              Admin Console →
            </Link>
          </Card>
        </div>
      </section>

      {/* QUICK CALLOUT BANNER */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft-lg">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold">Need Immediate Night Escort or Security Dispatch?</h3>
          <p className="text-sm text-slate-300">
            Never walk alone. Campus Safety Escorts operate 24 hours a day, 7 days a week.
          </p>
        </div>
        <a
          href="tel:+911731274475"
          className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl text-sm transition-colors shrink-0 flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4 text-brand-600" />
          Call +91 1731-274475
        </a>
      </section>

    </div>
  );
}
