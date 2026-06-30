import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Asset, AssetStatus, AssetType } from '../types';

const STATUS_COLORS: Record<AssetStatus, string> = {
  active: '#22c55e',
  idle: '#eab308',
  maintenance: '#3b82f6',
  offline: '#ef4444',
};

// SVG paths for each asset type — distinct shapes, no emoji rendering variance
const TYPE_SVG: Record<AssetType, string> = {
  ship: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
  </svg>`,
  drone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M5 5.5C5 4.12 6.12 3 7.5 3S10 4.12 10 5.5 8.88 8 7.5 8 5 6.88 5 5.5M14 5.5C14 4.12 15.12 3 16.5 3S19 4.12 19 5.5 17.88 8 16.5 8 14 6.88 14 5.5M5 18.5C5 17.12 6.12 16 7.5 16S10 17.12 10 18.5 8.88 21 7.5 21 5 19.88 5 18.5M14 18.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5S17.88 21 16.5 21 14 19.88 14 18.5M7.5 9.5c-.28 0-.5.22-.5.5v4c0 .28.22.5.5.5S8 14.28 8 14v-4c0-.28-.22-.5-.5-.5M16.5 9.5c-.28 0-.5.22-.5.5v4c0 .28.22.5.5.5s.5-.22.5-.5v-4c0-.28-.22-.5-.5-.5M10 12c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5s.22.5.5.5h1c.28 0 .5-.22.5-.5M16 12c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5s.22.5.5.5h1c.28 0 .5-.22.5-.5z"/>
  </svg>`,
  airplane: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>`,
};

const TYPE_LABELS: Record<AssetType, string> = {
  ship: 'Ship',
  drone: 'Drone',
  airplane: 'Airplane',
};

function createMarkerIcon(asset: Asset, isSelected: boolean): L.DivIcon {
  const color = STATUS_COLORS[asset.status];
  const svg = TYPE_SVG[asset.type];
  const size = isSelected ? 44 : 36;
  const borderWidth = isSelected ? 4 : 3;
  const shadow = isSelected
    ? `0 0 0 4px ${color}40, 0 3px 8px rgba(0,0,0,0.35)`
    : '0 2px 6px rgba(0,0,0,0.25)';

  return L.divIcon({
    className: '',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: white;
        border: ${borderWidth}px solid ${color};
        box-shadow: ${shadow};
        color: ${color};
        cursor: pointer;
        transition: all 0.15s ease;
      ">
        ${svg}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

function FlyToSelected({ asset }: { asset: Asset | null }) {
  const map = useMap();
  useEffect(() => {
    if (asset) {
      map.flyTo([asset.lat, asset.lng], 7, { duration: 0.8 });
    }
  }, [asset, map]);
  return null;
}

function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2 uppercase tracking-wide" style={{ fontSize: '10px' }}>
        Asset Types
      </p>
      {(Object.keys(TYPE_SVG) as AssetType[]).map((type) => (
        <div key={type} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="inline-flex items-center justify-center rounded-full bg-white border-2 border-gray-400"
            style={{ width: 22, height: 22, color: '#6b7280' }}
            dangerouslySetInnerHTML={{ __html: TYPE_SVG[type] }}
          />
          <span className="text-gray-600">{TYPE_LABELS[type]}</span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="font-semibold text-gray-700 mb-1.5 uppercase tracking-wide" style={{ fontSize: '10px' }}>
          Status
        </p>
        {(Object.entries(STATUS_COLORS) as [AssetStatus, string][]).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 mb-1 last:mb-0">
            <span
              className="inline-block rounded-full border-2"
              style={{ width: 12, height: 12, borderColor: color, background: 'white' }}
            />
            <span className="text-gray-600 capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MapViewProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onSelect: (asset: Asset) => void;
}

export function MapView({ assets, selectedAsset, onSelect }: MapViewProps) {
  return (
    <>
      <MapContainer
        center={[37.5, -96]}
        zoom={4}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToSelected asset={selectedAsset} />
        {assets.map((asset) => {
          const isSelected = selectedAsset?.id === asset.id;
          return (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={createMarkerIcon(asset, isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{ click: () => onSelect(asset) }}
            >
              <Popup>
                <div className="text-sm min-w-[160px]">
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-gray-500 capitalize text-xs mt-0.5">
                    {TYPE_LABELS[asset.type]} · {asset.id}
                  </p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span
                        className="font-medium capitalize"
                        style={{ color: STATUS_COLORS[asset.status] }}
                      >
                        {asset.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Position</span>
                      <span>
                        {asset.lat.toFixed(2)}°, {asset.lng.toFixed(2)}°
                      </span>
                    </div>
                    {asset.speed !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Speed</span>
                        <span>{asset.speed} kts</span>
                      </div>
                    )}
                    {asset.altitude !== undefined && asset.altitude > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Altitude</span>
                        <span>{asset.altitude.toLocaleString()} ft</span>
                      </div>
                    )}
                    {asset.heading !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Heading</span>
                        <span>{asset.heading}°</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <MapLegend />
    </>
  );
}
