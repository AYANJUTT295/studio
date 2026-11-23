import * as THREE from 'three';

/**
 * Procedural canvas-based texture generator for luxury miniature diorama aesthetics.
 * Produces crisp, beautiful materials without relying on external image networks.
 */

// 1. Gingham Checkered Fabric (for bed duvet & tablecloth)
export function createCheckeredTexture(
  color1: string = '#f472b6',
  color2: string = '#ffffff',
  accent: string = '#fbcfe8',
  repeat: number = 6
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cellSize = 512 / 8;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = color1;
      } else if (r % 2 === 0) {
        ctx.fillStyle = accent;
      } else {
        ctx.fillStyle = color2;
      }
      ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
    }
  }

  // Fabric weave lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 1);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let x = 0; x < 512; x += 4) {
    ctx.fillRect(x, 0, 1, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 2. Parquet Oak Wood Plank Texture (light warm honey)
export function createWoodParquetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#fde68a';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankHeight = 1024 / 8;
  for (let i = 0; i < 8; i++) {
    const y = i * plankHeight;
    const lightness = 82 + (i % 3) * 3;
    ctx.fillStyle = `hsl(38, 65%, ${lightness}%)`;
    ctx.fillRect(0, y, 1024, plankHeight);

    // Subtle grain lines
    ctx.fillStyle = 'rgba(180, 83, 9, 0.09)';
    for (let g = 0; g < 7; g++) {
      const gy = y + 6 + g * 16;
      ctx.fillRect(0, gy, 1024, 2);
    }

    // Plank seam shadow
    ctx.fillStyle = 'rgba(120, 53, 15, 0.28)';
    ctx.fillRect(0, y + plankHeight - 2, 1024, 2);

    // Staggered vertical seams
    const shift = (i % 2) * 256;
    for (let x = shift; x < 1024; x += 512) {
      ctx.fillRect(x, y, 2, plankHeight);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 3. Dark Walnut Wood Texture (for furniture & platforms)
export function createDarkWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle wood streaks
  for (let y = 0; y < 512; y += 8) {
    const shade = Math.random() > 0.5 ? 'rgba(120, 53, 15, 0.25)' : 'rgba(69, 26, 3, 0.3)';
    ctx.fillStyle = shade;
    ctx.fillRect(0, y, 512, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 4. Romantic Pastel Wallpaper (soft pink damask & gold pin-stripes)
export function createWallpaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#fff0f5';
  ctx.fillRect(0, 0, 512, 512);

  const stripeWidth = 512 / 16;
  for (let s = 0; s < 16; s++) {
    if (s % 2 === 0) {
      ctx.fillStyle = '#fce7f3';
      ctx.fillRect(s * stripeWidth, 0, stripeWidth, 512);

      // Gold pin-stripe border
      ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.fillRect(s * stripeWidth, 0, 2, 512);
      ctx.fillRect((s + 1) * stripeWidth - 2, 0, 2, 512);
    }
  }

  // Tiny floral/star accents
  ctx.fillStyle = '#f472b6';
  for (let y = 32; y < 512; y += 64) {
    for (let x = 16; x < 512; x += 64) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 5. Portrait Illustration Texture (Ayaan & Ayra keepsake)
export function createPortraitTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Cream parchment paper
  ctx.fillStyle = '#fffdfa';
  ctx.fillRect(0, 0, 512, 640);

  // Soft watercolor vignette
  const grad = ctx.createRadialGradient(256, 300, 40, 256, 300, 260);
  grad.addColorStop(0, '#ffe4e6');
  grad.addColorStop(0.7, '#fce7f3');
  grad.addColorStop(1, '#ffffff');
  ctx.fillStyle = grad;
  ctx.fillRect(20, 20, 472, 600);

  // Dual intertwined hearts
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(256, 300);
  ctx.bezierCurveTo(256, 250, 190, 210, 150, 260);
  ctx.bezierCurveTo(100, 320, 170, 400, 256, 460);
  ctx.bezierCurveTo(342, 400, 412, 320, 362, 260);
  ctx.bezierCurveTo(322, 210, 256, 250, 256, 300);
  ctx.fill();

  // Ayaan bear & Pinkii bear silhouette inside heart
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(220, 330, 26, 0, Math.PI * 2);
  ctx.arc(292, 330, 24, 0, Math.PI * 2);
  ctx.fill();

  // Typography
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillStyle = '#881337';
  ctx.textAlign = 'center';
  ctx.fillText('Ayaan & Ayra', 256, 130);

  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillStyle = '#9f1239';
  ctx.fillText('Pinkii’s Little Universe ♡', 256, 180);

  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillStyle = '#e11d48';
  ctx.fillText('Forever & Always ♡', 256, 540);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 6. Fluffy Rug Wool Texture
export function createFluffyRugTexture(baseColor: string = '#fbcfe8'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Wool tuft noise
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 2 + Math.random() * 3;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.22)' : 'rgba(244, 114, 182, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 7. Chalkboard Menu Texture (for CafeWorld)
export function createChalkboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark slate chalkboard background with chalk smudges
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, 512, 768);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 20; i++) {
    ctx.fillRect(0, Math.random() * 768, 512, 20 + Math.random() * 40);
  }

  // Header
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('Little Forever Café', 256, 90);

  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#f472b6';
  ctx.fillText('Ayaan & Ayra’s Table', 256, 135);

  // Decorative border
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 452, 708);

  // Menu items
  ctx.textAlign = 'left';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';

  const items = [
    { name: 'Rose Latte (Ayaan’s pick)', price: '♡ free' },
    { name: 'Strawberry Macarons (for Pinkii)', price: '♡ free' },
    { name: 'Heart Butter Cake', price: '♡ free' },
    { name: 'Warmest Hugs', price: 'Always' },
  ];

  let curY = 220;
  items.forEach(it => {
    ctx.fillStyle = '#ffffff';
    ctx.fillText(it.name, 60, curY);
    ctx.fillStyle = '#fde047';
    ctx.fillText(it.price, 360, curY);
    curY += 60;
  });

  // Footer chalk heart doodle
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillStyle = '#f472b6';
  ctx.textAlign = 'center';
  ctx.fillText('“Forever with you, jana ♡”', 256, 620);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 8. Latte Art Froth Texture
export function createLatteArtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Rich espresso crema base
  const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 250);
  grad.addColorStop(0, '#5a2d0c');
  grad.addColorStop(0.7, '#3e1f07');
  grad.addColorStop(1, '#251203');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Microfoam bubbles
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 2;
    ctx.fillStyle = 'rgba(255, 237, 213, 0.15)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Steamed milk heart rosette
  ctx.fillStyle = '#fffbeb';
  ctx.beginPath();
  ctx.moveTo(256, 220);
  ctx.bezierCurveTo(256, 170, 170, 140, 140, 200);
  ctx.bezierCurveTo(110, 260, 180, 330, 256, 380);
  ctx.bezierCurveTo(332, 330, 402, 260, 372, 200);
  ctx.bezierCurveTo(342, 140, 256, 170, 256, 220);
  ctx.fill();

  // Milk feathering streak
  ctx.strokeStyle = '#fffbeb';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(256, 170);
  ctx.lineTo(256, 400);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 9. Water Ripple Texture for Stream
export function createWaterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep indigo/sapphire water with starlight highlights
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#1e3a8a');
  grad.addColorStop(0.5, '#1d4ed8');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft luminous starlight caustics
  ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
  ctx.lineWidth = 3;
  for (let y = 30; y < 512; y += 45) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(150, y + 15, 350, y - 15, 512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
