import { useState, useMemo, useEffect } from 'react';
import { Asset, FilterState } from './types';
import { mockFleet, ALL_TYPES, ALL_STATUSES } from './data/mockFleet';
import { FilterBar } from './components/FilterBar';
import { AssetList } from './components/AssetList';
import { MapView } from './components/MapView';
import { StatsBar } from './components/StatsBar';

const DEFAULT_FILTERS: FilterState = {
  types: [...ALL_TYPES],
  statuses: [...ALL_STATUSES],
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [view, setView] = useState<'split' | 'map' | 'list'>(() => {
    const saved = localStorage.getItem('fleetView');
    return (saved === 'map' || saved === 'list' || saved === 'split') ? saved : 'split';
  });

  useEffect(() => {
    localStorage.setItem('fleetView', view);
  }, [view]);

  const filteredAssets = useMemo(
    () =>
      mockFleet.filter(
        (a) => filters.types.includes(a.type) && filters.statuses.includes(a.status)
      ),
    [filters]
  );

  function handleSelectAsset(asset: Asset) {
    setSelectedAsset((prev) => (prev?.id === asset.id ? null : asset));
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 text-white px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">Fleet Status</span>
          <span className="text-gray-400 text-sm hidden sm:block">Real-time asset monitoring</span>
        </div>
        <div className="flex items-center gap-4">
          <StatsBar allAssets={mockFleet} />
          <div className="h-5 w-px bg-gray-600" />
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-600">
            {(['split', 'map', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  view === v ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {v === 'split' ? '⊡ Split' : v === 'map' ? '🗺 Map' : '☰ List'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={mockFleet.length}
        filteredCount={filteredAssets.length}
      />

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Asset list panel */}
        {(view === 'split' || view === 'list') && (
          <div
            className={`flex flex-col bg-white border-r border-gray-200 overflow-hidden ${
              view === 'list' ? 'w-full' : 'w-80 shrink-0'
            }`}
          >
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Assets ({filteredAssets.length})
              </h2>
            </div>
            <AssetList
              assets={filteredAssets}
              selectedId={selectedAsset?.id ?? null}
              onSelect={handleSelectAsset}
            />
          </div>
        )}

        {/* Map panel */}
        {(view === 'split' || view === 'map') && (
          <div className="flex-1 relative">
            <MapView
              assets={filteredAssets}
              selectedAsset={selectedAsset}
              onSelect={handleSelectAsset}
            />
            {/* Selected asset detail overlay */}
            {selectedAsset && (
              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 min-w-[220px] z-[1000]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{selectedAsset.name}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">
                      {selectedAsset.type} · {selectedAsset.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium capitalize">{selectedAsset.status}</span>
                  <span className="text-gray-500">Lat</span>
                  <span>{selectedAsset.lat.toFixed(3)}°N</span>
                  <span className="text-gray-500">Lng</span>
                  <span>{Math.abs(selectedAsset.lng).toFixed(3)}°W</span>
                  {selectedAsset.speed !== undefined && (
                    <>
                      <span className="text-gray-500">Speed</span>
                      <span>{selectedAsset.speed} kts</span>
                    </>
                  )}
                  {selectedAsset.altitude !== undefined && selectedAsset.altitude > 0 && (
                    <>
                      <span className="text-gray-500">Altitude</span>
                      <span>{selectedAsset.altitude.toLocaleString()} ft</span>
                    </>
                  )}
                  {selectedAsset.heading !== undefined && (
                    <>
                      <span className="text-gray-500">Heading</span>
                      <span>{selectedAsset.heading}°</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
