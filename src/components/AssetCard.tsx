import { Asset } from '../types';
import { StatusBadge } from './StatusBadge';

const TYPE_ICONS: Record<string, string> = {
  ship: '🚢',
  drone: '🛩',
  airplane: '✈️',
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onClick: () => void;
}

export function AssetCard({ asset, selected, onClick }: AssetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        selected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg" aria-hidden="true">{TYPE_ICONS[asset.type]}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{asset.name}</p>
            <p className="text-xs text-gray-500 capitalize">{asset.type} · {asset.id}</p>
          </div>
        </div>
        <StatusBadge status={asset.status} />
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
        <span>{asset.lat.toFixed(2)}°N, {Math.abs(asset.lng).toFixed(2)}°W</span>
        {asset.speed !== undefined && asset.speed > 0 && (
          <span>{asset.speed} kts</span>
        )}
        {asset.altitude !== undefined && asset.altitude > 0 && (
          <span>{asset.altitude.toLocaleString()} ft</span>
        )}
        <span className="ml-auto">{formatTime(asset.lastUpdate)}</span>
      </div>
    </button>
  );
}
