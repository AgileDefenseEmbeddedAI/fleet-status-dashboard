import { Asset } from '../types';

function driftCoord(value: number, maxDrift: number): number {
  return value + (Math.random() - 0.5) * 2 * maxDrift;
}

function driftHeading(heading: number): number {
  const delta = (Math.random() - 0.5) * 20;
  return ((heading + delta) % 360 + 360) % 360;
}

function driftSpeed(speed: number, baseSpeed: number): number {
  const delta = (Math.random() - 0.5) * baseSpeed * 0.1;
  return Math.max(0, Math.round(speed + delta));
}

export function simulateAssetUpdate(asset: Asset): Asset {
  const isMoving = asset.status === 'active';
  const isGrounded = asset.status === 'maintenance' || asset.status === 'offline';

  // Occasionally flip between active and idle (5% chance per asset per refresh)
  let status = asset.status;
  if (!isGrounded && Math.random() < 0.05) {
    status = status === 'active' ? 'idle' : 'active';
  }

  if (isGrounded) {
    return { ...asset, status, lastUpdate: new Date().toISOString() };
  }

  const coordDrift = isMoving ? 0.05 : 0.005;
  const lat = driftCoord(asset.lat, coordDrift);
  const lng = driftCoord(asset.lng, coordDrift);
  const heading = asset.heading !== undefined ? Math.round(driftHeading(asset.heading)) : undefined;
  const speed =
    asset.speed !== undefined && isMoving
      ? driftSpeed(asset.speed, asset.speed || 10)
      : asset.speed;

  return {
    ...asset,
    status,
    lat,
    lng,
    heading,
    speed,
    lastUpdate: new Date().toISOString(),
  };
}

export function simulateFleetUpdate(fleet: Asset[]): Asset[] {
  return fleet.map(simulateAssetUpdate);
}
