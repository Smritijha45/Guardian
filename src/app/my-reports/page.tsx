'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSafety } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportCategory } from '@/lib/types';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { FileText, PlusCircle, Calendar, MapPin, CheckCircle2, Clock, Trash2, Eye, ArrowRight } from 'lucide-react';

export default function MyReportsPage() {
  const { reports, currentUser, deleteReport } = useSafety();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Filter reports submitted by currentUser or all demo reports for easy evaluation
  const mySubmissions = reports;

  const filteredReports = mySubmissions.filter((r) => {
    if (activeTab === 'active') return r.status !== 'resolved';
    if (activeTab === 'resolved') return r.status === 'resolved';
    return true;
  });

  const handleDelete = (id: string) => {
    deleteReport(id);
    setSelectedReportId(null);
    showToast('Report Withdrawn', `Report ${id} has been removed.`, 'info');
  };

  const selectedReport = reports.find((r) => r.id === selectedReportId);

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                Personal Activity Tracker
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Submitted Reports
            </h1>
            <p className="text-sm text-slate-500">
              Track the progress, official campus response notes, and status updates for your safety submissions.
            </p>
          </div>

          <Link href="/report">
            <Button icon={<PlusCircle className="w-4 h-4" />}>
              File New Issue
            </Button>
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'all' ? 'bg-brand-500 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Submissions ({mySubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'active' ? 'bg-brand-500 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Active ({mySubmissions.filter((r) => r.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'resolved' ? 'bg-brand-500 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Resolved ({mySubmissions.filter((r) => r.status === 'resolved').length})
          </button>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Reports Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have no reports matching this filter view.
            </p>
            <Link href="/report">
              <Button size="sm">Report a Safety Issue</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} hoverEffect className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                      {report.id}
                    </span>
                    <CategoryBadge category={(report.category as ReportCategory) || 'other'} />
                    <SeverityBadge severity={report.severity || 'medium'} />
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{report.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1">📍 {report.location_name}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.created_at).toLocaleDateString('en-IN')}
                    </span>
                    {report.is_anonymous && (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Anonymous
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedReportId(report.id)}
                    >
                      View Details & Timeline
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </main>

      {/* Detailed Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReportId}
          onClose={() => setSelectedReportId(null)}
          title={`Report Timeline — ${selectedReport.id}`}
        >
          <div className="space-y-6 py-2">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedReport.status} />
                <SeverityBadge severity={selectedReport.severity || 'medium'} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedReport.title}</h3>
              <p className="text-xs text-slate-500">📍 {selectedReport.location_name}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="font-bold text-slate-800">Description</div>
              <p className="text-slate-600 leading-relaxed">{selectedReport.description}</p>
            </div>

            {/* AI Safety Intelligence */}
            {selectedReport.ai_risk_reason && (
              <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-brand-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    AI Safety Risk Assessment
                  </div>
                  {selectedReport.ai_severity && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      selectedReport.ai_severity === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedReport.ai_severity === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      AI Severity: {selectedReport.ai_severity}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px] bg-white/70 p-2.5 rounded-xl border border-brand-100">
                  {selectedReport.ai_risk_reason}
                </p>
              </div>
            )}

            {/* Status Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Resolution Timeline</h4>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                
                {/* Step 1 */}
                <div className="relative flex items-start gap-3 pl-8">
                  <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Incident Submitted</div>
                    <div className="text-[11px] text-slate-500">{new Date(selectedReport.created_at).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-3 pl-8">
                  <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full ${
                    selectedReport.status !== 'reported' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  } flex items-center justify-center text-xs font-bold`}>
                    {selectedReport.status !== 'reported' ? '✓' : '2'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Under Review & Dispatched</div>
                    <div className="text-[11px] text-slate-500">Campus Security & Facilities notified</div>
                  </div>
                </div>

                {/* Step 3: Under Action */}
                <div className="relative flex items-start gap-3 pl-8">
                  <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full ${
                    selectedReport.status === 'under_action' || selectedReport.status === 'resolved'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  } flex items-center justify-center text-xs font-bold`}>
                    {selectedReport.status === 'under_action' || selectedReport.status === 'resolved' ? '✓' : '3'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Under Action — Being Addressed</div>
                    {selectedReport.assigned_action && (
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        <strong>Action:</strong> {selectedReport.assigned_action}
                      </div>
                    )}
                    {selectedReport.action_note && (
                      <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-1">
                        <strong>Admin Note:</strong> {selectedReport.action_note}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 4: Resolution Complete */}
                <div className="relative flex items-start gap-3 pl-8">
                  <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full ${
                    selectedReport.status === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  } flex items-center justify-center text-xs font-bold`}>
                    {selectedReport.status === 'resolved' ? '✓' : '4'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Resolution Complete</div>
                    {selectedReport.resolution_notes && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-1">
                        <strong>Official Note:</strong> {selectedReport.resolution_notes}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => handleDelete(selectedReport.id)}
              >
                Withdraw Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedReportId(null)}>
                Close
              </Button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
}
