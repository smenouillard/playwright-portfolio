// scripts/generate-index.js
// Generate Playwright dashboard

import fs from "fs";
import path from "path";

// --- Setup ---
const REPORTS_DIR = "./reports";
const METADATA_FILE = "metadata.json";

// --- Read metadata injected by CI ---
const ciMetadata = JSON.parse(process.env.METADATA_JSON || "{}");

// --- Helper: Read metadata.json inside each artifact folder ---
function loadRunMetadata(runPath) {
  const metadataPath = path.join(runPath, METADATA_FILE);
  if (!fs.existsSync(metadataPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  } catch (err) {
    console.error(`Failed to read metadata at: ${metadataPath}`);
    return null;
  }
}

// --- Load all runs inside /reports ---
function loadArtifacts() {
  const artifacts = fs.readdirSync(REPORTS_DIR)
    .filter(name => name.startsWith("report-"))
    .map(name => ({
      name,
      fullPath: path.join(REPORTS_DIR, name),
      metadata: loadRunMetadata(path.join(REPORTS_DIR, name))
    }))
    .filter(entry => entry.metadata);

  return artifacts;
}

// --- Sort order for OS display ---
const OS_ORDER = ["Windows", "macOS", "Ubuntu"];

// --- Sort runs by OS priority ---
function sortArtifacts(artifacts) {
  return artifacts.sort((a, b) => {
    const aOS = a.metadata.os || "";
    const bOS = b.metadata.os || "";

    const aIndex = OS_ORDER.findIndex(os => aOS.includes(os));
    const bIndex = OS_ORDER.findIndex(os => bOS.includes(os));

    return aIndex - bIndex;
  });
}

// --- Render HTML table entry ---
function renderRow(item) {
  return `
    <tr>
      <td>${item.metadata.os}</td>
      <td>${item.metadata.browser}</td>
      <td>${item.metadata.timestamp}</td>
      <td><a href="./${item.name}/playwright-report/index.html" target="_blank">Open Report</a></td>
      <td><a href="./${item.name}/playwright-report.zip" download>Download ZIP</a></td>
    </tr>
  `;
}

// --- Generate full HTML dashboard ---
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
      <th>HTML Report</th>
      <th>ZIP</th>
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

// --- Execute generator ---
const artifacts = loadArtifacts();
const sortedRuns = sortArtifacts(artifacts);
const html = generateHTML(sortedRuns);

fs.writeFileSync(path.join(REPORTS_DIR, "index.html"), html, "utf8");

console.log("Dashboard generated: reports/index.html");
