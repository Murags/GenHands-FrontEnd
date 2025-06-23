import React, { useEffect, useRef } from 'react';
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
  selectedPickup,
  showRouting = false,
  routingDestination = null,
  routingMode = 'pickup',
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ pickup: null, delivery: null, user: null });
  const routingControlRef = useRef(null);

  const createCustomIcon = (color, emoji) => L.divIcon({
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; font-weight: bold;">${emoji}</div>`,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  const userIcon = createCustomIcon('#3B82F6', '👤');
  const pickupIcon = createCustomIcon('#10B981', '📦');
  const deliveryIcon = createCustomIcon('#EF4444', '🏢');

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: userLocation || [-1.2921, 36.8219],
        zoom: 13,
        zoomControl: true,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      mapInstanceRef.current = map;
    }
  }, [userLocation]);

  const clearLayers = () => {
    if (!mapInstanceRef.current) return;
    Object.values(markersRef.current).forEach(marker => {
      if (marker) mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = { pickup: null, delivery: null, user: null };
    if (routingControlRef.current) {
      mapInstanceRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    clearLayers();

    const userLatLng = L.latLng(userLocation[0], userLocation[1]);
    markersRef.current.user = L.marker(userLatLng, { icon: userIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup('Your Location');

    let bounds = new L.latLngBounds([userLatLng]);

    if (selectedPickup) {
      const pickupCoords = selectedPickup.pickupCoordinates;
      if (pickupCoords && pickupCoords.length === 2) {
        const pickupLatLng = L.latLng(pickupCoords[0], pickupCoords[1]);
        markersRef.current.pickup = L.marker(pickupLatLng, { icon: pickupIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<b>Pickup:</b><br>${selectedPickup.pickupAddress}`);
        bounds.extend(pickupLatLng);
      }

      const deliveryCoords = selectedPickup.destinationCoordinates;
      if (deliveryCoords && deliveryCoords.length === 2) {
        const deliveryLatLng = L.latLng(deliveryCoords[0], deliveryCoords[1]);
        markersRef.current.delivery = L.marker(deliveryLatLng, { icon: deliveryIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<b>Delivery:</b><br>${selectedPickup.deliveryAddress}`);
        bounds.extend(deliveryLatLng);
      }
    }

    if (showRouting && routingDestination && routingDestination.length === 2) {
      const destinationLatLng = L.latLng(routingDestination[0], routingDestination[1]);

      routingControlRef.current = L.Routing.control({
        waypoints: [userLatLng, destinationLatLng],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{
            color: routingMode === 'delivery' ? '#EF4444' : '#10B981',
            weight: 5,
            opacity: 0.8
          }]
        },
      }).addTo(mapInstanceRef.current);

      bounds.extend(destinationLatLng);
    }

    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds.pad(0.2));
    }

  }, [userLocation, selectedPickup, showRouting, routingDestination, routingMode]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
};

export default MapComponent;
