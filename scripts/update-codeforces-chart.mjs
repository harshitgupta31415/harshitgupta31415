import { mkdir, writeFile } from "node:fs/promises";

const handle = process.env.CODEFORCES_HANDLE || "HarshitGupta314";
const apiRoot = "https://codeforces.com/api";

const fetchApi = async (path) => {
  const response = await fetch(`${apiRoot}/${path}`, {
    headers: { "User-Agent": "harshitgupta31415-profile-dashboard/2.0" },
  });

  if (!response.ok) {
    throw new Error(`Codeforces API returned ${response.status} for ${path}`);
  }

  const payload = await response.json();
  if (payload.status !== "OK" || !Array.isArray(payload.result)) {
    throw new Error(payload.comment || `Invalid Codeforces response for ${path}`);
  }

  return payload.result;
};

const encodedHandle = encodeURIComponent(handle);
const [users, contests, submissions] = await Promise.all([
  fetchApi(`user.info?handles=${encodedHandle}`),
  fetchApi(`user.rating?handle=${encodedHandle}`),
  fetchApi(`user.status?handle=${encodedHandle}&from=1&count=10000`),
]);

if (users.length !== 1 || contests.length === 0) {
  throw new Error(`No Codeforces profile or rating history found for ${handle}`);
}

const user = users[0];
const acceptedSubmissions = submissions.filter((submission) => submission.verdict === "OK");
const problemKey = (problem) => `${problem.contestId ?? "gym"}-${problem.index}`;
const attemptedProblems = new Set(submissions.map((submission) => problemKey(submission.problem)));
const solvedProblems = new Map();

for (const submission of acceptedSubmissions) {
  const key = problemKey(submission.problem);
  if (!solvedProblems.has(key)) {
    solvedProblems.set(key, submission.problem);
  }
}

const countBy = (values, keyFor) => {
  const counts = new Map();
  for (const value of values) {
    const key = keyFor(value);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
};

const normalizeLanguage = (language) => {
  if (language.startsWith("Python")) return "Python";
  if (language.startsWith("Kotlin")) return "Kotlin";
  if (language.startsWith("GNU C++")) return "C++";
  if (language.startsWith("Java")) return "Java";
  return language;
};

const languageCounts = [...countBy(submissions, (submission) => normalizeLanguage(submission.programmingLanguage)).entries()]
  .sort((a, b) => b[1] - a[1]);
const verdictCounts = countBy(submissions, (submission) => submission.verdict || "TESTING");
const tagCounts = new Map();

for (const problem of solvedProblems.values()) {
  for (const tag of problem.tags || []) {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }
}

const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
const totalSubmissions = submissions.length;
const accepted = acceptedSubmissions.length;
const acceptanceRate = totalSubmissions === 0 ? 0 : (accepted * 100) / totalSubmissions;
const latestRating = user.rating ?? contests.at(-1).newRating;
const peakRating = user.maxRating ?? Math.max(...contests.map((contest) => contest.newRating));

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
  if (rating >= 1600) return "#58a6ff";
  if (rating >= 1400) return "#22d3ee";
  if (rating >= 1200) return "#3fb950";
  return "#8b949e";
};

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const formatDate = (timestamp) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
}).format(new Date(timestamp * 1000));

const width = 1000;
const height = 680;
const cards = [
  { label: "CURRENT RATING", value: latestRating, detail: rankName(latestRating), color: ratingColor(latestRating) },
  { label: "PEAK RATING", value: peakRating, detail: rankName(peakRating), color: ratingColor(peakRating) },
  { label: "PROBLEMS SOLVED", value: solvedProblems.size, detail: `${attemptedProblems.size} attempted`, color: "#3fb950" },
  { label: "SUBMISSIONS", value: totalSubmissions, detail: `${accepted} accepted`, color: "#a371f7" },
  { label: "ACCEPTANCE", value: `${acceptanceRate.toFixed(1)}%`, detail: "all submissions", color: "#d29922" },
  { label: "RATED CONTESTS", value: contests.length, detail: "official contests", color: "#f778ba" },
];

const statCards = cards.map((card, index) => {
  const x = 30 + index * 158;
  return `<g>
    <rect x="${x}" y="78" width="148" height="76" rx="8" fill="#161b22" stroke="#30363d" />
    <rect x="${x}" y="78" width="148" height="3" rx="1.5" fill="${card.color}" />
    <text x="${x + 14}" y="101" class="label">${escapeXml(card.label)}</text>
    <text x="${x + 14}" y="129" class="metric">${escapeXml(card.value)}</text>
    <text x="${x + 14}" y="146" class="detail">${escapeXml(card.detail)}</text>
  </g>`;
}).join("\n");

const graph = { left: 82, right: 612, top: 238, bottom: 438 };
const graphWidth = graph.right - graph.left;
const graphHeight = graph.bottom - graph.top;
const ratings = contests.map((contest) => contest.newRating);
const minRating = Math.max(0, Math.floor((Math.min(...ratings) - 100) / 200) * 200);
const maxRating = Math.ceil((Math.max(...ratings) + 100) / 200) * 200;
const ratingRange = Math.max(200, maxRating - minRating);
const xFor = (index) => graph.left + (contests.length === 1 ? graphWidth / 2 : (index * graphWidth) / (contests.length - 1));
const yFor = (rating) => graph.top + ((maxRating - rating) * graphHeight) / ratingRange;
const ratingPoints = contests.map((contest, index) => ({
  x: xFor(index),
  y: yFor(contest.newRating),
  rating: contest.newRating,
  timestamp: contest.ratingUpdateTimeSeconds,
}));
const linePath = ratingPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
const areaPath = `${linePath} L${ratingPoints.at(-1).x.toFixed(1)} ${graph.bottom} L${ratingPoints[0].x.toFixed(1)} ${graph.bottom} Z`;

const gridValues = [];
for (let rating = minRating; rating <= maxRating; rating += 400) {
  gridValues.push(rating);
}
if (gridValues.at(-1) !== maxRating) gridValues.push(maxRating);

const ratingGrid = gridValues.map((rating) => {
  const y = yFor(rating).toFixed(1);
  return `<line x1="${graph.left}" y1="${y}" x2="${graph.right}" y2="${y}" stroke="#30363d" />
    <text x="${graph.left - 12}" y="${Number(y) + 4}" class="axis" text-anchor="end">${rating}</text>`;
}).join("\n    ");

const dateIndexes = [...new Set([0, Math.floor((contests.length - 1) / 2), contests.length - 1])];
const dateLabels = dateIndexes.map((index) => {
  const point = ratingPoints[index];
  return `<text x="${point.x.toFixed(1)}" y="460" class="axis" text-anchor="middle">${formatDate(point.timestamp)}</text>`;
}).join("\n    ");

const pointDots = ratingPoints.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.5" fill="${ratingColor(point.rating)}" stroke="#0d1117" stroke-width="2" />`).join("\n    ");
const latestPoint = ratingPoints.at(-1);
const peakIndex = ratings.indexOf(peakRating);
const peakPoint = ratingPoints[peakIndex] || latestPoint;
const peakLabel = peakIndex === ratingPoints.length - 1
  ? ""
  : `\n    <text x="${peakPoint.x.toFixed(1)}" y="${(peakPoint.y - 13).toFixed(1)}" class="value" text-anchor="middle">Peak ${peakRating}</text>`;

const verdictMeta = [
  ["OK", "Accepted", "#3fb950"],
  ["WRONG_ANSWER", "Wrong answer", "#f85149"],
  ["TIME_LIMIT_EXCEEDED", "Time limit", "#d29922"],
  ["RUNTIME_ERROR", "Runtime error", "#a371f7"],
];
const namedVerdicts = new Set(verdictMeta.map(([key]) => key));
const otherVerdicts = [...verdictCounts.entries()]
  .filter(([key]) => !namedVerdicts.has(key))
  .reduce((sum, [, count]) => sum + count, 0);
if (otherVerdicts > 0) verdictMeta.push(["OTHER", "Other", "#8b949e"]);

const verdictBars = verdictMeta.map(([key, label, color], index) => {
  const count = key === "OTHER" ? otherVerdicts : (verdictCounts.get(key) || 0);
  const y = 292 + index * 32;
  const barWidth = totalSubmissions === 0 ? 0 : (count * 138) / totalSubmissions;
  return `<g>
    <text x="676" y="${y}" class="small">${escapeXml(label)}</text>
    <rect x="772" y="${y - 9}" width="138" height="8" rx="4" fill="#21262d" />
    <rect x="772" y="${y - 9}" width="${barWidth.toFixed(1)}" height="8" rx="4" fill="${color}" />
    <text x="946" y="${y}" class="small" text-anchor="end">${count}</text>
  </g>`;
}).join("\n");

const languageSummary = languageCounts.slice(0, 3).map(([language, count]) => `${language} ${count}`).join("  /  ");
const maxTagCount = topTags[0]?.[1] || 1;
const tagBars = topTags.map(([tag, count], index) => {
  const column = index % 3;
  const row = Math.floor(index / 3);
  const x = 50 + column * 306;
  const y = 561 + row * 48;
  const barWidth = (count * 238) / maxTagCount;
  return `<g>
    <text x="${x}" y="${y}" class="small">${escapeXml(tag)}</text>
    <text x="${x + 250}" y="${y}" class="small" text-anchor="end">${count}</text>
    <rect x="${x}" y="${y + 10}" width="250" height="7" rx="3.5" fill="#21262d" />
    <rect x="${x}" y="${y + 10}" width="${barWidth.toFixed(1)}" height="7" rx="3.5" fill="#58a6ff" />
  </g>`;
}).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(handle)} live Codeforces dashboard</title>
  <desc id="description">Current rating ${latestRating}, peak rating ${peakRating}, ${solvedProblems.size} problems solved, and ${totalSubmissions} submissions.</desc>
  <defs>
    <linearGradient id="ratingArea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#58a6ff" stop-opacity="0.3" />
      <stop offset="1" stop-color="#58a6ff" stop-opacity="0.01" />
    </linearGradient>
    <style>
      text { font-family: Inter, "Segoe UI", Arial, sans-serif; }
      .title { fill: #f0f6fc; font-size: 22px; font-weight: 700; }
      .section { fill: #f0f6fc; font-size: 15px; font-weight: 650; }
      .label { fill: #8b949e; font-size: 9px; font-weight: 700; }
      .metric { fill: #f0f6fc; font-size: 22px; font-weight: 750; }
      .detail { fill: #8b949e; font-size: 10px; }
      .small { fill: #c9d1d9; font-size: 11px; }
      .axis { fill: #6e7681; font-size: 10px; }
      .value { fill: #f0f6fc; font-size: 11px; font-weight: 700; }
    </style>
  </defs>

  <rect width="${width}" height="${height}" rx="12" fill="#0d1117" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="11.5" fill="none" stroke="#30363d" />

  <text x="30" y="37" class="title">Codeforces Dashboard</text>
  <text x="30" y="59" class="detail">${escapeXml(handle)}  &#8226;  official Codeforces API</text>
  <circle cx="868" cy="37" r="5" fill="#3fb950">
    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
  </circle>
  <text x="881" y="41" class="label">AUTO-SYNC EVERY 6 HOURS</text>

  ${statCards}

  <rect x="30" y="174" width="610" height="306" rx="8" fill="#161b22" stroke="#30363d" />
  <text x="50" y="204" class="section">Rating progression</text>
  <text x="50" y="222" class="detail">${contests.length} rated contests</text>
  <g>
    ${ratingGrid}
    ${dateLabels}
    <path d="${areaPath}" fill="url(#ratingArea)" />
    <path d="${linePath}" pathLength="1" fill="none" stroke="#58a6ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1">
      <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.8s" fill="freeze" />
    </path>
    ${pointDots}${peakLabel}
    <text x="${latestPoint.x.toFixed(1)}" y="${(latestPoint.y - 14).toFixed(1)}" class="value" text-anchor="end">${latestRating}</text>
    <circle cx="${latestPoint.x.toFixed(1)}" cy="${latestPoint.y.toFixed(1)}" r="7" fill="none" stroke="${ratingColor(latestRating)}">
      <animate attributeName="r" values="7;14;7" dur="2.2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite" />
    </circle>
  </g>

  <rect x="656" y="174" width="314" height="306" rx="8" fill="#161b22" stroke="#30363d" />
  <text x="676" y="204" class="section">Submission health</text>
  <text x="676" y="248" fill="#f0f6fc" font-size="32" font-weight="750">${acceptanceRate.toFixed(1)}%</text>
  <text x="676" y="267" class="detail">${accepted} accepted from ${totalSubmissions} submissions</text>
  ${verdictBars}
  <text x="676" y="461" class="detail">Languages: ${escapeXml(languageSummary)}</text>

  <rect x="30" y="496" width="940" height="142" rx="8" fill="#161b22" stroke="#30363d" />
  <text x="50" y="526" class="section">Strongest solved-problem tags</text>
  <text x="950" y="526" class="detail" text-anchor="end">counted once per solved problem</text>
  ${tagBars}

  <text x="30" y="663" class="detail">Near-live data: the repository refreshes only when Codeforces statistics change.</text>
</svg>\n`;

await mkdir("assets", { recursive: true });
await writeFile("assets/codeforces-rating.svg", svg, "utf8");
console.log(JSON.stringify({
  rating: latestRating,
  peak: peakRating,
  contests: contests.length,
  submissions: totalSubmissions,
  accepted,
  solved: solvedProblems.size,
  attempted: attemptedProblems.size,
  acceptance: Number(acceptanceRate.toFixed(1)),
}));
