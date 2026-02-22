import qrcode from "qrcode-generator";

export function generateQRDataUrl(text: string, size = 200): string {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  
  const moduleCount = qr.getModuleCount();
  const cellSize = Math.floor(size / moduleCount);
  const margin = 16;
  const svgSize = moduleCount * cellSize + margin * 2;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="white" rx="12"/>`;
  
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        svg += `<rect x="${col * cellSize + margin}" y="${row * cellSize + margin}" width="${cellSize}" height="${cellSize}" fill="#1a1a1a" rx="1"/>`;
      }
    }
  }
  
  svg += "</svg>";
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function downloadQR(url: string, filename: string) {
  const dataUrl = generateQRDataUrl(url, 300);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${filename}.svg`;
  link.click();
}
