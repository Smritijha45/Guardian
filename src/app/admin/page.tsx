'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSafety } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { ReportStatus, IncidentReport, ReportCategory } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, SeverityBadge, CategoryBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ShieldCheck, MapPin, Edit3, Trash2, Search, ShieldAlert, Eye, Calendar, User, Camera } from 'lucide-react';

export default function AdminDashboardPage() {
  const { reports, updateReportStatus, deleteReport, currentRole, setRole } = useSafety();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingReport, setEditingReport] = useState<IncidentReport | null>(null);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');
  const [newStatusSelect, setNewStatusSelect] = useState<ReportStatus>('under_review');
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

  // Simple counts required for Admin Dashboard: Total / Reported / Under Review / Resolved
  const totalCount = reports.length;
  const reportedCount = reports.filter((r) => r.status === 'reported').length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review').length;
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
  };

  const handleSaveStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    setIsSaving(true);
    try {
      await updateReportStatus(editingReport.id, newStatusSelect, resolutionNoteInput);
      showToast('Status Updated', `Report set to ${newStatusSelect.replace('_', ' ')} (saved to Supabase)`, 'success');
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
                Public Safety Console
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                Campus Admin Dashboard
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Real-time Supabase incident management, status transitions, and resolution tracking.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">
                Role: Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Simple Metric Counts: Total / Reported / Under Review / Resolved */}
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
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Review</div>
              <div className="text-2xl font-bold text-amber-600">{underReviewCount}</div>
              <p className="text-[11px] text-slate-400">Actively being handled</p>
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
              <CardTitle>Supabase Incidents Queue</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">View and update incident status in real time.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search ID, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
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
                    <th className="p-4">Status</th>
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
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-2 max-w-sm">{report.description}</div>
                      </td>
                      <td className="p-4 text-slate-600">
                        📍 {report.location_name || `Lat: ${report.latitude.toFixed(3)}, Lng: ${report.longitude.toFixed(3)}`}
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
                          Details & Status
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

      {/* Edit Status, View Photo & Location Modal */}
      {editingReport && (
        <Modal
          isOpen={!!editingReport}
          onClose={() => setEditingReport(null)}
          title={`Report Details — ${editingReport.id}`}
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
                Submitted: {new Date(editingReport.created_at).toLocaleString()}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
              <p className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {editingReport.description}
              </p>
            </div>

            {/* Photo Attachment if available */}
            {editingReport.image_url && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  Attached Photo Evidence
                </label>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editingReport.image_url} alt="Photo attachment" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Change Status Form */}
            <form onSubmit={handleSaveStatusChange} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Status (Persists to Supabase)
                </label>
                <select
                  value={newStatusSelect}
                  onChange={(e) => setNewStatusSelect(e.target.value as ReportStatus)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-sm bg-white font-medium"
                >
                  <option value="reported">reported (Newly Filed)</option>
                  <option value="under_review">under_review (In Progress)</option>
                  <option value="resolved">resolved (Closed)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Resolution Log Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Log security dispatch actions or resolution details..."
                  value={resolutionNoteInput}
                  onChange={(e) => setResolutionNoteInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingReport(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving to Supabase...' : 'Save & Update Status'}
                </Button>
              </div>
            </form>

          </div>
        </Modal>
      )}

    </div>
  );
}
