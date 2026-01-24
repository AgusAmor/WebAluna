/**
 * DeliveryLocationMap.jsx
 * Displays delivery location on Mapbox
 * Shows warehouse location for pickup or both locations for shipping
 */

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import isotipoLogo from "../../assets/logos/isotipo.png";

// Warehouse/Store Location
const WAREHOUSE_LOCATION = {
  name: "Aluna - Punto de Retiro",
  address: "Beethoven 3590",
  coordinates: [-58.5007791, -34.5657935], // [lng, lat]
};

const DeliveryLocationMap = ({ clientAddress, deliveryMethod }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    // Initialize map only if container exists
    if (!mapContainer.current) return;

    // Set Mapbox token (use public token)
    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

    if (!token) {
      // Show placeholder when no token
      mapContainer.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gray-1 rounded-lg">
          <div class="text-center">
            <p class="text-blue-2 font-family-sora">Mapa no disponible</p>
            <p class="text-xs text-gray-1 mt-2">Configure VITE_MAPBOX_PUBLIC_TOKEN</p>
          </div>
        </div>
      `;
      return;
    }

    mapboxgl.accessToken = token;

    const initializeMap = async () => {
      try {
        // Clear container
        mapContainer.current.innerHTML = "";

        // Create map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          zoom: 12,
          pitch: 0,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Add markers and set bounds
        if (deliveryMethod === "shipping" && clientAddress) {
          // Shipping: Show both warehouse and client address
          addWarehouseMarker();
          await addClientMarker(clientAddress);
        } else if (deliveryMethod === "pickup") {
          // Pickup: Show only warehouse
          addWarehouseMarker();
          map.current.setCenter(WAREHOUSE_LOCATION.coordinates);
          map.current.setZoom(15);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [clientAddress, deliveryMethod]);

  const addWarehouseMarker = () => {
    if (!map.current) return;

    // Create warehouse marker element
    const warehouseMarkerEl = document.createElement("div");
    warehouseMarkerEl.className =
      "w-10 h-10 bg-gold rounded-full border-2 border-blue-1 flex items-center justify-center shadow-lg cursor-pointer overflow-hidden";

    const img = document.createElement("img");
    img.src = isotipoLogo;
    img.className = "w-6 h-6 object-cover";
    img.alt = "Aluna Logo";
    warehouseMarkerEl.appendChild(img);

    // Add warehouse marker
    new mapboxgl.Marker(warehouseMarkerEl)
      .setLngLat(WAREHOUSE_LOCATION.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `
          <div className="p-2">
            <h3 className="font-bold text-blue-1">${WAREHOUSE_LOCATION.name}</h3>
            <p className="text-sm text-blue-2">${WAREHOUSE_LOCATION.address}</p>
          </div>
        `,
        ),
      )
      .addTo(map.current);
  };

  const addClientMarker = async (address) => {
    if (!map.current) return;

    // If address already has coordinates, use them
    if (address.coordinates && address.coordinates.length === 2) {
      createAndAddClientMarker(address.coordinates, address);
      return;
    }

    // Otherwise, geocode the address
    try {
      const fullAddress = `${address.street} ${address.number}, ${address.city}, ${address.region}, Argentina`;
      const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${token}&country=ar`,
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        createAndAddClientMarker(coordinates, address);
      } else {
        console.warn("No coordinates found for address:", fullAddress);
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
  };

  const createAndAddClientMarker = (coordinates, address) => {
    if (!map.current) return;

    // Create client marker element with home icon
    const clientMarkerEl = document.createElement("div");
    clientMarkerEl.className =
      "w-10 h-10 bg-blue-2 rounded-full border-2 border-gold flex items-center justify-center shadow-lg cursor-pointer";
    clientMarkerEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    `;

    // Add client marker
    new mapboxgl.Marker(clientMarkerEl)
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `
          <div className="p-2">
            <h3 className="font-bold text-blue-1">Tu Dirección de Entrega</h3>
            <p className="text-sm text-blue-2">${address.street} ${address.number}</p>
            ${address.apartment ? `<p className="text-sm text-blue-2">Apto: ${address.apartment}</p>` : ""}
            <p className="text-sm text-blue-2">${address.city}, ${address.region}</p>
          </div>
        `,
        ),
      )
      .addTo(map.current);

    // Update bounds to include client marker
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(WAREHOUSE_LOCATION.coordinates);
    bounds.extend(coordinates);
    map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
  };

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden shadow-md border border-gray-2">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default DeliveryLocationMap;
