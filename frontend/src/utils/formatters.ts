export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatPercentage = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const formatScientificName = (rawName: string): string => {
  const parts = rawName.split('_');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1).toLowerCase()} ${parts.slice(1).join(' ').toLowerCase()}`;
  }
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
};

export const generateCameraTrapMetadata = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');

  const stationIds = ['CAM-NAM-04', 'CAM-DESERT-12', 'CAM-ETOSHA-09', 'CAM-LION-03'];
  const randomStation = stationIds[Math.floor(Math.random() * stationIds.length)];
  const randomTemp = Math.floor(Math.random() * 14) + 24; // 24°C - 38°C
  const randomTrigger = (Math.random() * 0.4 + 0.1).toFixed(2); // 0.12s trigger

  return {
    timestamp: `${year}-${month}-${day} ${hours}:${mins}:${secs} UTC+2`,
    stationId: randomStation,
    temperature: `${randomTemp}°C`,
    triggerLatency: `${randomTrigger}s`,
    location: 'Northern Namibia (Desert Lion Conservation Zone)'
  };
};
