import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({
  userLocation,
  pickupRequests,
  selectedPickup,
  onPickupSelect,
  showRouting = false,
  routingDestination = null,
  routingMode = 'pickup'
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(userLocation, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing markers and routing
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    if (routingControlRef.current) {
      mapInstance.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // User location marker
    const userIcon = L.divIcon({
      html: `<div style="
        background-color: #5DA3A6;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(93, 163, 166, 0.4);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -8px;
          left: -8px;
          width: 40px;
          height: 40px;
          border: 2px solid #5DA3A6;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s infinite;
        "></div>
      </div>`,
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const userMarker = L.marker(userLocation, { icon: userIcon })
      .addTo(mapInstance.current)
      .bindPopup(`
        <div style="
          text-align: center;
          padding: 12px;
          background: linear-gradient(135deg, #F9F4E7 0%, #fdfcf7 100%);
          border-radius: 8px;
          border: 2px solid #5DA3A6;
          font-family: 'Inter', sans-serif;
        ">
          <div style="
            background-color: #5DA3A6;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 14px;
          ">Your Location</div>
          <span style="color: #2D5877; font-weight: 500;">You are here! 📍</span>
        </div>
      `);

    markersRef.current.push(userMarker);

    // Handle routing mode (dedicated navigation view)
    if (showRouting && routingDestination) {
      const destinationColor = routingMode === 'delivery' ? '#8FCE72' : '#71A6D1';
      const destinationIcon = routingMode === 'delivery' ? '🚚' : '📦';

      const destinationMarker = L.divIcon({
        html: `<div style="
          background-color: ${destinationColor};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          animation: bounce 2s infinite;
        ">${destinationIcon}</div>`,
        className: 'destination-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const destMarker = L.marker(routingDestination, { icon: destinationMarker })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="
            text-align: center;
            padding: 12px;
            background: linear-gradient(135deg, #F9F4E7 0%, #fdfcf7 100%);
            border-radius: 8px;
            border: 2px solid ${destinationColor};
            font-family: 'Inter', sans-serif;
          ">
            <div style="
              background-color: ${destinationColor};
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              margin-bottom: 8px;
              font-weight: bold;
              font-size: 14px;
            ">${routingMode === 'delivery' ? 'Delivery' : 'Pickup'} Destination</div>
            <span style="color: #2D5877; font-weight: 500;">
              ${routingMode === 'delivery' ? 'Drop off items here! 🚚' : 'Collect items here! 📦'}
            </span>
          </div>
        `);

      markersRef.current.push(destMarker);

      // Create enhanced routing for navigation
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(routingDestination[0], routingDestination[1])
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: {
          styles: [
            {
              color: destinationColor,
              weight: 8,
              opacity: 0.8,
              dashArray: routingMode === 'delivery' ? '15, 10' : '10, 5'
            }
          ]
        },
        show: true,
        summaryTemplate: `
          <div style="
            background: white;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid ${destinationColor};
            margin: 10px;
            font-family: 'Inter', sans-serif;
          ">
            <h4 style="margin: 0 0 8px 0; color: #2D5877; font-weight: bold;">
              ${routingMode === 'delivery' ? '🚚 Delivery Route' : '📦 Pickup Route'}
            </h4>
            <div style="font-size: 14px; color: #7D6149;">
              <strong>Distance:</strong> {distance}<br>
              <strong>Time:</strong> {time}
            </div>
          </div>
        `
      }).addTo(mapInstance.current);

      // Fit bounds to show route
      const group = new L.featureGroup([
        L.marker(userLocation),
        L.marker(routingDestination)
      ]);
      mapInstance.current.fitBounds(group.getBounds().pad(0.2));

    } else {
      // Regular pickup requests view
      pickupRequests.forEach(pickup => {
        const isSelected = selectedPickup?.id === pickup.id;
        const isUrgent = pickup.status === 'urgent';
        const isHighPriority = pickup.priority === 'high';

        let markerColor = '#71A6D1'; // Default blue
        if (isSelected) {
          markerColor = '#5DA3A6'; // Teal for selected
        } else if (isUrgent) {
          markerColor = '#D1666F'; // Red for urgent
        } else if (isHighPriority) {
          markerColor = '#F7C371'; // Yellow for high priority
        }

        const markerIcon = L.divIcon({
          html: `<div style="
            background-color: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            ${isUrgent ? 'animation: pulse 1.5s infinite;' : ''}
            position: relative;
          ">
            <span style="color: white; font-size: 12px; font-weight: bold;">${pickup.id}</span>
            ${isUrgent ? `<div style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 8px;
              height: 8px;
              background-color: #D1666F;
              border-radius: 50%;
              border: 1px solid white;
              animation: pulse 1s infinite;
            "></div>` : ''}
          </div>`,
          className: 'pickup-location-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const getPriorityBadge = () => {
          if (pickup.status === 'urgent') return '<span style="background: #D1666F; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">🚨 URGENT</span>';
          if (pickup.priority === 'high') return '<span style="background: #F7C371; color: #2D5877; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">⚡ HIGH</span>';
          if (pickup.priority === 'medium') return '<span style="background: #71A6D1; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">📋 MEDIUM</span>';
          return '<span style="background: #8FCE72; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">✅ NORMAL</span>';
        };

        const marker = L.marker(pickup.coordinates, { icon: markerIcon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="
              min-width: 250px;
              padding: 16px;
              background: linear-gradient(135deg, #F9F4E7 0%, #fdfcf7 100%);
              border-radius: 12px;
              border: 2px solid ${markerColor};
              font-family: 'Inter', sans-serif;
            ">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <h3 style="
                  margin: 0;
                  font-size: 18px;
                  font-weight: bold;
                  color: #2D5877;
                  font-family: 'Dancing Script', cursive;
                ">${pickup.charity}</h3>
                ${getPriorityBadge()}
              </div>

              <div style="margin-bottom: 12px;">
                <p style="
                  margin: 0 0 8px 0;
                  color: #7D6149;
                  font-size: 14px;
                  display: flex;
                  align-items: center;
                ">
                  📍 ${pickup.address}
                </p>
                <p style="
                  margin: 0 0 8px 0;
                  font-size: 14px;
                  color: #2D5877;
                  font-weight: 500;
                ">
                  🚗 <strong>${pickup.distance}</strong> • ⏱️ <strong>${pickup.estimatedTime}</strong>
                </p>
                <p style="
                  margin: 0 0 12px 0;
                  font-size: 13px;
                  color: #7D6149;
                ">
                  👤 Contact: <strong>${pickup.contactPerson}</strong>
                </p>
              </div>

              <div style="
                background: white;
                padding: 8px 12px;
                border-radius: 8px;
                margin-bottom: 12px;
                border-left: 4px solid ${markerColor};
              ">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #7D6149; font-weight: bold;">ITEMS TO COLLECT:</p>
                <p style="margin: 0; font-size: 12px; color: #2D5877;">${pickup.items.join(', ')}</p>
              </div>

              <button
                onclick="window.selectPickup(${pickup.id})"
                style="
                  width: 100%;
                  padding: 12px 16px;
                  background: linear-gradient(135deg, ${markerColor} 0%, ${markerColor}dd 100%);
                  color: white;
                  border: none;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: bold;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)'"
              >
                ${isSelected ? '✅ Selected - View Details' : '🎯 Select & Show Route'}
              </button>
            </div>
          `);

        marker.on('click', () => {
          onPickupSelect(pickup);
        });

        markersRef.current.push(marker);
      });

      // Show route for selected pickup in regular view
      if (selectedPickup && userLocation) {
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(selectedPickup.coordinates[0], selectedPickup.coordinates[1])
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null,
          lineOptions: {
            styles: [
              { color: '#5DA3A6', weight: 6, opacity: 0.8, dashArray: '10, 5' }
            ]
          },
          show: false,
          summaryTemplate: '<div style="display: none;"></div>'
        }).addTo(mapInstance.current);

        const group = new L.featureGroup([
          L.marker(userLocation),
          L.marker(selectedPickup.coordinates)
        ]);
        mapInstance.current.fitBounds(group.getBounds().pad(0.1));
      } else {
        const allLocations = [userLocation, ...pickupRequests.map(p => p.coordinates)];
        const group = new L.featureGroup(allLocations.map(loc => L.marker(loc)));
        mapInstance.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    window.selectPickup = (pickupId) => {
      const pickup = pickupRequests.find(p => p.id === pickupId);
      if (pickup) {
        onPickupSelect(pickup);
      }
    };

    return () => {
      if (window.selectPickup) {
        delete window.selectPickup;
      }
    };
  }, [userLocation, pickupRequests, selectedPickup, onPickupSelect, showRouting, routingDestination, routingMode]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-b-xl" />

      {/* Legend - only show in regular view */}
      {!showRouting && (
        <div className="absolute top-4 right-4 bg-ghibli-cream rounded-xl shadow-ghibli p-5 z-[1000] border" style={{ borderColor: 'var(--color-ghibli-brown-light)' }}>
          <h4 className="text-lg font-bold text-ghibli-dark-blue mb-4 handwritten">Map Legend</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-ghibli-teal rounded-full mr-3 relative">
                <div className="absolute inset-0 bg-ghibli-teal rounded-full animate-pulse opacity-50"></div>
              </div>
              <span className="text-sm text-ghibli-brown font-medium">Your Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-ghibli-blue rounded-full mr-3"></div>
              <span className="text-sm text-ghibli-brown font-medium">Available Pickup</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-ghibli-yellow rounded-full mr-3"></div>
              <span className="text-sm text-ghibli-brown font-medium">High Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-ghibli-red rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm text-ghibli-brown font-medium">Urgent Request</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-ghibli-teal rounded-full mr-3 ring-2 ring-ghibli-teal ring-offset-2"></div>
              <span className="text-sm text-ghibli-brown font-medium">Selected Pickup</span>
            </div>
          </div>
        </div>
      )}

      {/* Route info - only show in regular view with selected pickup */}
      {!showRouting && selectedPickup && (
        <div className="absolute bottom-4 left-4 bg-ghibli-cream rounded-xl shadow-ghibli p-5 z-[1000] border animate-float" style={{ borderColor: 'var(--color-ghibli-teal)' }}>
          <h4 className="text-lg font-bold text-ghibli-dark-blue mb-3 handwritten flex items-center">
            🚗 Route to {selectedPickup.charity}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm bg-white rounded-lg p-2">
              <span className="w-3 h-3 bg-ghibli-blue rounded-full mr-3"></span>
              <span className="font-medium text-ghibli-dark-blue">Distance:</span>
              <span className="text-ghibli-brown ml-2 font-bold">{selectedPickup.distance}</span>
            </div>
            <div className="flex items-center text-sm bg-white rounded-lg p-2">
              <span className="w-3 h-3 bg-ghibli-teal rounded-full mr-3"></span>
              <span className="font-medium text-ghibli-dark-blue">Estimated Time:</span>
              <span className="text-ghibli-brown ml-2 font-bold">{selectedPickup.estimatedTime}</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-xs text-ghibli-teal font-medium">
              ✨ Follow the dashed route line
            </span>
          </div>
        </div>
      )}

      {/* Navigation info - show in routing mode */}
      {showRouting && routingDestination && (
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-ghibli p-5 z-[1000] border-2" style={{ borderColor: routingMode === 'delivery' ? '#8FCE72' : '#71A6D1' }}>
          <h4 className="text-lg font-bold text-ghibli-dark-blue mb-3 handwritten flex items-center">
            {routingMode === 'delivery' ? '🚚 Delivery Navigation' : '📦 Pickup Navigation'}
          </h4>
          <div className="text-sm text-ghibli-brown">
            <p className="mb-2">
              <strong>Follow the {routingMode === 'delivery' ? 'green dashed' : 'blue dashed'} route line</strong>
            </p>
            <p className="text-xs text-ghibli-teal">
              ✨ Detailed directions shown above the map
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
