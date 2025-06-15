import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({
  userLocation,
  pickups = [],
  selectedPickup,
  onPickupSelect,
  showRouting = false,
  routingDestination = null,
  routingMode = 'pickup'
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);

  const createCustomIcon = (color, emoji) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: ${color};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
          font-weight: bold;
        ">
          ${emoji}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  const userIcon = createCustomIcon('#3B82F6', '👤');
  const pickupIcon = createCustomIcon('#10B981', '📦');
  const selectedPickupIcon = createCustomIcon('#F59E0B', '📦');
  const deliveryIcon = createCustomIcon('#EF4444', '🏢');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: userLocation || [-1.2921, 36.8219],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    markersRef.current.forEach(marker => {
      if (marker.options.isUser) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });

    const userMarker = L.marker(userLocation, {
      icon: userIcon,
      isUser: true
    }).addTo(mapInstanceRef.current);

    userMarker.bindPopup(`
      <div class="p-2">
        <h3 class="font-semibold text-ghibli-dark-blue">Your Location</h3>
        <p class="text-sm text-ghibli-brown">Current position</p>
      </div>
    `);

    markersRef.current.push(userMarker);

    mapInstanceRef.current.setView(userLocation, mapInstanceRef.current.getZoom());
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => {
      if (!marker.options.isUser) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = markersRef.current.filter(marker => marker.options.isUser);

    pickups.forEach(pickup => {
      const isSelected = selectedPickup && selectedPickup.id === pickup.id;
      const coordinates = pickup.pickupCoordinates || pickup.coordinates;

      if (!coordinates || coordinates.length !== 2) return;

      const marker = L.marker([coordinates[1], coordinates[0]], {
        icon: isSelected ? selectedPickupIcon : pickupIcon,
        isUser: false
      }).addTo(mapInstanceRef.current);

      const priorityColor = pickup.priority === 'high' ? '#EF4444' :
                           pickup.priority === 'medium' ? '#F59E0B' : '#10B981';

      marker.bindPopup(`
        <div class="p-3 min-w-[200px]">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-ghibli-dark-blue">${pickup.charity}</h3>
            <span class="px-2 py-1 rounded text-xs font-medium text-white" style="background-color: ${priorityColor}">
              ${pickup.priority}
            </span>
          </div>
          <p class="text-sm text-ghibli-brown mb-2">${pickup.pickupAddress}</p>
          <div class="text-xs text-ghibli-brown mb-2">
            <strong>Items:</strong> ${pickup.items ? pickup.items.join(', ') : 'N/A'}
          </div>
          <div class="text-xs text-ghibli-brown mb-3">
            <strong>Status:</strong> ${pickup.status}
          </div>
          ${onPickupSelect ? `
            <button
              onclick="window.selectPickup('${pickup.id}')"
              class="w-full bg-ghibli-blue text-white px-3 py-1 rounded text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              View Details
            </button>
          ` : ''}
        </div>
      `);

      marker.on('click', () => {
        if (onPickupSelect) {
          onPickupSelect(pickup);
        }
      });

      markersRef.current.push(marker);
    });

    window.selectPickup = (pickupId) => {
      const pickup = pickups.find(p => p.id === pickupId);
      if (pickup && onPickupSelect) {
        onPickupSelect(pickup);
      }
    };

    if (pickups.length > 0 && userLocation) {
      const group = new L.featureGroup([
        ...markersRef.current.filter(m => !m.options.isUser),
        L.marker(userLocation)
      ]);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [pickups, selectedPickup, onPickupSelect]);

  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (routingControlRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (showRouting && routingDestination) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(routingDestination[1], routingDestination[0])
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: function() { return null; },
        lineOptions: {
          styles: [{
            color: routingMode === 'delivery' ? '#EF4444' : '#3B82F6',
            weight: 4,
            opacity: 0.8
          }]
        },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
      }).addTo(mapInstanceRef.current);

      routingControlRef.current = routingControl;

      const destMarker = L.marker([routingDestination[1], routingDestination[0]], {
        icon: routingMode === 'delivery' ? deliveryIcon : selectedPickupIcon,
        isUser: false
      }).addTo(mapInstanceRef.current);

      destMarker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-ghibli-dark-blue">
            ${routingMode === 'delivery' ? 'Delivery' : 'Pickup'} Destination
          </h3>
          <p class="text-sm text-ghibli-brown">Navigate here</p>
        </div>
      `);

      markersRef.current.push(destMarker);
    }
  }, [showRouting, routingDestination, routingMode, userLocation]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapComponent;
