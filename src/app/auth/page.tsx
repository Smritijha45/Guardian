'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, UserCheck } from 'lucide-react';
import { useSafety } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/types';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, setRole } = useSafety();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          showToast('Sign In Failed', error.message || 'Invalid email or password.', 'error');
        } else {
          showToast('Signed In Successfully', `Welcome back, ${email}!`, 'success');
          router.push('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, fullName || 'Campus Member', selectedRole);
        if (error) {
          showToast('Registration Failed', error.message || 'Could not create account.', 'error');
        } else {
          showToast('Account Created', 'Your Guardian safety account is ready.', 'success');
          router.push(selectedRole === 'admin' ? '/admin' : '/dashboard');
        }
      }
    } catch (err: any) {
      showToast('Authentication Error', err?.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoStudent = () => {
    setRole('student');
    showToast('Demo Mode', 'Signed in as Student (Aarav Sharma)', 'success');
    router.push('/dashboard');
  };

  const handleDemoAdmin = () => {
    setRole('admin');
    showToast('Demo Mode', 'Signed in as Safety Admin (Captain Rajesh Kumar)', 'success');
    router.push('/admin');
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Guardian Safety Account</h1>
        <p className="text-xs text-slate-500">Sign in with your Supabase credentials or test using demo personas.</p>
      </div>

      <Card>
        <CardHeader className="p-4 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('signin')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Register Account
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Account Role</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Campus Admin</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">University Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@mmumullana.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full justify-center">
              {isSubmitting
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In to Guardian'
                : 'Create Supabase Account'}
            </Button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or Instant Demo Simulation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleDemoStudent}>
                Student Persona
              </Button>
              <Button variant="soft-blue" size="sm" onClick={handleDemoAdmin}>
                Safety Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
