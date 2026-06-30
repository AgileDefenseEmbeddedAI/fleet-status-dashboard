import { AssetStatus } from '../types';

const statusConfig: Record<AssetStatus, { label: string; classes: string }> = {
  active: { label: 'Active', classes: 'bg-green-100 text-green-800 border-green-200' },
  idle: { label: 'Idle', classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  maintenance: { label: 'Maintenance', classes: 'bg-orange-100 text-orange-800 border-orange-200' },
  offline: { label: 'Offline', classes: 'bg-red-100 text-red-800 border-red-200' },
};

interface StatusBadgeProps {
  status: AssetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
}
