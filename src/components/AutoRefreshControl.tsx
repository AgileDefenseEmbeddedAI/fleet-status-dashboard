import { RefreshInterval, REFRESH_OPTIONS } from '../hooks/useAutoRefresh';

interface Props {
  enabled: boolean;
  interval: RefreshInterval;
  onToggle: (enabled: boolean) => void;
  onIntervalChange: (interval: RefreshInterval) => void;
  lastRefreshed: Date | null;
}

export function AutoRefreshControl({ enabled, interval, onToggle, onIntervalChange, lastRefreshed }: Props) {
  const timeLabel = lastRefreshed
    ? lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Toggle */}
      <button
        onClick={() => onToggle(!enabled)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
          enabled
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        title={enabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
      >
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${enabled ? 'bg-green-300 animate-pulse' : 'bg-gray-500'}`} />
        {enabled ? 'Live' : 'Paused'}
      </button>

      {/* Interval selector */}
      <div className="flex rounded-md overflow-hidden border border-gray-600">
        {REFRESH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onIntervalChange(opt.value)}
            className={`px-2 py-1 font-medium transition-colors ${
              interval === opt.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Last refreshed */}
      {timeLabel && (
        <span className="text-gray-500 hidden sm:block">
          Updated {timeLabel}
        </span>
      )}
    </div>
  );
}
