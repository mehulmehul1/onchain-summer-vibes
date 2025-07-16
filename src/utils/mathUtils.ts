export const generateSources = (count: number, width: number, height: number) => {
  const sources = [];
  sources.push({ x: width / 2, y: height / 2 });

  if (count > 1) {
    sources.push({ x: width / 4, y: height / 4 });
    sources.push({ x: 3 * width / 4, y: height / 4 });
    sources.push({ x: width / 4, y: 3 * height / 4 });
    sources.push({ x: 3 * width / 4, y: 3 * height / 4 });
  }

  if (count > 5) {
    sources.push({ x: width / 2, y: height / 6 });
    sources.push({ x: width / 2, y: 5 * height / 6 });
    sources.push({ x: width / 6, y: height / 2 });
    sources.push({ x: 5 * width / 6, y: height / 2 });
  }

  while (sources.length < count) {
    sources.push({
      x: Math.random() * width,
      y: Math.random() * height
    });
  }

  return sources.slice(0, count);
};

export const noise = (x: number, y: number, z: number): number => {
  return Math.sin(x * 7 + z * 3) * 0.5 + Math.sin(y * 8 + z * 4) * 0.5;
};

export const getTileOffset = (x: number, y: number, t: number, tileSize: number, tileShiftAmplitude: number) => {
  const tileX = Math.floor(x / tileSize);
  const tileY = Math.floor(y / tileSize);
  const offsetX = tileShiftAmplitude * Math.sin(t * 0.01 + tileX * 0.5 + tileY * 0.3);
  const offsetY = tileShiftAmplitude * Math.cos(t * 0.01 + tileY * 0.5 + tileX * 0.3);
  return { offsetX, offsetY };
};