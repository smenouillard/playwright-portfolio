// /scripts/generate-index.js
// Generates the Playwright dashboard from collected reports

const fs = require("fs");
const path = require("path");

// Format UTC timestamps as YYYY-MM-DD HH:MM UTC
function formatUtcTimestamp(raw) {
  if (!raw) return "N/A";
  const date = new Date(raw);
  if (isNaN(date.getTime())) return raw + " UTC";
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min} UTC`;
}

// Setup dashboard paths
const REPORTS_DIR = path.join(process.cwd(), "reports");
const TEMPLATE_PATH = path.join(__dirname, "templates", "index.html");
let template = fs.readFileSync(TEMPLATE_PATH, "utf8");

// Load global metadata injected by the workflow
let globalMeta = {};
try {
  globalMeta = JSON.parse(process.env.METADATA_JSON || "{}");
} catch {
  globalMeta = {};
}

// OS metadata used for badges
const osBadges = {
  "ubuntu-latest": { emoji: "🐧", label: "Ubuntu" },
  "windows-latest": { emoji: "🪟", label: "Windows" },
  "macos-latest": { emoji: "🍎", label: "macOS" },
};

// Browser metadata used for badges
const browserBadges = {
  chromium: { emoji: "🌐", label: "Chromium" },
  firefox: { emoji: "🦊", label: "Firefox" },
  webkit: { emoji: "🍏", label: "WebKit" },
  edge: { emoji: "🟦", label: "Edge" },
};

// Parse Playwright JSON summary
function parseJsonStats(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const stats = json.stats || {};
    const totalTests =
      (stats.expected || 0) +
      (stats.unexpected || 0) +
      (stats.skipped || 0);
    return {
      totalTests,
      totalFailures: stats.unexpected || 0,
      totalSkipped: stats.skipped || 0,
      totalTimeSec: (stats.duration || 0) / 1000,
    };
  } catch {
    return null;
  }
}

// Parse JUnit XML summary
function parseJUnitSummary(xml) {
  if (!xml) return null;
  const suiteRegex = /<testsuite\b([^>]*)>/g;
  let totalTests = 0;
  let totalFailures = 0;
  let totalSkipped = 0;
  let totalTime = 0;
  let match;
  while ((match = suiteRegex.exec(xml)) !== null) {
    const attrs = match[1];
    const get = (name) => {
      const re = new RegExp(name + '="([^"]+)"');
      const m = re.exec(attrs);
      return m ? m[1] : null;
    };
    totalTests += parseInt(get("tests") || "0", 10);
    totalFailures += parseInt(get("failures") || "0", 10);
    totalSkipped += parseInt(get("skipped") || "0", 10);
    totalTime += parseFloat(get("time") || "0");
  }
  return {
    totalTests,
    totalFailures,
    totalSkipped,
    totalTimeSec: totalTime,
  };
}

// Build status pill metadata
function statusInfo(summary) {
  if (!summary)
    return { text: "NO TESTS", emoji: "⚪", css: "pill-none", code: "none" };
  if (summary.totalFailures > 0)
    return { text: "FAIL", emoji: "🔴", css: "pill-fail", code: "fail" };
  if (summary.totalSkipped > 0)
    return { text: "SKIPPED", emoji: "🟡", css: "pill-skip", code: "skip" };
  if (summary.totalTests > 0)
    return { text: "PASS", emoji: "🟢", css: "pill-pass", code: "pass" };
  return { text: "NO TESTS", emoji: "⚪", css: "pill-none", code: "none" };
}

// Load metadata and stats for a single report folder
function loadRunEntry(dirName) {
  const folder = path.join(REPORTS_DIR, dirName);
  const metadataPath = path.join(folder, "metadata", "metadata.json");
  if (!fs.existsSync(metadataPath)) return null;

  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  } catch {
    return null;
  }

  const jsonStats = parseJsonStats(
    path.join(folder, "jsonReports", "jsonReport.json")
  );

  let junitStats = null;
  const junitPath = path.join(folder, "junit", "test-results.xml");
  if (fs.existsSync(junitPath)) {
    try {
      const xml = fs.readFileSync(junitPath, "utf8");
      junitStats = parseJUnitSummary(xml);
    } catch { }
  }

  const finalStats = jsonStats || junitStats || {
    totalTests: 0,
    totalFailures: 0,
    totalSkipped: 0,
    totalTimeSec: 0,
  };

  const status = statusInfo(finalStats);
  const osMeta = osBadges[metadata.os] || {
    emoji: "❓",
    label: metadata.os || "Unknown OS",
  };
  const browserMeta = browserBadges[metadata.browser] || {
    emoji: "❓",
    label: metadata.browser || "Unknown",
  };

  return {
    name: dirName,
    metadata,
    stats: finalStats,
    status,
    os: osMeta,
    browser: browserMeta,
  };
}

// Load all report entries
function loadEntries() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs
    .readdirSync(REPORTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("report-"))
    .map((d) => loadRunEntry(d.name))
    .filter(Boolean);
}

// Sort entries consistently by OS, browser, and status
const OS_ORDER = ["windows-latest", "macos-latest", "ubuntu-latest"];
function sortEntries(entries) {
  return entries.sort((a, b) => {
    const aOs = OS_ORDER.indexOf(a.metadata.os);
    const bOs = OS_ORDER.indexOf(b.metadata.os);
    if (aOs !== bOs) return aOs - bOs;
    if (a.metadata.browser !== b.metadata.browser) {
      return (a.metadata.browser || "").localeCompare(b.metadata.browser || "");
    }
    const order = { fail: 0, skip: 1, pass: 2, none: 3 };
    return order[a.status.code] - order[b.status.code];
  });
}

// Build the summary table displayed at the top
function buildSummaryTable(entries) {
  if (entries.length === 0) return "<p>No reports available.</p>";

  let html = `
<table class="summary">
  <thead>
    <tr>
      <th>Status</th>
      <th>OS</th>
      <th>Browser</th>
      <th>Total</th>
      <th>Failures</th>
      <th>Skipped</th>
      <th>Duration</th>
    </tr>
  </thead>
  <tbody>
`;

  for (const e of entries) {
    html += `
<tr class="summary-row" data-status="${e.status.code}">
  <td class="status-cell">
    <span class="status-pill ${e.status.css}">
      ${e.status.emoji} ${e.status.text}
    </span>
  </td>

  <!-- OS cell -->
  <td class="os-cell">${e.os.emoji} ${e.os.label}</td>

  <!-- Browser cell -->
  <td class="browser-cell">${e.browser.emoji} ${e.browser.label}</td>

  <td class="num-cell">${e.stats.totalTests}</td>
  <td class="num-cell">${e.stats.totalFailures}</td>
  <td class="num-cell">${e.stats.totalSkipped}</td>
  <td class="time-cell">${Math.round(e.stats.totalTimeSec)}s</td>
</tr>`;
  }

  html += `
  </tbody>
</table>
`;
  return html;
}

// Build collapsible report detail blocks
function buildReportBlocks(entries) {
  let blocks = "";
  for (const e of entries) {
    const timestamp = formatUtcTimestamp(e.metadata.timestamp);
    blocks += `
<div class="report-block" data-status="${e.status.code}">
  <div class="report-header">
    <div class="report-header-main">
      <span class="status-pill ${e.status.css}">
        ${e.status.emoji} ${e.status.text}
      </span>
      <span class="badge os-badge">${e.os.emoji} ${e.os.label}</span>
      <span class="badge browser-badge">${e.browser.emoji} ${e.browser.label}</span>
    </div>
    <span class="caret">▼</span>
  </div>

  <div class="report-content">

    <div class="report-meta-grid">
      <div class="meta-row"><span class="meta-label">Tests:</span><span class="meta-value">${e.stats.totalTests}</span></div>
      <div class="meta-row"><span class="meta-label">Failed:</span><span class="meta-value">${e.stats.totalFailures}</span></div>
      <div class="meta-row"><span class="meta-label">Skipped:</span><span class="meta-value">${e.stats.totalSkipped}</span></div>
      <div class="meta-row"><span class="meta-label">Duration:</span><span class="meta-value">${Math.round(e.stats.totalTimeSec)}s</span></div>
      <div class="meta-row"><span class="meta-label">Timestamp:</span><span class="meta-value">${timestamp}</span></div>
      <div class="meta-row"><span class="meta-label">Runner:</span><span class="meta-value">${e.metadata.os}</span></div>
    </div>

    <div class="quick-summary">
      📊 <strong>${e.stats.totalTests}</strong> tests •
      ⚠ <strong>${e.stats.totalFailures}</strong> failed •
      ➖ <strong>${e.stats.totalSkipped}</strong> skipped •
      ⏱ <strong>${Math.round(e.stats.totalTimeSec)}s</strong>
    </div>

    <div class="links">
      <a class="link-pill" href="./${e.name}/playwright-report/index.html" target="_blank">📄 HTML</a>
      <a class="link-pill" href="./${e.name}/jsonReports/jsonReport.json" target="_blank">🧩 JSON</a>
      <a class="link-pill" href="./${e.name}/junit/test-results.xml" target="_blank">📑 XML</a>
      <a class="link-pill" href="./${e.name}/playwright-report.zip" download>📦 ZIP</a>
      <a class="link-pill" href="${globalMeta.runUrl}" target="_blank">📘 Logs</a>
    </div>

  </div>
</div>
`;
  }
  return blocks;
}

// Build dashboard sections
const entries = sortEntries(loadEntries());
const summaryTable = buildSummaryTable(entries);
const reportBlocks = buildReportBlocks(entries);

// Apply template replacements
template = template
  .replace("{{PUBLISH_TIMESTAMP}}", formatUtcTimestamp(globalMeta.publishTimestamp))
  .replace("{{COMMIT_SHA}}", globalMeta.commitSha || "N/A")
  .replace("{{RUN_NUMBER}}", globalMeta.runNumber || "N/A")
  .replace("{{RUN_URL}}", globalMeta.runUrl || "#")
  .replace("{{SUMMARY_TABLE}}", summaryTable)
  .replace("{{REPORT_LIST}}", reportBlocks);

// Write output dashboard
fs.writeFileSync(path.join(REPORTS_DIR, "index.html"), template, "utf8");

console.log("Super Dashboard generated successfully.");
