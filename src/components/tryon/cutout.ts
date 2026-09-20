function isStudioBackdrop(r: number, g: number, b: number) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min > 222 && max - min < 20;
}

export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image"));
    image.src = src;
  });
}

export async function prepareCarPhoto(file: File) {
  const blobUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(blobUrl);
    const max = 1800;
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

export async function cutoutPart(src: string) {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return src;
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = pixels;
  let backdrop = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (isStudioBackdrop(data[i], data[i + 1], data[i + 2])) backdrop += 1;
  }
  if (backdrop / (width * height) < 0.12) return src;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isStudioBackdrop(r, g, b)) {
      data[i + 3] = 0;
      continue;
    }
    const min = Math.min(r, g, b);
    if (min > 200) {
      data[i + 3] = Math.min(data[i + 3], Math.round((230 - min) * 8.5));
    }
  }
  ctx.putImageData(pixels, 0, 0);

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) return src;
  const pad = 8;
  const sx = Math.max(0, minX - pad);
  const sy = Math.max(0, minY - pad);
  const sw = Math.min(width - sx, maxX - minX + pad * 2);
  const sh = Math.min(height - sy, maxY - minY + pad * 2);
  const trimmed = document.createElement("canvas");
  trimmed.width = sw;
  trimmed.height = sh;
  const trimCtx = trimmed.getContext("2d");
  if (!trimCtx) return canvas.toDataURL("image/png");
  trimCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
  return trimmed.toDataURL("image/png");
}
