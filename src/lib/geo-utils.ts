/**
 * Geographic utility functions for calculating distances and service area coverage
 * Uses the Haversine formula for accurate distance calculations on Earth's surface
 */

const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the distance between two geographic points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Check if a customer location is within a groomer's service area
 * @param customerLat Customer's latitude
 * @param customerLng Customer's longitude
 * @param groomerLat Groomer work area center latitude
 * @param groomerLng Groomer work area center longitude
 * @param radiusKm Service radius in kilometers
 * @returns True if customer is within service area
 */
export function isWithinServiceArea(
  customerLat: number,
  customerLng: number,
  groomerLat: number,
  groomerLng: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(customerLat, customerLng, groomerLat, groomerLng);
  return distance <= radiusKm;
}

/**
 * Find the closest work area to a customer and return distance info
 * @param customerLat Customer's latitude
 * @param customerLng Customer's longitude
 * @param workAreas Array of groomer work areas with coordinates and radius
 * @returns Object with closest work area and distance info, or null if none within range
 */
export function findClosestWorkArea(
  customerLat: number,
  customerLng: number,
  workAreas: Array<{
    id: string;
    centerLat: number;
    centerLng: number;
    radiusKm: number;
    name?: string;
  }>
): {
  workArea: {
    id: string;
    centerLat: number;
    centerLng: number;
    radiusKm: number;
    name?: string;
  };
  distance: number;
  isWithinRange: boolean;
} | null {
  if (workAreas.length === 0) return null;

  let closest = workAreas[0];
  let closestDistance = calculateDistance(
    customerLat,
    customerLng,
    closest.centerLat,
    closest.centerLng
  );

  // Find the closest work area
  for (const workArea of workAreas.slice(1)) {
    const distance = calculateDistance(
      customerLat,
      customerLng,
      workArea.centerLat,
      workArea.centerLng
    );

    if (distance < closestDistance) {
      closest = workArea;
      closestDistance = distance;
    }
  }

  return {
    workArea: closest,
    distance: closestDistance,
    isWithinRange: closestDistance <= closest.radiusKm,
  };
}

/**
 * Check if a groomer can service a customer location based on any of their work areas
 * @param customerLat Customer's latitude
 * @param customerLng Customer's longitude
 * @param workAreas Array of groomer work areas
 * @returns True if customer is within at least one work area
 */
export function canServiceLocation(
  customerLat: number,
  customerLng: number,
  workAreas: Array<{
    centerLat: number;
    centerLng: number;
    radiusKm: number;
  }>
): boolean {
  return workAreas.some((workArea) =>
    isWithinServiceArea(
      customerLat,
      customerLng,
      workArea.centerLat,
      workArea.centerLng,
      workArea.radiusKm
    )
  );
}

/**
 * Sort groomers by distance to customer location
 * @param groomers Array of groomers with work areas
 * @param customerLat Customer's latitude
 * @param customerLng Customer's longitude
 * @returns Sorted array with distance information
 */
export function sortGroomersByDistance<
  T extends {
    workAreas: Array<{
      centerLat: number;
      centerLng: number;
      radiusKm: number;
    }>;
  },
>(groomers: T[], customerLat: number, customerLng: number): Array<T & { closestDistance: number }> {
  return groomers
    .map((groomer) => {
      // Add id property to workAreas for findClosestWorkArea function
      const workAreasWithId = groomer.workAreas.map((workArea, index) => ({
        ...workArea,
        id: `workArea-${index}`,
      }));

      const closestWorkArea = findClosestWorkArea(customerLat, customerLng, workAreasWithId);

      return {
        ...groomer,
        closestDistance: closestWorkArea?.distance ?? Infinity,
      };
    })
    .sort((a, b) => a.closestDistance - b.closestDistance);
}
