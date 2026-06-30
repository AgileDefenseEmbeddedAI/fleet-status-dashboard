import { Asset, AssetType, AssetStatus } from '../types';

export interface Scenario {
  id: string;
  label: string;
  description: string;
  assets: Asset[];
}

const TYPES: AssetType[] = ['ship', 'drone', 'airplane'];
const STATUSES: AssetStatus[] = ['active', 'idle', 'maintenance', 'offline'];

const SHIP_NAMES = [
  'Resolute', 'Comfort', 'Bertholf', 'Liberty', 'Vigilant', 'Mercy', 'Freedom',
  'Enterprise', 'Nimitz', 'Roosevelt', 'Lincoln', 'Washington', 'Stennis', 'Truman',
  'Reagan', 'Bush', 'Ford', 'Kearsarge', 'Essex', 'Bataan',
];
const DRONE_NAMES = [
  'Predator', 'Reaper', 'Scout', 'Hawk', 'Eagle', 'Falcon', 'Raptor', 'Osprey',
  'Sparrow', 'Condor', 'Harrier', 'Kestrel', 'Merlin', 'Wyvern', 'Griffin',
  'Phoenix', 'Raven', 'Crow', 'Nighthawk', 'Shadowhawk',
];
const PLANE_NAMES = [
  'C-17 Atlas', 'P-8 Neptune', 'E-3 Sentry', 'KC-135 Tanker', 'C-130J Hercules',
  'B-52 Stratofort', 'F-35 Lightning', 'F-22 Raptor', 'A-10 Warthog', 'V-22 Osprey',
  'E-8 JSTARS', 'RC-135 Rivet', 'EC-130 Compass', 'WC-130 Hercules', 'HC-130 King',
  'MC-130J Shadow', 'AC-130 Spectre', 'MQ-9 Reaper', 'RQ-4 Global', 'U-2 Dragon',
];
const SUFFIXES = [
  'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel',
  'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa',
  'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xray',
  'Yankee', 'Zulu',
];

// US and nearby waters bounding box
const LAT_MIN = 20;
const LAT_MAX = 55;
const LNG_MIN = -160;
const LNG_MAX = -65;

function lerp(t: number, min: number, max: number): number {
  return min + t * (max - min);
}

// Deterministic pseudo-random number based on seed
function seededVal(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateAsset(
  index: number,
  typeOverride?: AssetType,
  statusOverride?: AssetStatus
): Asset {
  const type: AssetType = typeOverride ?? TYPES[index % TYPES.length];
  const status: AssetStatus = statusOverride ?? STATUSES[index % STATUSES.length];

  const lat = lerp(seededVal(index * 3), LAT_MIN, LAT_MAX);
  const lng = lerp(seededVal(index * 3 + 1), LNG_MIN, LNG_MAX);
  const isMoving = status === 'active';

  let name: string;
  let id: string;
  if (type === 'ship') {
    name = `USS ${SHIP_NAMES[index % SHIP_NAMES.length]}${index >= SHIP_NAMES.length ? `-${Math.floor(index / SHIP_NAMES.length)}` : ''}`;
    id = `ship-${String(index + 1).padStart(3, '0')}`;
  } else if (type === 'drone') {
    name = `${DRONE_NAMES[index % DRONE_NAMES.length]} ${SUFFIXES[index % SUFFIXES.length]}`;
    id = `drone-${String(index + 1).padStart(3, '0')}`;
  } else {
    name = `${PLANE_NAMES[index % PLANE_NAMES.length]}${index >= PLANE_NAMES.length ? ` ${SUFFIXES[index % SUFFIXES.length]}` : ''}`;
    id = `plane-${String(index + 1).padStart(3, '0')}`;
  }

  const speed = isMoving
    ? type === 'ship'
      ? Math.round(lerp(seededVal(index * 3 + 2), 5, 30))
      : type === 'drone'
      ? Math.round(lerp(seededVal(index * 3 + 2), 80, 200))
      : Math.round(lerp(seededVal(index * 3 + 2), 300, 900))
    : 0;

  const heading = isMoving ? Math.round(seededVal(index * 5) * 360) : 0;

  const asset: Asset = {
    id,
    name,
    type,
    status,
    lat: parseFloat(lat.toFixed(4)),
    lng: parseFloat(lng.toFixed(4)),
    lastUpdate: '2026-06-30T14:30:00Z',
    speed,
    heading,
  };

  if (type !== 'ship') {
    asset.altitude = isMoving
      ? type === 'drone'
        ? Math.round(lerp(seededVal(index * 7), 5000, 30000) / 100) * 100
        : Math.round(lerp(seededVal(index * 7), 20000, 45000) / 1000) * 1000
      : 0;
  }

  return asset;
}

function generateFleet(
  count: number,
  typeOverride?: AssetType,
  statusOverride?: AssetStatus
): Asset[] {
  return Array.from({ length: count }, (_, i) => generateAsset(i, typeOverride, statusOverride));
}

// Small: 10 assets with diverse types/statuses
const smallAssets = generateFleet(10);

// Medium: 50 assets with diverse types/statuses
const mediumAssets = generateFleet(50);

// Large: 500 assets with diverse types/statuses
const largeAssets = generateFleet(500);

// Edge case: all offline
const allOfflineAssets = generateFleet(30, undefined, 'offline');

// Edge case: all maintenance
const allMaintenanceAssets = generateFleet(30, undefined, 'maintenance');

// Edge case: heavily skewed — 80% active, rest offline
const skewedAssets: Asset[] = [
  ...generateFleet(40, undefined, 'active'),
  ...generateFleet(4, undefined, 'idle'),
  ...generateFleet(2, undefined, 'maintenance'),
  ...generateFleet(4, undefined, 'offline'),
].map((a, i) => ({ ...a, id: `skewed-${String(i + 1).padStart(3, '0')}` }));

export const SCENARIOS: Scenario[] = [
  {
    id: 'small',
    label: 'Small (10)',
    description: '10 assets — diverse types and statuses',
    assets: smallAssets,
  },
  {
    id: 'medium',
    label: 'Medium (50)',
    description: '50 assets — diverse types and statuses',
    assets: mediumAssets,
  },
  {
    id: 'large',
    label: 'Large (500)',
    description: '500 assets — stress test for performance',
    assets: largeAssets,
  },
  {
    id: 'all-offline',
    label: 'All Offline (30)',
    description: '30 assets — all offline, edge case',
    assets: allOfflineAssets,
  },
  {
    id: 'all-maintenance',
    label: 'All Maintenance (30)',
    description: '30 assets — all in maintenance, edge case',
    assets: allMaintenanceAssets,
  },
  {
    id: 'skewed',
    label: 'Skewed Active (50)',
    description: '50 assets — 80% active, mixed remainder',
    assets: skewedAssets,
  },
];

export const DEFAULT_SCENARIO_ID = 'small';
