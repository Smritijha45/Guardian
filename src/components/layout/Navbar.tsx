'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ShieldAlert, MapPin, FilePlus, UserCheck, AlertTriangle, Menu, X, PhoneCall, CheckCircle2, ChevronDown, LogOut, LogIn } from 'lucide-react';
import { useSafety } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

export function Navbar() {
  const pathname = usePathname();
  const { currentRole, setRole, currentUser, activeAlertCount, signOut, isAuthenticated } = useSafety();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Report Issue', href: '/report' },
    { name: 'Safety Map', href: '/map' },
    { name: 'My Reports', href: '/my-reports' },
    ...(currentRole === 'admin' ? [{ name: 'Admin Console', href: '/admin' }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
                  <Shield className="w-5 h-5 fill-white/20" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                    Guardian
                  </span>
                  <span className="text-[11px] font-medium text-brand-600 tracking-wide uppercase mt-0.5">
                    Campus Safety
                  </span>
                </div>
              </Link>

              {/* Active Broadcast Badge if any */}
              {activeAlertCount > 0 && (
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200/80 hover:bg-amber-100 transition-colors ml-3"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  {activeAlertCount} Active Safety Advisory
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center gap-3">
              
              {/* Role Switcher (Student vs Admin Simulator) */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Role: <strong className="capitalize text-slate-900">{currentRole}</strong></span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-soft-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role Context
                    </div>
                    <button
                      onClick={() => {
                        setRole('student');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${
                        currentRole === 'student' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Student View</span>
                      {currentRole === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setRole('admin');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${
                        currentRole === 'admin' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>Admin View</span>
                      {currentRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Auth Sign In / Sign Out Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-colors"
                  title="Sign out of Supabase"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-medium rounded-xl border border-brand-200 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="danger"
                size="md"
                icon={<ShieldAlert className="w-5 h-5" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSosModalOpen(true);
                }}
                className="w-full justify-center"
              >
                Immediate Emergency SOS
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Emergency SOS Modal */}
      <Modal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        title="Immediate Campus Emergency Support"
        description="If you are in immediate danger or witness an active emergency, contact MMDU Security Dispatch (+91 1731-274475) or National Emergency (112) immediately."
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">Immediate Life Safety Response</h4>
              <p className="text-xs text-rose-700 mt-1">
                MMDU Campus Security & ERSS operators are active 24/7 across Haryana.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:112"
              className="flex items-center gap-3 p-4 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
            >
              <PhoneCall className="w-6 h-6" />
              <div>
                <div className="text-xs text-rose-100">National Emergency</div>
                <div className="text-lg font-bold">112 (Police / EMS)</div>
              </div>
            </a>

            <a
              href="tel:+911731274475"
              className="flex items-center gap-3 p-4 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
            >
              <Shield className="w-6 h-6" />
              <div>
                <div className="text-xs text-brand-100">MMDU Dispatch 24/7</div>
                <div className="text-lg font-bold">+91 1731-274475</div>
              </div>
            </a>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/report"
              onClick={() => setSosModalOpen(false)}
              className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
            >
              Or submit a digital high-priority safety report →
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
