import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MapView = ({
  reports = [],
  interactive = false,
  selectedLocation = null,
  onLocationSelect = null,
  center = [40.7128, -74.0060], // Default NYC
  zoom = 12
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersGroupRef = useRef(null);
  const activePinRef = useRef(null);

  // Helper to get color classes based on severity
  const getSeverityColors = (severity) => {
    switch (severity) {
      case 'High':
        return { pingBg: 'bg-red-400', mainBg: 'bg-red-600' };
      case 'Medium':
        return { pingBg: 'bg-amber-400', mainBg: 'bg-amber-500' };
      default:
        return { pingBg: 'bg-emerald-400', mainBg: 'bg-emerald-500' };
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map if not already initialized
    if (!mapRef.current) {
      // Determine center based on reports or selectedLocation if available
      let mapCenter = center;
      if (selectedLocation) {
        mapCenter = [selectedLocation.lat, selectedLocation.lng];
      } else if (reports.length > 0 && reports[0].location) {
        mapCenter = [reports[0].location.lat, reports[0].location.lng];
      }

      mapRef.current = L.map(mapContainerRef.current).setView(mapCenter, zoom);

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Group for holding markers
      markersGroupRef.current = L.layerGroup().addTo(mapRef.current);

      // Click Event for Interactive Mode
      if (interactive && onLocationSelect) {
        mapRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect(lat, lng);
        });
      }
    }

    return () => {
      // Cleanup map on unmount
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markersGroupRef.current = null;
        activePinRef.current = null;
      }
    };
  }, []);

  // Update Markers when Reports or SelectedLocation changes
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    // Clear existing markers
    markersGroupRef.current.clearLayers();

    // 1. Render all incidents (Dashboard mode)
    if (reports.length > 0) {
      reports.forEach((report) => {
        if (!report.location || report.location.lat === undefined || report.location.lng === undefined) return;

        const { lat, lng, name } = report.location;
        const colors = getSeverityColors(report.severity);

        // Create glowing HTML pulse icon
        const glowIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex items-center justify-center w-6 h-6">
              <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full ${colors.pingBg} opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 ${colors.mainBg} border border-white shadow-lg"></span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const popupContent = `
          <div class="p-1 min-w-[150px]">
            <h4 class="font-bold text-gray-900 leading-tight border-b pb-1 mb-1">${report.title}</h4>
            <p class="text-xs text-gray-600 mb-0.5"><b>Location:</b> ${name}</p>
            <p class="text-xs text-gray-600 mb-0.5"><b>Severity:</b> <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${
              report.severity === 'High' ? 'bg-red-100 text-red-800' :
              report.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
              'bg-emerald-100 text-emerald-800'
            }">${report.severity}</span></p>
            <p class="text-xs text-gray-600 mb-0.5"><b>Status:</b> <span class="px-1.5 py-0.2 rounded text-[10px] font-bold ${
              report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
              report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }">${report.status}</span></p>
            <p class="text-[10px] text-gray-400 mt-1">Reported by: ${report.userId?.name || 'User'}</p>
          </div>
        `;

        L.marker([lat, lng], { icon: glowIcon })
          .bindPopup(popupContent)
          .addTo(markersGroupRef.current);
      });
    }

    // 2. Render selected pin (Interactive incident reporting mode)
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;

      const placementIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="animate-bounce absolute inline-flex h-8 w-8 rounded-full bg-brand-500/20 border border-brand-500/50"></span>
            <span class="relative inline-flex rounded-full h-4.5 w-4.5 bg-brand-600 border border-white shadow-lg"></span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([lat, lng], { icon: placementIcon })
        .bindPopup('<div class="p-1 font-semibold text-xs text-gray-700">Pinned Incident Location</div>')
        .addTo(markersGroupRef.current)
        .openPopup();

      // Pan to new selected coordinates
      mapRef.current.panTo([lat, lng]);
    }
  }, [reports, selectedLocation]);

  return (
    <div className="relative w-full h-full border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default MapView;
