import { Asset, AssetStatus } from '../types';
import { ALL_STATUSES } from '../data/constants';

const STATUS_LABELS: Record<AssetStatus, string> = {
  active: 'Active',
  idle: 'Idle',
  maintenance: 'Maintenance',
  offline: 'Offline',
};

const STATUS_COLORS: Record<AssetStatus, string> = {
  active: 'text-green-600',
  idle: 'text-yellow-600',
  maintenance: 'text-blue-600',
  offline: 'text-red-600',
};

interface StatsBarProps {
  allAssets: Asset[];
}

export function StatsBar({ allAssets }: StatsBarProps) {
  const counts = ALL_STATUSES.reduce(
    (acc, status) => ({
      ...acc,
      [status]: allAssets.filter((a) => a.status === status).length,
    }),
    {} as Record<AssetStatus, number>
  );

  return (
    <div className="flex items-center gap-6">
      {ALL_STATUSES.map((status) => (
        <div key={status} className="flex items-center gap-1.5">
          <span className={`text-xl font-bold ${STATUS_COLORS[status]}`}>{counts[status]}</span>
          <span className="text-xs text-gray-400">{STATUS_LABELS[status]}</span>
        </div>
      ))}
    </div>
  );
}
