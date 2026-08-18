import React from 'react';
import { cn } from './button';
import { ReportSeverity, ReportStatus, ReportCategory } from '@/lib/types';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Clock, Eye, AlertOctagon } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) {
  const base = 'inline-flex items-center font-medium border rounded-full transition-colors';
  
  const variants = {
    default: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200', // Green = safe/resolved
    warning: 'bg-amber-50 text-amber-800 border-amber-200', // Amber = warning
    danger: 'bg-rose-50 text-rose-700 border-rose-200', // Red = emergency / high
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  switch (status as string) {
    case 'resolved':
      return (
        <Badge variant="success">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolved
        </Badge>
      );
    case 'under_review':
    case 'in_progress':
      return (
        <Badge variant="warning">
          <Eye className="w-3.5 h-3.5" />
          Under Review
        </Badge>
      );
    case 'reported':
    case 'submitted':
    default:
      return (
        <Badge variant="default">
          <Info className="w-3.5 h-3.5" />
          Reported
        </Badge>
      );
  }
}

export function SeverityBadge({ severity }: { severity: ReportSeverity }) {
  switch (severity) {
    case 'emergency':
      return (
        <Badge variant="danger" className="animate-pulse font-semibold">
          <AlertOctagon className="w-3.5 h-3.5" />
          EMERGENCY
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="danger">
          <ShieldAlert className="w-3.5 h-3.5" />
          High Risk
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="warning">
          <AlertTriangle className="w-3.5 h-3.5" />
          Medium Priority
        </Badge>
      );
    case 'low':
      return (
        <Badge variant="neutral">
          <Info className="w-3.5 h-3.5" />
          Low Priority
        </Badge>
      );
  }
}

export function CategoryBadge({ category }: { category: ReportCategory }) {
  const categoryLabels: Record<ReportCategory, string> = {
    hazard: 'Physical Hazard',
    lighting: 'Lighting Issue',
    suspicious: 'Suspicious Activity',
    theft: 'Theft / Property',
    harassment: 'Harassment / Safety',
    medical: 'Medical Assistance',
    other: 'General Safety',
  };

  return (
    <Badge variant="neutral" className="bg-slate-50 text-slate-600 border-slate-200">
      {categoryLabels[category]}
    </Badge>
  );
}
