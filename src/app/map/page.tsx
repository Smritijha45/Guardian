'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSafety } from '@/lib/store';
import { IncidentReport, ReportCategory, ReportSeverity } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Filter, Layers, AlertOctagon, X, Calendar, User, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const DynamicSafetyMap = dynamic(() => import('@/components/map/SafetyMapComponent'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center text-slate-400">Loading Campus Map...</div>,
});

export default function SafetyMapPage() {
  const { reports, proactiveAlerts } = useSafety();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  // Filter logic
  const filteredReports = reports.filter((r) => {
    const titleText = r.title || r.description || '';
    const locText = r.location_name || '';
    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || r.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              Real-Time Campus Map &bull; MM(DU) Mullana, Haryana
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Interactive Safety & Proactive Risk Map
          </h1>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search location or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="hazard">Physical Hazards</option>
            <option value="lighting">Lighting Issue</option>
            <option value="suspicious">Suspicious Activity</option>
            <option value="theft">Theft / Property</option>
            <option value="harassment">Harassment</option>
            <option value="medical">Medical Assistance</option>
            <option value="other">General Safety</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Severity Dropdown */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="emergency">Emergency</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

        </div>
      </div>

      {/* Proactive Hotspot Alerts Banner on Safety Map (Kept Visible Always) */}
      {proactiveAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
            Active Proactive Safety Hotspot Advisories (Visible on Campus Map)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proactiveAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-rose-700 uppercase tracking-wider">⚠️ HIGH-RISK AREA</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px]">
                    Risk {alert.riskScore}/100
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{alert.location}</div>
                <div className="text-slate-700 font-medium">
                  {alert.incidentCount} related incidents detected. {alert.timePattern}
                </div>
                <div className="text-slate-600 bg-white/80 p-2 rounded-xl border border-amber-200">
                  <strong>Why Risky: </strong>{alert.whyRisky}
                </div>
                <div className="text-brand-900 bg-brand-50 p-2 rounded-xl border border-brand-200 font-medium">
                  <strong>Recommended: </strong>{alert.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Map Container & Incident Drawer */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Map View */}
        <div className="lg:col-span-8 space-y-3">
          <DynamicSafetyMap
            reports={filteredReports}
            selectedReportId={selectedReport?.id}
            onSelectReport={(report) => setSelectedReport(report)}
            height="620px"
          />

          <div className="flex items-center justify-between px-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            <span>Showing <strong>{filteredReports.length}</strong> active markers on campus</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Emergency</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved</span>
            </div>
          </div>
        </div>

        {/* Selected Incident Drawer / Details */}
        <div className="lg:col-span-4">
          {selectedReport ? (
            <Card className="sticky top-20">
              <CardHeader className="flex flex-row items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <StatusBadge status={selectedReport.status} />
                    <SeverityBadge severity={selectedReport.severity || 'medium'} />
                  </div>
                  <CardTitle className="text-base">{selectedReport.title}</CardTitle>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    {selectedReport.location_name}
                  </div>
                  <div className="text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Reported: {new Date(selectedReport.created_at).toLocaleString('en-IN')}
                  </div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Reported By: {selectedReport.user_name || 'Anonymous Student'}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    {selectedReport.description}
                  </p>
                </div>

                {selectedReport.ai_risk_reason && (
                  <div className="p-3 bg-brand-50/70 border border-brand-200/80 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-brand-900">
                      <span>AI Intelligence Risk Reason</span>
                      {selectedReport.ai_severity && (
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-brand-200 text-brand-900 font-extrabold">
                          {selectedReport.ai_severity}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {selectedReport.ai_risk_reason}
                    </p>
                  </div>
                )}

                {/* Admin Action Response */}
                {selectedReport.action_note && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Admin Action Response
                    </div>
                    {selectedReport.assigned_action && (
                      <p className="text-[11px] text-slate-700"><strong>Action:</strong> {selectedReport.assigned_action}</p>
                    )}
                    <p className="text-xs text-amber-800">{selectedReport.action_note}</p>
                  </div>
                )}

                {selectedReport.image_url && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Photo Evidence</h4>
                    <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedReport.image_url} alt="Attachment" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {selectedReport.resolution_notes && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Official Resolution Log
                    </div>
                    <p className="text-xs text-emerald-800">{selectedReport.resolution_notes}</p>
                  </div>
                )}

              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center space-y-3 text-slate-400">
              <MapPin className="w-10 h-10 mx-auto text-slate-300 animate-bounce" />
              <h3 className="text-sm font-bold text-slate-700">Select an Incident Pin</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click on any map marker to view detailed incident description, photo evidence, and campus dispatch status.
              </p>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}
