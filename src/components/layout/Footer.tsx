import React from 'react';
import Link from 'next/link';
import { Shield, PhoneCall, HeartHandshake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">Guardian</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Empowering students, faculty, and campus security with real-time hazard tracking, anonymous incident reporting, and immediate emergency response dispatch.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Campus Safety Department &bull; Built with Supabase & Next.js</span>
            </div>
          </div>

          {/* Emergency Numbers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Emergency Hotlines</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="font-semibold text-rose-600">Campus Dispatch:</span> (555) 911-0000
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">City Police / EMS:</span> 911
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-brand-600">Night Escort Service:</span> (555) 234-SAFE
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">Health Center:</span> (555) 345-CARE
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/" className="hover:text-brand-600 transition-colors">Safety Overview</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600 transition-colors">Student Dashboard</Link></li>
              <li><Link href="/report" className="hover:text-brand-600 transition-colors">File a Safety Report</Link></li>
              <li><Link href="/map" className="hover:text-brand-600 transition-colors">Campus Incident Map</Link></li>
              <li><Link href="/my-reports" className="hover:text-brand-600 transition-colors">My Submitted Reports</Link></li>
              <li><Link href="/admin" className="hover:text-brand-600 transition-colors">Public Safety Admin</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Guardian Campus Safety Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Campus Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
