// scripts/generate-index.js
// Generate Playwright dashboard

const fs = require("fs");
const path = require("path");

// --- Setup paths ---
const REPORTS_DIR = "./reports";
const METADATA_PATH = "metadata/metadata.json";

// --- Load CI metadata ---
let ciMetadata = {};
try {
  ciMetadata = JSON.parse(process.env.METADATA_JSON || "{}");
} catch {
  ciMetadata = {};
}

// --- Load metadata for one report ---
function loadRunMetadata(folderPath) {
  const metadataFile = path.join(folderPath, METADATA_PATH);
  if (!fs.existsSync(metadataFile)) return null;

  try {
    return JSON.parse(fs.readFileSync(metadataFile, "utf8"));
  } catch {
    return null;
  }
}

// --- Load all report folders ---
function loadArtifacts() {
  const entries = fs.readdirSync(REPORTS_DIR);

  return entries
    .filter(name => name.startsWith("report-"))
    .map(name => {
      const fullPath = path.join(REPORTS_DIR, name);
      const metadata = loadRunMetadata(fullPath);
      return metadata ? { name, metadata } : null;
    })
    .filter(Boolean);
}

// --- Define OS display order ---
const OS_ORDER = ["Windows", "macOS", "Ubuntu"];

// --- Sort artifacts by OS ---
function sortArtifacts(artifacts) {
  return artifacts.sort((a, b) => {
    const aIndex = OS_ORDER.findIndex(os => a.metadata.os.includes(os));
    const bIndex = OS_ORDER.findIndex(os => b.metadata.os.includes(os));
    return aIndex - bIndex;
  });
}

// --- Render one table row ---
function renderRow(item) {
  return `
    <tr>
      <td>${item.metadata.os}</td>
      <td>${item.metadata.browser}</td>
      <td>${item.metadata.timestamp}</td>
      <td><a href="./${item.name}/playwright-report.zip" target="_blank">Open Report</a></td>
      <td><a href="./${item.name}/playwright-report.zip" download>Download ZIP</a></td>
    </tr>
  `;
}

// --- Build dashboard HTML ---
function generateHTML(sortedRuns) {
  const rows = sortedRuns.map(renderRow).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Playwright Test Reports</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { padding: 10px; border: 1px solid #ccc; }
    th { background: #f1f1f1; }
  </style>
</head>
<body>

<h1>Playwright Test Reports</h1>
<p>Generated: ${ciMetadata.publishTimestamp || "N/A"}</p>
<p>
  Run: #${ciMetadata.runNumber || "?"} —
  <a href="${ciMetadata.runUrl}" target="_blank">GitHub Actions Run</a>
</p>

<table>
  <thead>
    <tr>
      <th>OS</th>
      <th>Browser</th>
      <th>Timestamp</th>
      <th>HTML Report (ZIP)</th>
      <th>Download</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

</body>
</html>
  `;
}

// --- Generate dashboard ---
const artifacts = loadArtifacts();
const sortedRuns = sortArtifacts(artifacts);
const html = generateHTML(sortedRuns);

// --- Write output file ---
fs.writeFileSync(path.join(REPORTS_DIR, "index.html"), html, "utf8");
console.log("Dashboard generated: reports/index.html");
