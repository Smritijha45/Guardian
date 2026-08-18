'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSafety } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { ReportStatus, IncidentReport } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ShieldCheck, AlertOctagon, CheckCircle2, Clock, MapPin, Edit3, Trash2, Search, Filter, ShieldAlert } from 'lucide-react';

const DynamicSafetyMap = dynamic(() => import('@/components/map/SafetyMapComponent'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />,
});

export default function AdminDashboardPage() {
  const { reports, updateReportStatus, deleteReport, currentRole } = useSafety();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingReport, setEditingReport] = useState<IncidentReport | null>(null);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');
  const [newStatusSelect, setNewStatusSelect] = useState<ReportStatus>('under_review');

  // Stats calculations
  const totalIncidents = reports.length;
  const emergencyCount = reports.filter((r) => r.severity === 'emergency').length;
  const pendingCount = reports.filter((r) => r.status === 'reported' || r.status === 'under_review').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedCount / totalIncidents) * 100) : 100;

  const filteredReports = reports.filter((r) => {
    const titleText = r.title || r.description || '';
    const locText = r.location_name || '';
    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEditModal = (report: IncidentReport) => {
    setEditingReport(report);
    setNewStatusSelect(report.status);
    setResolutionNoteInput(report.resolution_notes || '');
  };

  const handleSaveStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReport) {
      updateReportStatus(editingReport.id, newStatusSelect, resolutionNoteInput);
      showToast('Incident Updated', `Report ${editingReport.id} set to ${newStatusSelect.replace('_', ' ')}`, 'success');
      setEditingReport(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteReport(id);
    showToast('Report Deleted', `Incident ${id} deleted by admin`, 'info');
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Page Header & Security Notice */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                Public Safety Dispatch Console
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                Campus Admin & Dispatch Console
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Real-time incident handling, security dispatch coordination, and official resolution logging.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">
                Logged in: Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reported</div>
              <div className="text-2xl font-bold text-slate-900">{totalIncidents}</div>
              <p className="text-[11px] text-slate-400">Total campus log entries</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Emergencies</div>
              <div className="text-2xl font-bold text-rose-600">{emergencyCount}</div>
              <p className="text-[11px] text-slate-400">Requires instant dispatch</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Action</div>
              <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              <p className="text-[11px] text-slate-400">Awaiting assignment</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolution Rate</div>
              <div className="text-2xl font-bold text-emerald-600">{resolutionRate}%</div>
              <p className="text-[11px] text-slate-400">Target: &gt; 95%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Incident Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
            <div>
              <CardTitle>Live Incident Queue</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Manage incident priority, assign officers, and record official notes.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ID, title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Title & Details</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Dispatch Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-600">{report.id}</td>
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-slate-900">{report.title}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{report.description}</div>
                    </td>
                    <td className="p-4 text-slate-600">📍 {report.location_name}</td>
                    <td className="p-4">
                      <SeverityBadge severity={report.severity || 'medium'} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="soft-blue"
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenEditModal(report)}
                      >
                        Update Status
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </main>

      {/* Edit Status & Resolution Notes Modal */}
      {editingReport && (
        <Modal
          isOpen={!!editingReport}
          onClose={() => setEditingReport(null)}
          title={`Update Status — ${editingReport.id}`}
          description={editingReport.title}
        >
          <form onSubmit={handleSaveStatusChange} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Transition Status
              </label>
              <select
                value={newStatusSelect}
                onChange={(e) => setNewStatusSelect(e.target.value as ReportStatus)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-sm bg-white"
              >
                <option value="reported">Reported</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Resolution / Officer Log Notes
              </label>
              <textarea
                rows={3}
                placeholder="Log security dispatch actions, facilities crew assignment, or resolution details..."
                value={resolutionNoteInput}
                onChange={(e) => setResolutionNoteInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingReport(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save & Broadcast Update
              </Button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  );
}
