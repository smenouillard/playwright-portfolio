// /scripts/generate-index.js
// Generate Playwright dashboard using HTML template

const fs = require("fs");
const path = require("path");

// --- Setup paths ---
const REPORTS_DIR = path.join(process.cwd(), "reports");
const TEMPLATE_PATH = path.join(__dirname, "templates", "index.html");
const METADATA_RELATIVE = path.join("metadata", "metadata.json");
const JSON_REPORT_RELATIVE = path.join("jsonReports", "jsonReport.json");

// --- Load HTML template ---
let template = fs.readFileSync(TEMPLATE_PATH, "utf8");

// --- Load global CI metadata ---
let globalMeta = {};
try {
  globalMeta = JSON.parse(process.env.METADATA_JSON || "{}");
} catch {
  globalMeta = {};
}

// --- Define OS badges ---
const osBadges = {
  "ubuntu-latest": { emoji: "🐧", label: "Ubuntu" },
  "windows-latest": { emoji: "🪟", label: "Windows" },
  "macos-latest": { emoji: "🍎", label: "macOS" },
};

// --- Define browser badges ---
const browserBadges = {
  chromium: { emoji: "🌐", label: "Chromium" },
  firefox: { emoji: "🦊", label: "Firefox" },
  webkit: { emoji: "🍏", label: "WebKit" },
  edge: { emoji: "🟦", label: "Edge" },
};

// --- Format duration from seconds ---
function formatDurationSeconds(value) {
  const seconds = Math.round(value || 0);
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remain}s` : `${remain}s`;
}

// --- Build summary object from Playwright stats ---
function computeSummary(stats) {
  if (!stats) {
    return {
      totalTests: 0,
      totalFailures: 0,
      totalSkipped: 0,
      totalTimeSec: 0,
    };
  }

  const totalTests =
    (stats.expected || 0) +
    (stats.unexpected || 0) +
    (stats.skipped || 0);
  const totalFailures = stats.unexpected || 0;
  const totalSkipped = stats.skipped || 0;
  const totalTimeSec = (stats.duration || 0) / 1000;

  return {
    totalTests,
    totalFailures,
    totalSkipped,
    totalTimeSec,
  };
}

// --- Determine status pill ---
function statusInfo(summary) {
  if (summary.totalFailures > 0) {
    return { text: "FAIL", emoji: "🔴", css: "pill-fail", code: "fail" };
  }
  if (summary.totalSkipped > 0) {
    return { text: "SKIPPED", emoji: "🟡", css: "pill-skip", code: "skip" };
  }
  if (summary.totalTests > 0) {
    return { text: "PASS", emoji: "🟢", css: "pill-pass", code: "pass" };
  }
  return { text: "NO TESTS", emoji: "⚪", css: "pill-none", code: "none" };
}

// --- Load one report entry ---
function loadRunEntry(dirName) {
  const folderPath = path.join(REPORTS_DIR, dirName);
  const metadataFile = path.join(folderPath, METADATA_RELATIVE);

  if (!fs.existsSync(metadataFile)) return null;

  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));
  } catch {
    return null;
  }

  const jsonReportFile = path.join(folderPath, JSON_REPORT_RELATIVE);
  let stats = null;

  if (fs.existsSync(jsonReportFile)) {
    try {
      const jsonReport = JSON.parse(
        fs.readFileSync(jsonReportFile, "utf8")
      );
      stats = jsonReport.stats || null;
    } catch {
      stats = null;
    }
  }

  const summary = computeSummary(stats);

  const osMeta =
    osBadges[metadata.os] || {
      emoji: "❓",
      label: metadata.os || "Unknown OS",
    };

  const browserMeta =
    browserBadges[metadata.browser] || {
      emoji: "❓",
      label: metadata.browser || "Unknown",
    };

  const status = statusInfo(summary);

  return {
    name: dirName,
    metadata,
    summary,
    os: osMeta,
    browser: browserMeta,
    status,
  };
}

// --- Load all report entries ---
function loadEntries() {
  if (!fs.existsSync(REPORTS_DIR)) return [];

  const dirents = fs
    .readdirSync(REPORTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  const entries = dirents
    .filter((d) => d.name.startsWith("report-"))
    .map((d) => loadRunEntry(d.name))
    .filter(Boolean);

  return entries;
}

// --- Define OS order for display ---
const OS_ORDER = ["windows-latest", "macos-latest", "ubuntu-latest"];

// --- Sort entries by OS and then by browser ---
function sortEntries(entries) {
  return entries.slice().sort((a, b) => {
    const aIndex = OS_ORDER.indexOf(a.metadata.os);
    const bIndex = OS_ORDER.indexOf(b.metadata.os);

    const aRank = aIndex === -1 ? OS_ORDER.length : aIndex;
    const bRank = bIndex === -1 ? OS_ORDER.length : bIndex;

    if (aRank !== bRank) return aRank - bRank;

    return (a.metadata.browser || "").localeCompare(
      b.metadata.browser || ""
    );
  });
}

// --- Build summary table HTML ---
function buildSummaryTable(entries) {
  if (entries.length === 0) {
    return "<p>No reports available.</p>";
  }

  let html = `
<table class="summary">
  <thead>
    <tr>
      <th>Status</th>
      <th>OS</th>
      <th>Browser</th>
      <th>Total</th>
      <th>Failed</th>
      <th>Skipped</th>
      <th>Duration</th>
    </tr>
  </thead>
  <tbody>
`;

  entries.forEach((e) => {
    html += `
    <tr class="summary-row" data-status="${e.status.code}">
      <td class="status-cell">
        <span class="status-pill ${e.status.css}">
          ${e.status.emoji} ${e.status.text}
        </span>
      </td>
      <td>${e.os.emoji} ${e.os.label}</td>
      <td>${e.browser.emoji} ${e.browser.label}</td>
      <td class="num-cell">${e.summary.totalTests}</td>
      <td class="num-cell">${e.summary.totalFailures}</td>
      <td class="num-cell">${e.summary.totalSkipped}</td>
      <td>${formatDurationSeconds(e.summary.totalTimeSec)}</td>
    </tr>
`;
  });

  html += `
  </tbody>
</table>
`;

  return html;
}

// --- Build detailed report blocks HTML ---
function buildReportBlocks(entries) {
  if (entries.length === 0) {
    return "<p>No reports available.</p>";
  }

  let blocks = "";

  entries.forEach((e) => {
    blocks += `
<div class="report-block" data-status="${e.status.code}">
  <div class="report-header">
    <div class="report-header-main">
      <div class="report-title">
        <span class="status-pill ${e.status.css}">
          ${e.status.emoji} ${e.status.text}
        </span>
        <span class="os-label">${e.os.emoji} ${e.os.label}</span>
        <span class="browser-label">${e.browser.emoji} ${e.browser.label}</span>
      </div>
      <div class="report-header-meta">
        <div class="meta-row">
          <span class="meta-label">Tests:</span>
          <span class="meta-value">${e.summary.totalTests}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Failed:</span>
          <span class="meta-value">${e.summary.totalFailures}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Skipped:</span>
          <span class="meta-value">${e.summary.totalSkipped}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Duration:</span>
          <span class="meta-value">${formatDurationSeconds(
      e.summary.totalTimeSec
    )}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Timestamp:</span>
          <span class="meta-value">${e.metadata.timestamp || ""}</span>
        </div>
      </div>
      <div class="links">
        <a href="./${e.name}/playwright-report/index.html" target="_blank">
          Open HTML report
        </a>
        <a href="./${e.name}/playwright-report.zip" download>
          Download ZIP
        </a>
      </div>
    </div>
  </div>
</div>
`;
  });

  return blocks;
}

// --- Generate dashboard HTML ---
const entries = sortEntries(loadEntries());
const summaryTable = buildSummaryTable(entries);
const reportBlocks = buildReportBlocks(entries);

template = template
  .replace("{{PUBLISH_TIMESTAMP}}", globalMeta.publishTimestamp || "N/A")
  .replace("{{COMMIT_SHA}}", globalMeta.commitSha || "N/A")
  .replace("{{RUN_NUMBER}}", globalMeta.runNumber || "N/A")
  .replace("{{RUN_URL}}", globalMeta.runUrl || "#")
  .replace("{{SUMMARY_TABLE}}", summaryTable)
  .replace("{{REPORT_LIST}}", reportBlocks);

// --- Write final index.html ---
fs.writeFileSync(path.join(REPORTS_DIR, "index.html"), template, "utf8");

console.log("Dashboard generated successfully.");
