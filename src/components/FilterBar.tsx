import { AssetType, AssetStatus, FilterState } from '../types';
import { ALL_TYPES, ALL_STATUSES } from '../data/mockFleet';

const TYPE_LABELS: Record<AssetType, string> = {
  ship: '🚢 Ships',
  drone: '🛩 Drones',
  airplane: '✈️ Airplanes',
};

const STATUS_LABELS: Record<AssetStatus, string> = {
  active: 'Active',
  idle: 'Idle',
  maintenance: 'Maintenance',
  offline: 'Offline',
};

const STATUS_COLORS: Record<AssetStatus, string> = {
  active: 'bg-green-500',
  idle: 'bg-yellow-400',
  maintenance: 'bg-blue-500',
  offline: 'bg-red-500',
};

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterBar({ filters, onChange, totalCount, filteredCount }: FilterBarProps) {
  function toggleType(type: AssetType) {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types });
  }

  function toggleStatus(status: AssetStatus) {
    const statuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses });
  }

  function clearAll() {
    onChange({ types: [...ALL_TYPES], statuses: [...ALL_STATUSES] });
  }

  const isFiltered =
    filters.types.length < ALL_TYPES.length || filters.statuses.length < ALL_STATUSES.length;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</span>
          <div className="flex gap-1.5">
            {ALL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.types.includes(type)
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
          <div className="flex gap-1.5">
            {ALL_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.statuses.includes(status)
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {isFiltered && (
            <button
              onClick={clearAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
          <span className="text-sm text-gray-500">
            {filteredCount === totalCount ? (
              <>{totalCount} assets</>
            ) : (
              <>
                {filteredCount} <span className="text-gray-400">/ {totalCount}</span> assets
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
