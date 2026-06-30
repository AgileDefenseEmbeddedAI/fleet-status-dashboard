import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Asset, AssetStatus } from '../types';

// Status color map
const STATUS_COLORS: Record<AssetStatus, string> = {
  active: '#22c55e',
  idle: '#eab308',
  maintenance: '#3b82f6',
  offline: '#ef4444',
};

const TYPE_SYMBOLS: Record<string, string> = {
  ship: '🚢',
  drone: '🛩',
  airplane: '✈️',
};

function createMarkerIcon(asset: Asset): L.DivIcon {
  const color = STATUS_COLORS[asset.status];
  const symbol = TYPE_SYMBOLS[asset.type] ?? '●';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: white;
        border: 3px solid ${color};
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        font-size: 16px;
        cursor: pointer;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
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

interface MapViewProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onSelect: (asset: Asset) => void;
}

export function MapView({ assets, selectedAsset, onSelect }: MapViewProps) {
  return (
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
      {assets.map((asset) => (
        <Marker
          key={asset.id}
          position={[asset.lat, asset.lng]}
          icon={createMarkerIcon(asset)}
          eventHandlers={{ click: () => onSelect(asset) }}
        >
          <Popup>
            <div className="text-sm min-w-[160px]">
              <p className="font-semibold">{asset.name}</p>
              <p className="text-gray-500 capitalize text-xs mt-0.5">{asset.type} · {asset.id}</p>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium capitalize">{asset.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Position</span>
                  <span>{asset.lat.toFixed(2)}°N, {Math.abs(asset.lng).toFixed(2)}°W</span>
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
      ))}
    </MapContainer>
  );
}
