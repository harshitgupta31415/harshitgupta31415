import { mkdir, writeFile } from "node:fs/promises";

const handle = process.env.CODEFORCES_HANDLE || "HarshitGupta314";
const endpoint = `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`;
const response = await fetch(endpoint, {
  headers: { "User-Agent": "harshitgupta31415-profile-chart/1.0" },
});

if (!response.ok) {
  throw new Error(`Codeforces API returned ${response.status}`);
}

const payload = await response.json();
if (payload.status !== "OK" || !Array.isArray(payload.result) || payload.result.length === 0) {
  throw new Error(payload.comment || "No Codeforces rating history returned");
}

const contests = payload.result;
const width = 960;
const height = 350;
const plot = { left: 74, right: 40, top: 86, bottom: 62 };
const plotWidth = width - plot.left - plot.right;
const plotHeight = height - plot.top - plot.bottom;
const ratings = contests.map((contest) => contest.newRating);
const minRating = Math.max(0, Math.floor((Math.min(...ratings) - 120) / 200) * 200);
const maxRating = Math.ceil((Math.max(...ratings) + 120) / 200) * 200;
const range = Math.max(200, maxRating - minRating);

const x = (index) => plot.left + (contests.length === 1 ? plotWidth / 2 : (index * plotWidth) / (contests.length - 1));
const y = (rating) => plot.top + ((maxRating - rating) * plotHeight) / range;
const points = contests.map((contest, index) => ({
  x: x(index),
  y: y(contest.newRating),
  rating: contest.newRating,
  contestId: contest.contestId,
}));

const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
const areaPath = `${linePath} L${points.at(-1).x.toFixed(1)} ${(plot.top + plotHeight).toFixed(1)} L${points[0].x.toFixed(1)} ${(plot.top + plotHeight).toFixed(1)} Z`;
const peak = Math.max(...ratings);
const latest = ratings.at(-1);

const rankName = (rating) => {
  if (rating >= 3000) return "Legendary Grandmaster";
  if (rating >= 2600) return "International Grandmaster";
  if (rating >= 2400) return "Grandmaster";
  if (rating >= 2300) return "International Master";
  if (rating >= 2100) return "Master";
  if (rating >= 1900) return "Candidate Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Specialist";
  if (rating >= 1200) return "Pupil";
  return "Newbie";
};

const ratingColor = (rating) => {
  if (rating >= 2400) return "#ef4444";
  if (rating >= 2100) return "#f59e0b";
  if (rating >= 1900) return "#a855f7";
  if (rating >= 1600) return "#3b82f6";
  if (rating >= 1400) return "#22d3ee";
  if (rating >= 1200) return "#22c55e";
  return "#94a3b8";
};

const grid = [];
for (let rating = minRating; rating <= maxRating; rating += 200) {
  const gridY = y(rating).toFixed(1);
  grid.push(`<line x1="${plot.left}" y1="${gridY}" x2="${width - plot.right}" y2="${gridY}" stroke="#30363d" stroke-width="1" />`);
  grid.push(`<text x="${plot.left - 14}" y="${Number(gridY) + 5}" fill="#8b949e" font-size="12" text-anchor="end">${rating}</text>`);
}

const dots = points.map((point, index) => {
  const last = index === points.length - 1;
  const pulse = last
    ? `\n    <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="7" fill="none" stroke="${ratingColor(point.rating)}" opacity="0.8"><animate attributeName="r" values="7;15;7" dur="2.2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.8;0;0.8" dur="2.2s" repeatCount="indefinite" /></circle>`
    : "";
  return `<g>
    <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="5" fill="${ratingColor(point.rating)}" stroke="#0d1117" stroke-width="3" />${pulse}
    <text x="${point.x.toFixed(1)}" y="${(point.y - 12).toFixed(1)}" fill="#c9d1d9" font-size="11" text-anchor="middle">${point.rating}</text>
    <text x="${point.x.toFixed(1)}" y="${height - 27}" fill="#8b949e" font-size="10" text-anchor="middle">#${point.contestId}</text>
  </g>`;
}).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${handle} Codeforces rating history</title>
  <desc id="description">Rating progression across ${contests.length} contests, ending at ${latest} with a peak of ${peak}.</desc>
  <defs>
    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#58a6ff" stop-opacity="0.35" />
      <stop offset="1" stop-color="#58a6ff" stop-opacity="0.02" />
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8b949e" />
      <stop offset="0.55" stop-color="#3fb950" />
      <stop offset="1" stop-color="#58a6ff" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="12" fill="#0d1117" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="11.5" fill="none" stroke="#30363d" />
  <text x="32" y="38" fill="#f0f6fc" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="21" font-weight="700">Codeforces Rating Journey</text>
  <text x="32" y="63" fill="#8b949e" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="13">${handle}  &#8226;  ${contests.length} rated contests  &#8226;  Peak ${peak}  &#8226;  ${rankName(latest)}</text>
  <g font-family="JetBrains Mono, Consolas, monospace">
    ${grid.join("\n    ")}
    <path d="${areaPath}" fill="url(#area)" />
    <path d="${linePath}" fill="none" stroke="url(#line)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    ${dots}
  </g>
</svg>\n`;

await mkdir("assets", { recursive: true });
await writeFile("assets/codeforces-rating.svg", svg, "utf8");
console.log(`Updated Codeforces chart: ${contests.length} contests, latest ${latest}, peak ${peak}`);
