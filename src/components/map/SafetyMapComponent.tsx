'use client';

import React, { useEffect, useState } from 'react';
import { IncidentReport, ReportSeverity, ReportStatus } from '@/lib/types';
import { CAMPUS_CENTER } from '@/lib/mockData';
import 'leaflet/dist/leaflet.css';

interface SafetyMapProps {
  reports?: IncidentReport[];
  selectedReportId?: string | null;
  onSelectReport?: (report: IncidentReport) => void;
  interactiveSelect?: boolean;
  onLocationSelect?: (location: { name: string; lat: number; lng: number }) => void;
  height?: string;
}

export default function SafetyMapComponent({
  reports = [],
  selectedReportId,
  onSelectReport,
  interactiveSelect = false,
  onLocationSelect,
  height = '500px',
}: SafetyMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        style={{ height }}
        className="w-full bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200"
      >
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Loading Interactive Safety Map...</span>
        </div>
      </div>
    );
  }

  // Dynamic import of react-leaflet components on client
  const { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } = require('react-leaflet');
  const L = require('leaflet');

  // Fix default icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  const createCustomIcon = (status: ReportStatus, severity: ReportSeverity) => {
    let color = '#2563EB'; // default soft blue
    let pulseClass = '';

    if (status === 'resolved') {
      color = '#059669'; // Green safe
    } else if (severity === 'emergency') {
      color = '#DC2626'; // Red emergency
      pulseClass = 'animate-pulse';
    } else if (severity === 'high') {
      color = '#EA580C'; // Amber-orange high
    } else if (severity === 'medium') {
      color = '#D97706'; // Amber warning
    }

    const svgHtml = `
      <div class="relative flex items-center justify-center ${pulseClass}">
        <div style="background-color: ${color};" class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-white border-2 border-white ring-2 ring-slate-900/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html: svgHtml,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const LocationPickerMarker = () => {
    useMapEvents({
      click(e: any) {
        if (interactiveSelect && onLocationSelect) {
          const newLoc = { lat: e.latlng.lat, lng: e.latlng.lng };
          setPickedLocation(newLoc);
          onLocationSelect({
            name: `Selected Coordinates (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          });
        }
      },
    });

    if (!pickedLocation) return null;

    const pinIcon = L.divIcon({
      html: `
        <div class="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-brand-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M12 2v20M2 12h20"/>
          </svg>
        </div>
      `,
      className: 'custom-pin-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    return <Marker position={[pickedLocation.lat, pickedLocation.lng]} icon={pinIcon} />;
  };

  const MapViewUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedReportId) {
        const found = reports.find((r) => r.id === selectedReportId);
        if (found) {
          map.flyTo([found.latitude, found.longitude], 17, { animate: true });
        }
      }
    }, [map]);
    return null;
  };

  return (
    <div style={{ height }} className="w-full relative rounded-3xl overflow-hidden shadow-soft-md border border-slate-200 z-0">
      <MapContainer
        center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
        zoom={CAMPUS_CENTER.zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* CartoDB Positron Light Theme Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapViewUpdater />

        {interactiveSelect && <LocationPickerMarker />}

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCustomIcon(report.status, report.severity || 'medium')}
            eventHandlers={{
              click: () => {
                if (onSelectReport) onSelectReport(report);
              },
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 max-w-xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      report.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.severity === 'emergency'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{report.id}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">{report.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.description}</p>

                {report.ai_risk_reason && (
                  <div className="mt-2 p-2 bg-brand-50/80 rounded-xl border border-brand-200/60 text-[11px] text-brand-900">
                    <span className="font-bold text-brand-700">AI Intelligence: </span>
                    {report.ai_risk_reason}
                  </div>
                )}

                <div className="mt-2 text-[11px] font-medium text-slate-600 border-t border-slate-100 pt-1.5">
                  📍 {report.location_name}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {interactiveSelect && (
        <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-soft-sm text-xs font-semibold text-slate-700 border border-slate-200">
          💡 Click anywhere on the map to pin exact issue location
        </div>
      )}
    </div>
  );
}
