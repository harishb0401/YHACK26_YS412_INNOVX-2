/**
 * Distance Calculation Utilities using Haversine formula
 */

/**
 * Calculates great-circle distance between two points on the Earth (in km)
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers (rounded to 1 decimal place)
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined ||
      lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    return null;
  }

  const pLat1 = parseFloat(lat1);
  const pLon1 = parseFloat(lon1);
  const pLat2 = parseFloat(lat2);
  const pLon2 = parseFloat(lon2);

  if (isNaN(pLat1) || isNaN(pLon1) || isNaN(pLat2) || isNaN(pLon2)) {
    return null;
  }

  const R = 6371; // Earth's radius in km
  const dLat = (pLat2 - pLat1) * (Math.PI / 180);
  const dLon = (pLon2 - pLon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pLat1 * (Math.PI / 180)) *
      Math.cos(pLat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Estimates distance or proximity factor when coordinates are unavailable, based on city/hub matching
 * @param {string} loc1 
 * @param {string} loc2 
 * @returns {number} estimated distance in km
 */
export function estimateLocationDistance(loc1 = '', loc2 = '') {
  const l1 = (loc1 || '').toLowerCase();
  const l2 = (loc2 || '').toLowerCase();

  if (!l1 || !l2) return 15.0; // Standard default

  const hub1 = l1.split('-')[0].trim();
  const hub2 = l2.split('-')[0].trim();

  if (hub1 && hub2 && (hub1.includes(hub2) || hub2.includes(hub1))) {
    return 6.5; // Same city/industrial corridor
  }

  return 28.0; // Different cluster
}
