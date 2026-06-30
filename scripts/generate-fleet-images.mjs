import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const assets = [
  {
    path: "public/images/hero_light.png",
    width: 1024,
    height: 1024,
    scene: "hotel",
    vehicles: [
      { kind: "van", x: 150, y: 590, scale: 1.05, color: "#111827", tint: "#1f2937" },
      { kind: "sedan", x: 390, y: 670, scale: 0.88, color: "#f8fafc", tint: "#d8dee8" },
    ],
    people: true,
  },
  {
    path: "public/images/chauffeur_day.png",
    width: 1024,
    height: 1024,
    scene: "entrance",
    vehicles: [
      { kind: "sedan", x: 40, y: 635, scale: 1.18, color: "#f9fafb", tint: "#d6dbe5" },
    ],
    driver: true,
  },
  {
    path: "public/images/fleet_light.png",
    width: 1024,
    height: 1024,
    scene: "showroom",
    vehicles: [
      { kind: "sedan", x: 30, y: 660, scale: 0.68, color: "#0f172a", tint: "#27364f" },
      { kind: "sedan", x: 290, y: 640, scale: 0.76, color: "#f8fafc", tint: "#d7dde8" },
      { kind: "van", x: 520, y: 620, scale: 0.76, color: "#111827", tint: "#263247" },
      { kind: "van", x: 690, y: 670, scale: 0.58, color: "#e5e7eb", tint: "#c4ccd7" },
    ],
  },
  {
    path: "public/images/vehicles/economic-class.png",
    width: 960,
    height: 540,
    scene: "studio",
    vehicles: [{ kind: "sedan", x: 120, y: 305, scale: 0.98, color: "#111827", tint: "#29364c" }],
  },
  {
    path: "public/images/vehicles/business-class.png",
    width: 960,
    height: 540,
    scene: "studio-dark",
    vehicles: [{ kind: "sedan", x: 110, y: 300, scale: 1.04, color: "#f8fafc", tint: "#ccd4df" }],
  },
  {
    path: "public/images/vehicles/mini-van-economic.png",
    width: 960,
    height: 540,
    scene: "studio",
    vehicles: [{ kind: "van", x: 95, y: 285, scale: 1.0, color: "#1f2937", tint: "#334155" }],
  },
  {
    path: "public/images/vehicles/mini-van-v-class.png",
    width: 960,
    height: 540,
    scene: "studio-dark",
    vehicles: [{ kind: "van", x: 95, y: 282, scale: 1.03, color: "#f3f4f6", tint: "#c9d0da" }],
  },
  {
    path: "public/images/blog/airport-transfer.png",
    width: 1600,
    height: 900,
    scene: "airport",
    vehicles: [{ kind: "sedan", x: 300, y: 560, scale: 1.18, color: "#111827", tint: "#263247" }],
  },
  {
    path: "public/images/blog/costa-brava-tour.png",
    width: 1600,
    height: 900,
    scene: "coast",
    vehicles: [{ kind: "van", x: 390, y: 540, scale: 1.05, color: "#f8fafc", tint: "#cbd5e1" }],
  },
  {
    path: "public/images/blog/family-v-class.png",
    width: 1600,
    height: 900,
    scene: "hotel",
    vehicles: [{ kind: "van", x: 360, y: 540, scale: 1.1, color: "#111827", tint: "#263247" }],
    luggage: true,
  },
  {
    path: "public/images/blog/cruise-port.png",
    width: 1600,
    height: 900,
    scene: "port",
    vehicles: [{ kind: "sedan", x: 360, y: 565, scale: 1.06, color: "#f8fafc", tint: "#d1d8e3" }],
  },
  {
    path: "public/images/blog/corporate-vip.png",
    width: 1600,
    height: 900,
    scene: "business",
    vehicles: [{ kind: "sedan", x: 330, y: 550, scale: 1.14, color: "#111827", tint: "#263247" }],
    people: true,
  },
  {
    path: "public/images/blog/city-tour.png",
    width: 1600,
    height: 900,
    scene: "city",
    vehicles: [{ kind: "van", x: 330, y: 550, scale: 1.05, color: "#e5e7eb", tint: "#c4ccd7" }],
  },
];

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function defs() {
  return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#dce8f5"/>
        <stop offset="0.55" stop-color="#f8fafc"/>
        <stop offset="1" stop-color="#f1f5f9"/>
      </linearGradient>
      <linearGradient id="night" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#111827"/>
        <stop offset="0.5" stop-color="#1f2937"/>
        <stop offset="1" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e0f2fe" stop-opacity="0.88"/>
        <stop offset="0.55" stop-color="#94a3b8" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#172033" stop-opacity="0.82"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f5d76e"/>
        <stop offset="1" stop-color="#9b7b20"/>
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-40%" width="140%" height="180%">
        <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.25"/>
      </filter>
      <filter id="blurShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="18"/>
      </filter>
    </defs>`;
}

function svg({ width, height, scene, vehicles, people, driver, luggage }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${defs()}
    ${background(width, height, scene)}
    ${road(width, height, scene)}
    ${decor(width, height, scene)}
    ${vehicles.map((vehicle) => drawVehicle(vehicle)).join("")}
    ${luggage ? drawLuggage(width, height) : ""}
    ${people ? drawPeople(width, height) : ""}
    ${driver ? drawDriver(width, height) : ""}
    <rect width="${width}" height="${height}" fill="none"/>
  </svg>`;
}

function background(width, height, scene) {
  const isDark = scene.includes("dark") || scene === "business";
  const base = isDark ? "url(#night)" : "url(#sky)";
  const hotel = `
    <rect x="${width * 0.04}" y="${height * 0.05}" width="${width * 0.52}" height="${height * 0.56}" rx="10" fill="#f8fafc" opacity="0.96"/>
    <rect x="${width * 0.08}" y="${height * 0.12}" width="${width * 0.4}" height="${height * 0.36}" fill="#dbe4ee"/>
    ${gridWindows(width * 0.08, height * 0.12, width * 0.4, height * 0.36, 6, 4)}
    <rect x="${width * 0.02}" y="${height * 0.46}" width="${width * 0.6}" height="${height * 0.11}" fill="#111827" opacity="0.86"/>
    <rect x="${width * 0.58}" y="${height * 0.2}" width="${width * 0.22}" height="${height * 0.38}" fill="#c9b796" opacity="0.9"/>
    <rect x="${width * 0.8}" y="${height * 0.33}" width="${width * 0.14}" height="${height * 0.25}" fill="#f8fafc" opacity="0.95"/>
  `;
  const city = `
    <rect x="${width * 0.04}" y="${height * 0.1}" width="${width * 0.16}" height="${height * 0.48}" fill="#d7dee8"/>
    <rect x="${width * 0.25}" y="${height * 0.02}" width="${width * 0.2}" height="${height * 0.57}" fill="#e6ebf2"/>
    <rect x="${width * 0.5}" y="${height * 0.16}" width="${width * 0.18}" height="${height * 0.43}" fill="#cbd5e1"/>
    <rect x="${width * 0.73}" y="${height * 0.08}" width="${width * 0.18}" height="${height * 0.51}" fill="#e2e8f0"/>
    ${gridWindows(width * 0.25, height * 0.06, width * 0.2, height * 0.48, 5, 7)}
    ${gridWindows(width * 0.73, height * 0.11, width * 0.18, height * 0.44, 4, 7)}
  `;
  const airport = `
    <rect x="${width * 0.04}" y="${height * 0.18}" width="${width * 0.92}" height="${height * 0.38}" rx="8" fill="#e2e8f0"/>
    <path d="M${width * 0.04} ${height * 0.32} L${width * 0.96} ${height * 0.18} L${width * 0.96} ${height * 0.28} L${width * 0.04} ${height * 0.42}Z" fill="#b6c2d1"/>
    ${gridWindows(width * 0.08, height * 0.27, width * 0.8, height * 0.2, 10, 2)}
    <path d="M${width * 0.73} ${height * 0.13} h${width * 0.11} v${height * 0.22} h-${width * 0.11}z" fill="#94a3b8"/>
  `;
  const coast = `
    <rect x="0" y="${height * 0.58}" width="${width}" height="${height * 0.42}" fill="#d7c8a7"/>
    <path d="M0 ${height * 0.38} C${width * 0.22} ${height * 0.25}, ${width * 0.38} ${height * 0.52}, ${width * 0.6} ${height * 0.36} S${width * 0.9} ${height * 0.2}, ${width} ${height * 0.28} V${height * 0.6} H0Z" fill="#87c9df"/>
    <path d="M0 ${height * 0.5} C${width * 0.25} ${height * 0.42}, ${width * 0.55} ${height * 0.58}, ${width} ${height * 0.43}" fill="none" stroke="#f8fafc" stroke-width="${height * 0.018}" opacity="0.85"/>
    <path d="M${width * 0.05} ${height * 0.58} C${width * 0.25} ${height * 0.37}, ${width * 0.35} ${height * 0.28}, ${width * 0.52} ${height * 0.45} C${width * 0.63} ${height * 0.32}, ${width * 0.8} ${height * 0.28}, ${width * 0.95} ${height * 0.55}Z" fill="#6b7d52"/>
  `;
  const port = `
    <rect x="0" y="${height * 0.42}" width="${width}" height="${height * 0.28}" fill="#94c8de"/>
    <rect x="0" y="${height * 0.7}" width="${width}" height="${height * 0.3}" fill="#d1d5db"/>
    <rect x="${width * 0.54}" y="${height * 0.12}" width="${width * 0.35}" height="${height * 0.28}" rx="12" fill="#f8fafc"/>
    <rect x="${width * 0.58}" y="${height * 0.07}" width="${width * 0.25}" height="${height * 0.07}" rx="8" fill="#e5e7eb"/>
    ${gridWindows(width * 0.58, height * 0.18, width * 0.25, height * 0.12, 6, 2)}
    <path d="M${width * 0.2} ${height * 0.2} v${height * 0.25} M${width * 0.2} ${height * 0.2} l${width * 0.18} ${height * 0.12}" stroke="#94a3b8" stroke-width="8"/>
  `;
  const business = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#night)"/>
    <rect x="${width * 0.08}" y="${height * 0.08}" width="${width * 0.26}" height="${height * 0.5}" fill="#263247"/>
    <rect x="${width * 0.42}" y="${height * 0.02}" width="${width * 0.2}" height="${height * 0.56}" fill="#334155"/>
    <rect x="${width * 0.7}" y="${height * 0.14}" width="${width * 0.2}" height="${height * 0.45}" fill="#1e293b"/>
    ${gridWindows(width * 0.1, height * 0.12, width * 0.22, height * 0.4, 5, 7, "#d4af37", 0.35)}
    ${gridWindows(width * 0.44, height * 0.06, width * 0.16, height * 0.48, 4, 8, "#f8fafc", 0.22)}
  `;
  const showroom = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc"/>
    <rect x="${width * 0.08}" y="${height * 0.06}" width="${width * 0.84}" height="${height * 0.44}" rx="18" fill="#e5e7eb"/>
    ${gridWindows(width * 0.13, height * 0.11, width * 0.74, height * 0.32, 8, 3)}
  `;
  const studio = scene === "studio-dark" ? `
    <rect width="${width}" height="${height}" fill="url(#night)"/>
    <circle cx="${width * 0.68}" cy="${height * 0.3}" r="${height * 0.44}" fill="#d4af37" opacity="0.14"/>
  ` : `
    <rect width="${width}" height="${height}" fill="#f8fafc"/>
    <circle cx="${width * 0.72}" cy="${height * 0.28}" r="${height * 0.44}" fill="#d4af37" opacity="0.18"/>
  `;

  const sceneMap = {
    hotel,
    entrance: hotel,
    airport,
    coast,
    port,
    business,
    city,
    showroom,
    studio,
    "studio-dark": studio,
  };

  return `<rect width="${width}" height="${height}" fill="${base}"/>${sceneMap[scene] ?? hotel}`;
}

function gridWindows(x, y, w, h, cols, rows, color = "#ffffff", opacity = 0.52) {
  const gapX = w / cols;
  const gapY = h / rows;
  let out = "";
  for (let col = 0; col < cols; col += 1) {
    for (let row = 0; row < rows; row += 1) {
      out += `<rect x="${x + col * gapX + gapX * 0.12}" y="${y + row * gapY + gapY * 0.16}" width="${gapX * 0.7}" height="${gapY * 0.56}" rx="3" fill="${color}" opacity="${opacity}"/>`;
    }
  }
  return out;
}

function road(width, height, scene) {
  if (scene === "coast") {
    return `<path d="M0 ${height * 0.72} C${width * 0.26} ${height * 0.66}, ${width * 0.64} ${height * 0.8}, ${width} ${height * 0.7} V${height} H0Z" fill="#3f4652"/>
    <path d="M0 ${height * 0.81} C${width * 0.3} ${height * 0.74}, ${width * 0.66} ${height * 0.88}, ${width} ${height * 0.78}" stroke="#f8fafc" stroke-width="${height * 0.01}" stroke-dasharray="50 38" opacity="0.55"/>`;
  }
  const fill = scene.includes("dark") || scene === "business" ? "#0b1120" : "#cbd5e1";
  return `<path d="M0 ${height * 0.58} H${width} V${height} H0Z" fill="${fill}"/>
    <path d="M0 ${height * 0.67} H${width}" stroke="#f8fafc" stroke-width="${Math.max(5, height * 0.008)}" opacity="0.5"/>
    <ellipse cx="${width * 0.5}" cy="${height * 0.82}" rx="${width * 0.42}" ry="${height * 0.09}" fill="#0f172a" opacity="0.12" filter="url(#blurShadow)"/>`;
}

function decor(width, height, scene) {
  const trees = `
    <circle cx="${width * 0.08}" cy="${height * 0.52}" r="${height * 0.07}" fill="#356044"/>
    <rect x="${width * 0.075}" y="${height * 0.54}" width="${width * 0.012}" height="${height * 0.14}" fill="#6b4f2f"/>
    <circle cx="${width * 0.92}" cy="${height * 0.5}" r="${height * 0.08}" fill="#3c6f4a"/>
    <rect x="${width * 0.915}" y="${height * 0.52}" width="${width * 0.012}" height="${height * 0.14}" fill="#6b4f2f"/>
  `;
  if (scene === "studio" || scene === "studio-dark") {
    return `<path d="M${width * 0.1} ${height * 0.72} H${width * 0.9}" stroke="#d4af37" stroke-width="3" opacity="0.65"/>`;
  }
  if (scene === "coast" || scene === "port") {
    return "";
  }
  return trees;
}

function drawVehicle(vehicle) {
  return vehicle.kind === "van" ? drawVan(vehicle) : drawSedan(vehicle);
}

function vehicleGradient(color, tint, id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${esc(tint)}"/>
    <stop offset="0.35" stop-color="${esc(color)}"/>
    <stop offset="0.72" stop-color="${esc(color)}"/>
    <stop offset="1" stop-color="#020617"/>
  </linearGradient>`;
}

function drawSedan({ x, y, scale = 1, color = "#111827", tint = "#29364c" }) {
  const id = `paint-${Math.round(x)}-${Math.round(y)}-${Math.round(scale * 100)}`;
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <defs>${vehicleGradient(color, tint, id)}</defs>
    <ellipse cx="350" cy="118" rx="330" ry="42" fill="#020617" opacity="0.2"/>
    <path d="M78 88 C126 42 185 24 292 24 H398 C482 27 548 52 626 102 L675 115 C700 122 714 138 710 164 L61 164 C55 130 60 104 78 88Z" fill="url(#${id})" stroke="#0f172a" stroke-width="4"/>
    <path d="M179 39 C224 10 304 0 390 21 C436 32 475 55 512 87 H156 C162 67 169 52 179 39Z" fill="url(#glass)" stroke="#dbeafe" stroke-width="3" opacity="0.96"/>
    <path d="M311 19 L303 88" stroke="#f8fafc" stroke-width="4" opacity="0.62"/>
    <path d="M505 87 C560 90 612 98 662 117 C645 130 601 139 552 137 C530 124 515 107 505 87Z" fill="#f8fafc" opacity="0.75"/>
    <path d="M78 121 C120 111 153 112 198 125" stroke="#f8fafc" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
    <rect x="620" y="112" width="52" height="34" rx="6" fill="#111827" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="633" y1="116" x2="633" y2="144" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="646" y1="116" x2="646" y2="144" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="659" y1="116" x2="659" y2="144" stroke="#cbd5e1" stroke-width="2"/>
    ${star(646, 129, 10, "#d4af37")}
    ${wheel(184, 164, 44)}
    ${wheel(566, 164, 44)}
    <path d="M250 113 H402" stroke="#f8fafc" stroke-width="3" opacity="0.28"/>
    <path d="M422 107 h40" stroke="#f8fafc" stroke-width="4" opacity="0.35"/>
  </g>`;
}

function drawVan({ x, y, scale = 1, color = "#111827", tint = "#29364c" }) {
  const id = `paint-${Math.round(x)}-${Math.round(y)}-${Math.round(scale * 100)}`;
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <defs>${vehicleGradient(color, tint, id)}</defs>
    <ellipse cx="365" cy="144" rx="330" ry="48" fill="#020617" opacity="0.21"/>
    <path d="M70 65 C108 26 158 8 235 6 H510 C590 8 655 60 687 116 L704 142 C713 157 707 180 690 184 H64 C48 159 51 95 70 65Z" fill="url(#${id})" stroke="#0f172a" stroke-width="4"/>
    <path d="M157 31 H498 C554 34 603 70 626 112 H128 C126 75 137 49 157 31Z" fill="url(#glass)" stroke="#dbeafe" stroke-width="3" opacity="0.95"/>
    <path d="M285 30 V113 M425 31 V113" stroke="#f8fafc" stroke-width="4" opacity="0.55"/>
    <path d="M626 112 C653 116 676 125 692 140 C674 152 642 159 604 154 C600 138 609 124 626 112Z" fill="#f8fafc" opacity="0.76"/>
    <path d="M78 123 C116 112 156 113 196 128" stroke="#f8fafc" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
    <rect x="618" y="130" width="55" height="32" rx="6" fill="#111827" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="632" y1="134" x2="632" y2="159" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="646" y1="134" x2="646" y2="159" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="660" y1="134" x2="660" y2="159" stroke="#cbd5e1" stroke-width="2"/>
    ${star(646, 146, 10, "#d4af37")}
    ${wheel(194, 184, 47)}
    ${wheel(572, 184, 47)}
    <path d="M456 128 h42" stroke="#f8fafc" stroke-width="4" opacity="0.35"/>
  </g>`;
}

function wheel(cx, cy, r) {
  let spokes = "";
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI * 2 * i) / 10;
    const x = cx + Math.cos(angle) * (r - 9);
    const y = cy + Math.sin(angle) * (r - 9);
    spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#cbd5e1" stroke-width="3" opacity="0.75"/>`;
  }
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#020617"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 9}" fill="#334155"/>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="${r * 0.25}" fill="#e5e7eb"/>
  </g>`;
}

function star(cx, cy, r, color) {
  const a = (Math.PI * 2) / 3;
  const p1 = [cx, cy - r];
  const p2 = [cx + Math.sin(a) * r, cy + Math.cos(a) * r];
  const p3 = [cx - Math.sin(a) * r, cy + Math.cos(a) * r];
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r * 1.15}" fill="none" stroke="${color}" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${p1[0]}" y2="${p1[1]}" stroke="${color}" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${p2[0]}" y2="${p2[1]}" stroke="${color}" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${p3[0]}" y2="${p3[1]}" stroke="${color}" stroke-width="2"/>
  </g>`;
}

function drawPeople(width, height) {
  return `<g opacity="0.95">
    ${person(width * 0.7, height * 0.55, height / 1024, "#111827", "#f1d1b5")}
    ${person(width * 0.77, height * 0.57, height / 1024, "#334155", "#e2b892")}
  </g>`;
}

function drawDriver(width, height) {
  const s = height / 1024;
  return `<g transform="translate(${width * 0.66} ${height * 0.41}) scale(${s * 1.18})" filter="url(#softShadow)">
    <circle cx="75" cy="55" r="34" fill="#e9c2a0"/>
    <path d="M42 55 C46 18 101 13 111 49 C98 36 73 31 42 55Z" fill="#64748b"/>
    <path d="M36 117 C46 77 103 75 122 117 L154 298 H7Z" fill="#0f172a"/>
    <path d="M64 96 h40 l-14 64 h-13z" fill="#f8fafc"/>
    <path d="M84 106 l18 62 h-32z" fill="#d4af37"/>
    <path d="M126 140 C174 159 207 197 221 245" stroke="#0f172a" stroke-width="22" stroke-linecap="round"/>
    <path d="M216 244 C243 250 260 262 268 283" stroke="#e9c2a0" stroke-width="16" stroke-linecap="round"/>
  </g>`;
}

function person(x, y, s, suit, skin) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="45" cy="25" r="20" fill="${skin}"/>
    <path d="M20 75 C26 45 67 43 75 75 L91 178 H6Z" fill="${suit}"/>
    <path d="M35 57 h20 l-8 48 h-5z" fill="#f8fafc"/>
    <path d="M29 86 C0 116 -11 148 -7 180" stroke="${suit}" stroke-width="16" stroke-linecap="round"/>
    <path d="M73 86 C103 113 112 146 105 178" stroke="${suit}" stroke-width="16" stroke-linecap="round"/>
  </g>`;
}

function drawLuggage(width, height) {
  const x = width * 0.26;
  const y = height * 0.68;
  return `<g transform="translate(${x} ${y})" filter="url(#softShadow)">
    <rect x="0" y="30" width="70" height="110" rx="10" fill="#334155"/>
    <rect x="85" y="10" width="64" height="130" rx="10" fill="#d4af37"/>
    <path d="M21 30 v-20 h28 v20 M103 10 v-20 h28 v20" fill="none" stroke="#0f172a" stroke-width="6"/>
    <circle cx="17" cy="148" r="7" fill="#0f172a"/>
    <circle cx="54" cy="148" r="7" fill="#0f172a"/>
    <circle cx="101" cy="148" r="7" fill="#0f172a"/>
    <circle cx="137" cy="148" r="7" fill="#0f172a"/>
  </g>`;
}

for (const asset of assets) {
  const output = path.join(root, asset.path);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await sharp(Buffer.from(svg(asset)))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
  console.log(asset.path);
}
