import { useMemo } from 'react';
import { Asset, AssetType, AssetStatus, FilterState } from '../types';
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
  allAssets: Asset[];
}

export function FilterBar({ filters, onChange, totalCount, filteredCount, allAssets }: FilterBarProps) {
  // Cross-filtered counts: each pill shows how many assets match that option
  // given the OTHER filter group's current selection.
  const typeCounts = useMemo(
    () =>
      Object.fromEntries(
        ALL_TYPES.map((type) => [
          type,
          allAssets.filter((a) => a.type === type && filters.statuses.includes(a.status)).length,
        ])
      ) as Record<AssetType, number>,
    [allAssets, filters.statuses]
  );

  const statusCounts = useMemo(
    () =>
      Object.fromEntries(
        ALL_STATUSES.map((status) => [
          status,
          allAssets.filter((a) => a.status === status && filters.types.includes(a.type)).length,
        ])
      ) as Record<AssetStatus, number>,
    [allAssets, filters.types]
  );

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

  function selectOnlyType(type: AssetType, e: React.MouseEvent) {
    e.stopPropagation();
    onChange({ ...filters, types: [type] });
  }

  function selectOnlyStatus(status: AssetStatus, e: React.MouseEvent) {
    e.stopPropagation();
    onChange({ ...filters, statuses: [status] });
  }

  function clearAll() {
    onChange({ types: [...ALL_TYPES], statuses: [...ALL_STATUSES] });
  }

  const isFiltered =
    filters.types.length < ALL_TYPES.length || filters.statuses.length < ALL_STATUSES.length;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-4">
        {/* Type filter group */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">
            Type
          </span>
          <div className="flex gap-1.5">
            {ALL_TYPES.map((type) => {
              const active = filters.types.includes(type);
              const count = typeCounts[type];
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  title={active ? `Hide ${type}s` : `Show ${type}s`}
                  className={`group flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                  }`}
                >
                  {TYPE_LABELS[type]}
                  <span
                    className={`text-xs min-w-[18px] text-center rounded-full px-1 ${
                      active ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                  {/* "Only" shortcut shown on hover when multiple types selected */}
                  {active && filters.types.length > 1 && (
                    <span
                      role="button"
                      onClick={(e) => selectOnlyType(type, e)}
                      title={`Show only ${type}s`}
                      className="hidden group-hover:inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-600 hover:bg-blue-500 text-white text-[10px] leading-none ml-0.5 cursor-pointer"
                    >
                      1
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-4 w-px bg-gray-200" />

        {/* Status filter group */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">
            Status
          </span>
          <div className="flex gap-1.5">
            {ALL_STATUSES.map((status) => {
              const active = filters.statuses.includes(status);
              const count = statusCounts[status];
              return (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  title={active ? `Hide ${status}` : `Show ${status}`}
                  className={`group flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[status]}`} />
                  {STATUS_LABELS[status]}
                  <span
                    className={`text-xs min-w-[18px] text-center rounded-full px-1 ${
                      active ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                  {/* "Only" shortcut shown on hover when multiple statuses selected */}
                  {active && filters.statuses.length > 1 && (
                    <span
                      role="button"
                      onClick={(e) => selectOnlyStatus(status, e)}
                      title={`Show only ${status}`}
                      className="hidden group-hover:inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-600 hover:bg-blue-500 text-white text-[10px] leading-none ml-0.5 cursor-pointer"
                    >
                      1
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: reset + count */}
        <div className="ml-auto flex items-center gap-3">
          {isFiltered && (
            <button
              onClick={clearAll}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset filters
            </button>
          )}
          <span className="text-sm text-gray-500">
            {filteredCount === totalCount ? (
              <>{totalCount} assets</>
            ) : (
              <>
                <span className="font-medium text-gray-700">{filteredCount}</span>
                <span className="text-gray-400"> / {totalCount}</span>
                <span className="text-gray-400"> assets</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
