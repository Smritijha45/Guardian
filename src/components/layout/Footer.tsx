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
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Empowering students, faculty, and campus security with real-time hazard tracking, anonymous incident reporting, and immediate emergency response dispatch.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Campus Safety Department &bull; Built with Supabase & Next.js</span>
            </div>
          </div>

          {/* Emergency Numbers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Emergency Hotlines</h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="font-semibold text-rose-600">MMDU Dispatch:</span> <a href="tel:+911731274475" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">+91 1731-274475</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">National Emergency:</span> <a href="tel:112" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">112 (or 100)</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-brand-600">Night Escort:</span> <a href="tel:+911731274476" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">+91 1731-274476</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">MMIMSR Hospital:</span> <a href="tel:+911731274477" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">+91 1731-274477</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
            <nav aria-label="Footer Navigation">
              <ul className="space-y-2 text-xs text-slate-700">
                <li><Link href="/" className="hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Safety Overview</Link></li>
                <li><Link href="/dashboard" className="hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Student Dashboard</Link></li>
                <li><Link href="/report" className="hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">File a Safety Report</Link></li>
                <li><Link href="/map" className="hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Campus Incident Map</Link></li>
                <li><Link href="/my-reports" className="hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">My Submitted Reports</Link></li>
                <li><Link href="/admin" className="hover:text-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Public Safety Admin</Link></li>
              </ul>
            </nav>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
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
