// Configuration for connecting React Native app to Python FastAPI Backend
export const SERVER_HOST = '192.168.1.107'; // Computer local Wi-Fi IP address
export const PORT = '8000';

export const API_BASE_URL = `http://${SERVER_HOST}:${PORT}/api`;

export const endpoints = {
  vehicles: `${API_BASE_URL}/vehicles`,
  updateGps: (vehicleId) => `${API_BASE_URL}/vehicles/${vehicleId}/gps`,
  incidents: `${API_BASE_URL}/incidents`,
  geoPhotos: `${API_BASE_URL}/geo-photos`,
  weatherGeojson: `${API_BASE_URL}/geojson/weather`,
  alertsGeojson: `${API_BASE_URL}/geojson/alerts`
};
