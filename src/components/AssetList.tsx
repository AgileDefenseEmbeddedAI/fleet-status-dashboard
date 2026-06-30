import { Asset } from '../types';
import { AssetCard } from './AssetCard';

interface AssetListProps {
  assets: Asset[];
  selectedId: string | null;
  onSelect: (asset: Asset) => void;
}

export function AssetList({ assets, selectedId, onSelect }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-sm font-medium">No assets match your filters</p>
        <p className="text-xs mt-1">Try adjusting the type or status filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          selected={asset.id === selectedId}
          onClick={() => onSelect(asset)}
        />
      ))}
    </div>
  );
}
