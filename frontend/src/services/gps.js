/**
 * Valencia City, Bukidnon coordinates and boundaries
 * For MVP: mock random location within Valencia City
 */
const VALENCIA_CITY_BOUNDS = {
  // Approximate bounds for Valencia City, Bukidnon
  north: 8.2700,
  south: 8.2100,
  east: 125.1400,
  west: 125.0800,
  center: {
    latitude: 8.2400,
    longitude: 125.1100,
  },
}

/**
 * Get mock random GPS location within Valencia City
 * Returns object with latitude and longitude
 */
export function getMockGPSLocation() {
  const lat =
    VALENCIA_CITY_BOUNDS.south +
    Math.random() *
      (VALENCIA_CITY_BOUNDS.north - VALENCIA_CITY_BOUNDS.south)

  const lon =
    VALENCIA_CITY_BOUNDS.west +
    Math.random() *
      (VALENCIA_CITY_BOUNDS.east - VALENCIA_CITY_BOUNDS.west)

  return {
    latitude: parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lon.toFixed(6)),
  }
}

/**
 * Get Valencia City center coordinates
 */
export function getValenciaCityCenter() {
  return VALENCIA_CITY_BOUNDS.center
}

/**
 * Try to get real GPS location (for future enhancement)
 * Falls back to mock location if not available
 */
export async function getRealOrMockGPSLocation() {
  try {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported, using mock location')
      return getMockGPSLocation()
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          console.log('Geolocation error, using mock location:', error)
          // Fall back to mock location
          resolve(getMockGPSLocation())
        },
        {
          timeout: 5000,
          enableHighAccuracy: false,
        }
      )
    })
  } catch (error) {
    console.error('Error getting GPS location:', error)
    return getMockGPSLocation()
  }
}
