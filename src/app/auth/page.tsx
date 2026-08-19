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
  const { signIn, signUp, signInWithGoogle, setRole } = useSafety();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        showToast('Google Sign In Failed', error.message || 'Could not initiate Google authentication.', 'error');
      }
    } catch (err: any) {
      showToast('Google Auth Error', err?.message || 'An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* Google OAuth Provider */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full mt-1 flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
            >
              <GoogleIcon />
              <span>Sign In with Google</span>
            </button>
          </div>

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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
