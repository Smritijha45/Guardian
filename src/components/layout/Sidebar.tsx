'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Map, ShieldCheck, PhoneCall, PlusCircle, ShieldAlert } from 'lucide-react';
import { useSafety } from '@/lib/store';

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, reports } = useSafety();

  const activeReportsCount = reports.filter((r) => r.status !== 'resolved').length;

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Safety Issue', href: '/report', icon: PlusCircle },
    { name: 'Interactive Map', href: '/map', icon: Map },
    { name: 'My Reports', href: '/my-reports', icon: FileText, badge: activeReportsCount > 0 ? activeReportsCount : undefined },
    ...(currentRole === 'admin' ? [{ name: 'Admin Console', href: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-soft-sm space-y-6">
        
        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Sidebar Navigation">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Navigation Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{link.name}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-brand-100 text-brand-700 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Emergency Assistance card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-600" aria-hidden="true" />
            <span>24/7 Safety Helpline</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Walking alone at night? Request a free security walking escort on campus anytime.
          </p>
          <a
            href="tel:+911731274475"
            className="flex items-center justify-center gap-2 py-2 px-3 bg-white text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-600" aria-hidden="true" />
            Call +91 1731-274475
          </a>
        </div>
      </div>
    </aside>
  );
}
