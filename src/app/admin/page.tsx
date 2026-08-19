'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSafety } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { ReportStatus, IncidentReport, ReportCategory } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, CategoryBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ShieldCheck, MapPin, Edit3, Trash2, Search, ShieldAlert, Calendar, Camera, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const { reports, updateReportStatus, deleteReport, currentRole, setRole } = useSafety();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingReport, setEditingReport] = useState<IncidentReport | null>(null);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');
  const [assignedActionInput, setAssignedActionInput] = useState('');
  const [actionNoteInput, setActionNoteInput] = useState('');
  const [newStatusSelect, setNewStatusSelect] = useState<ReportStatus>('under_action');
  const [isSaving, setIsSaving] = useState(false);

  // Access Control Guard: Only admins can access this page
  if (currentRole !== 'admin') {
    return (
      <div className="flex gap-8">
        <Sidebar />
        <main className="flex-1 min-w-0 py-12">
          <Card className="max-w-md mx-auto p-8 text-center space-y-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Admin Access Restricted</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Only authorized Campus Admin accounts can access this console. Please switch your role to Admin using the top navbar or sign in with admin credentials.
            </p>
            <Button onClick={() => setRole('admin')}>
              Switch to Admin Mode
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  // Dashboard metric counts
  const totalCount = reports.length;
  const reportedCount = reports.filter((r) => r.status === 'reported').length;
  const underActionCount = reports.filter((r) => r.status === 'under_action' || r.status === 'under_review').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const filteredReports = reports.filter((r) => {
    const titleText = r.title || r.description || '';
    const locText = r.location_name || '';
    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenEditModal = (report: IncidentReport) => {
    setEditingReport(report);
    setNewStatusSelect(report.status);
    setResolutionNoteInput(report.resolution_notes || '');
    setAssignedActionInput(report.assigned_action || 'Increase lighting and security patrols.');
    setActionNoteInput(report.action_note || 'Security team notified. Patrol increased from 8 PM–11 PM.');
  };

  const handleSaveStatusChange = async (e?: React.FormEvent, overrideStatus?: ReportStatus) => {
    if (e) e.preventDefault();
    if (!editingReport) return;

    const targetStatus = overrideStatus || newStatusSelect;

    setIsSaving(true);
    try {
      await updateReportStatus(
        editingReport.id,
        targetStatus,
        resolutionNoteInput,
        assignedActionInput,
        actionNoteInput
      );
      showToast('Action Saved to Supabase', `Incident marked as ${targetStatus.replace('_', ' ').toUpperCase()}`, 'success');
      setEditingReport(null);
    } catch (err: any) {
      showToast('Update Failed', err?.message || 'Could not update status in Supabase.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteReport(id);
    showToast('Report Removed', `Incident ${id} removed from Supabase`, 'info');
  };

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                Public Safety Response Console &bull; MMDU Mullana, Haryana
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                Campus Admin Response Console
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Real-time Supabase response workflow: assign actions, log admin action notes, mark as UNDER ACTION and RESOLVED.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">
                Role: Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Metric Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</div>
              <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
              <p className="text-[11px] text-slate-400">Total recorded entries</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reported</div>
              <div className="text-2xl font-bold text-brand-600">{reportedCount}</div>
              <p className="text-[11px] text-slate-400">Newly filed reports</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Action</div>
              <div className="text-2xl font-bold text-amber-600">{underActionCount}</div>
              <p className="text-[11px] text-slate-400">Being addressed</p>
            </CardContent>
          </Card>

          <Card hoverEffect>
            <CardContent className="p-5 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</div>
              <div className="text-2xl font-bold text-emerald-600">{resolvedCount}</div>
              <p className="text-[11px] text-slate-400">Addressed & closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Reports Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
            <div>
              <CardTitle>Supabase Incidents & Response Queue</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Assign actions and update status to UNDER ACTION or RESOLVED in real time.</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ID, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="all">All Categories</option>
                  <option value="hazard">Hazards</option>
                  <option value="lighting">Lighting</option>
                  <option value="suspicious">Suspicious</option>
                  <option value="theft">Theft</option>
                  <option value="harassment">Harassment</option>
                  <option value="medical">Medical</option>
                  <option value="other">General</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="all">All Statuses</option>
                  <option value="reported">Reported</option>
                  <option value="under_review">Under Review</option>
                  <option value="under_action">Under Action</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No reports found matching selected filters.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Ref ID</th>
                    <th className="p-4">Category & Details</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status & Admin Action</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-600 truncate max-w-[120px]">{report.id}</td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <CategoryBadge category={(report.category as ReportCategory) || 'other'} />
                          {report.ai_severity && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              report.ai_severity === 'high'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : report.ai_severity === 'medium'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              AI: {report.ai_severity}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-2 max-w-sm">{report.description}</div>
                      </td>
                      <td className="p-4 text-slate-600">
                        📍 {report.location_name || `Lat: ${report.latitude.toFixed(3)}, Lng: ${report.longitude.toFixed(3)}`}
                      </td>
                      <td className="p-4 space-y-1">
                        <StatusBadge status={report.status} />
                        {report.action_note && (
                          <div className="text-[10px] text-amber-900 bg-amber-50 p-1.5 rounded-lg border border-amber-200 line-clamp-2 max-w-xs">
                            <strong>Action:</strong> {report.action_note}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="soft-blue"
                          icon={<Edit3 className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenEditModal(report)}
                        >
                          Respond & Action
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
            )}
          </CardContent>
        </Card>

      </main>

      {/* Edit Status & Assign Response Action Modal */}
      {editingReport && (
        <Modal
          isOpen={!!editingReport}
          onClose={() => setEditingReport(null)}
          title={`Response Workflow — ${editingReport.id}`}
        >
          <div className="space-y-4 py-1">
            
            {/* Location Details */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                {editingReport.location_name || 'Pinned Location'}
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                Latitude: {editingReport.latitude.toFixed(5)}, Longitude: {editingReport.longitude.toFixed(5)}
              </div>
              <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                Submitted: {new Date(editingReport.created_at).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
              <p className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {editingReport.description}
              </p>
            </div>

            {/* AI Safety Intelligence Analysis */}
            <div className="p-4 bg-brand-50/70 border border-brand-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-brand-900">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  AI Risk Intelligence
                </div>
                {editingReport.ai_severity && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    editingReport.ai_severity === 'high'
                      ? 'bg-rose-600 text-white'
                      : editingReport.ai_severity === 'medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {editingReport.ai_severity} Severity
                  </span>
                )}
              </div>
              
              <div className="text-slate-700 bg-white/80 p-2.5 rounded-xl border border-brand-200/60 leading-relaxed text-[11px]">
                <strong className="text-brand-900">Recommended Action: </strong>
                {editingReport.ai_risk_reason || 'Increase lighting and security patrols near area pathways.'}
              </div>
            </div>

            {/* Photo Attachment if available */}
            {editingReport.image_url && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  Attached Photo Evidence
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editingReport.image_url} alt="Photo attachment" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Phase 3 Admin Action Response Form */}
            <form onSubmit={(e) => handleSaveStatusChange(e)} className="space-y-4 pt-3 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Admin Action Response (Saved to Supabase)
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assign Action</label>
                <select
                  value={assignedActionInput}
                  onChange={(e) => setAssignedActionInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option value="Increase lighting and security patrols.">Increase lighting and security patrols.</option>
                  <option value="Deploy campus security escort patrol.">Deploy campus security escort patrol.</option>
                  <option value="Dispatch electrical & facilities repair.">Dispatch electrical & facilities repair.</option>
                  <option value="Cordon off physical hazard area.">Cordon off physical hazard area.</option>
                  <option value="Review CCTV surveillance footage.">Review CCTV surveillance footage.</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Admin Action Note</label>
                <textarea
                  rows={2}
                  placeholder='e.g., "Security team notified. Patrol increased from 8 PM–11 PM."'
                  value={actionNoteInput}
                  onChange={(e) => setActionNoteInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Status Transition</label>
                <select
                  value={newStatusSelect}
                  onChange={(e) => setNewStatusSelect(e.target.value as ReportStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                >
                  <option value="reported">reported (Newly Filed)</option>
                  <option value="under_review">under_review (Reviewing)</option>
                  <option value="under_action">under_action (Being Addressed / Under Action)</option>
                  <option value="resolved">resolved (Closed & Resolved)</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="soft-blue"
                    size="sm"
                    onClick={() => handleSaveStatusChange(undefined, 'under_action')}
                    disabled={isSaving}
                    className="bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 font-bold"
                  >
                    Mark UNDER ACTION
                  </Button>
                  <Button
                    type="button"
                    variant="soft-blue"
                    size="sm"
                    onClick={() => handleSaveStatusChange(undefined, 'resolved')}
                    disabled={isSaving}
                    className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold"
                  >
                    Mark RESOLVED
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditingReport(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Response'}
                  </Button>
                </div>
              </div>
            </form>

          </div>
        </Modal>
      )}

    </div>
  );
}
