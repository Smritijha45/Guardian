'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSafety } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { CAMPUS_LOCATIONS } from '@/lib/mockData';
import { ReportCategory, ReportSeverity } from '@/lib/types';
import {
  AlertTriangle,
  MapPin,
  Camera,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  X,
  Navigation,
} from 'lucide-react';

const DynamicSafetyMap = dynamic(() => import('@/components/map/SafetyMapComponent'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />,
});

function ReportFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addReport } = useSafety();
  const { showToast } = useToast();

  const preselectedCategory = (searchParams.get('category') as ReportCategory) || 'hazard';

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>(preselectedCategory);
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(CAMPUS_LOCATIONS[0].name);
  const [latitude, setLatitude] = useState(CAMPUS_LOCATIONS[0].latitude);
  const [longitude, setLongitude] = useState(CAMPUS_LOCATIONS[0].longitude);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Success Modal state
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (preselectedCategory) setCategory(preselectedCategory);
  }, [preselectedCategory]);

  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      showToast('GPS Error', 'Geolocation is not supported by your browser.', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationName(`Current GPS Location`);
        setIsLocating(false);
        showToast('GPS Captured', `Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`, 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('GPS Error', err.message || 'Could not fetch GPS location.', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLocationPresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locName = e.target.value;
    setLocationName(locName);
    const found = CAMPUS_LOCATIONS.find((l) => l.name === locName);
    if (found) {
      setLatitude(found.latitude);
      setLongitude(found.longitude);
    }
  };

  const handleMapLocationSelect = (loc: { name: string; lat: number; lng: number }) => {
    setLocationName(loc.name);
    setLatitude(loc.lat);
    setLongitude(loc.lng);
    showToast('Location Pinned', `Coordinates saved: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`, 'info');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      showToast('Image Attached', file.name, 'success');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showToast('Missing Details', 'Please provide both an issue title and description.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await addReport({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        location_name: locationName,
        latitude,
        longitude,
        is_anonymous: isAnonymous,
        imageFile: imageFile,
        image_url: imagePreview || undefined,
      });

      const refId = created?.id || `REP-${Date.now().toString().slice(-4)}`;
      setSubmittedReportId(refId);
      showToast('Report Submitted', `Incident reference: ${refId}`, 'success');
    } catch (err: any) {
      showToast('Submission Failed', err?.message || 'Could not submit report.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('hazard');
    setSeverity('medium');
    setImagePreview(null);
    setImageFile(null);
    setSubmittedReportId(null);
  };

  const categoryOptions: { label: string; value: ReportCategory; desc: string }[] = [
    { label: 'Physical Hazard', value: 'hazard', desc: 'Broken stairs, ice, exposed wires' },
    { label: 'Lighting Outage', value: 'lighting', desc: 'Unlit pathways or parking lights' },
    { label: 'Suspicious Activity', value: 'suspicious', desc: 'Tailgating, unauthorized access' },
    { label: 'Theft / Property', value: 'theft', desc: 'Stolen bike, property damage' },
    { label: 'Harassment / Safety', value: 'harassment', desc: 'Stalking, verbal or physical threat' },
    { label: 'Medical Emergency', value: 'medical', desc: 'First aid, injury notification' },
    { label: 'General Safety', value: 'other', desc: 'Other campus safety concern' },
  ];

  return (
    <div className="flex gap-8">
      <Sidebar />

      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              Campus Incident Reporter
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Safety Concern
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Help keep your campus safe. Reports are dispatched immediately to campus public safety officers and facilities maintenance crews.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Issue Overview */}
          <Card>
            <CardHeader>
              <CardTitle>1. Incident Overview</CardTitle>
              <CardDescription>Specify the title, category, and priority level of the safety issue.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              
              {/* Title input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Report Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unlit streetlight near Library North Entrance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setCategory(opt.value)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        category === opt.value
                          ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Severity / Priority Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['low', 'medium', 'high', 'emergency'] as ReportSeverity[]).map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        severity === sev
                          ? sev === 'emergency'
                            ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                            : sev === 'high'
                            ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                            : 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="capitalize font-bold text-xs">{sev} Priority</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details such as exact landmark, time noticed, or any safety risks present..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                />
              </div>

            </CardContent>
          </Card>

          {/* Card 2: Location Selector */}
          <Card>
            <CardHeader>
              <CardTitle>2. Campus Location Pin</CardTitle>
              <CardDescription>Select a campus location or click anywhere on the map to pin precise coordinates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-brand-50/60 border border-brand-200/80 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <Navigation className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Current GPS Location</div>
                    <div className="text-[11px] text-slate-500">Auto-detect coordinates via browser GPS</div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCaptureGPS}
                  disabled={isLocating}
                  icon={<Navigation className="w-3.5 h-3.5" />}
                >
                  {isLocating ? 'Capturing GPS...' : 'Use Current GPS'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Campus Landmark
                  </label>
                  <select
                    value={locationName}
                    onChange={handleLocationPresetChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-900 bg-white"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    Pinned Coordinates
                  </div>
                  <div>Latitude: <strong className="font-mono text-slate-900">{latitude.toFixed(5)}</strong></div>
                  <div>Longitude: <strong className="font-mono text-slate-900">{longitude.toFixed(5)}</strong></div>
                </div>
              </div>

              {/* Map Interactive Component */}
              <DynamicSafetyMap
                interactiveSelect
                onLocationSelect={handleMapLocationSelect}
                height="320px"
              />
            </CardContent>
          </Card>

          {/* Card 3: Privacy & Photo Attachment */}
          <Card>
            <CardHeader>
              <CardTitle>3. Privacy & Media Attachment</CardTitle>
              <CardDescription>Protect your identity or attach photo evidence.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-brand-50/50 border border-brand-200/80 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-brand-200 text-brand-600 flex items-center justify-center shrink-0">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Submit Anonymously</h4>
                    <p className="text-xs text-slate-500">
                      Your name and email will be hidden from security officers and public records.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600" />
                </label>
              </div>

              {/* Photo Upload Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Photo Attachment (Optional)
                </label>

                {imagePreview ? (
                  <div className="relative w-full max-w-sm h-48 rounded-2xl overflow-hidden border border-slate-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Incident preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/70 text-white rounded-full hover:bg-slate-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-2xl hover:border-brand-500 hover:bg-slate-50/50 transition-colors cursor-pointer text-center p-4">
                    <Camera className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Click to upload photo evidence</span>
                    <span className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP up to 5MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              icon={<ShieldAlert className="w-5 h-5" />}
            >
              {isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}
            </Button>
          </div>

        </form>

      </main>

      {/* Success Modal */}
      <Modal
        isOpen={!!submittedReportId}
        onClose={resetForm}
        title="Incident Report Submitted"
        description="Your safety concern has been transmitted to Campus Dispatch & Public Safety."
      >
        <div className="space-y-5 text-center py-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reference ID</div>
            <div className="text-2xl font-bold font-mono text-brand-600">{submittedReportId}</div>
          </div>

          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            You can track status updates and resolution notes in real-time under your My Reports tab.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                router.push('/my-reports');
              }}
              className="w-full sm:w-auto"
            >
              Go to My Reports
            </Button>
            <Button onClick={resetForm} className="w-full sm:w-auto">
              Submit Another Concern
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ReportIssuePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Report Form...</div>}>
      <ReportFormContent />
    </Suspense>
  );
}
