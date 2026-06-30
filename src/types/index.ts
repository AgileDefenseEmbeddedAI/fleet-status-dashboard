export type AssetType = 'ship' | 'drone' | 'airplane';
export type AssetStatus = 'active' | 'idle' | 'maintenance' | 'offline';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lng: number;
  lastUpdate: string;
  speed?: number;
  heading?: number;
  altitude?: number;
}

export interface FilterState {
  types: AssetType[];
  statuses: AssetStatus[];
}
