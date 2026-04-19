/**
 * Walks wiki/, sources/, log/, raw/, data/ for .md/.csv/.txt and prints JSON { files: [{ path, content }] }.
 * Used by GitHub Actions to POST to Vercel /api/ingest.
 */
const fs = require("fs");
const path = require("path");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git") continue;
    const p = path.join(dir, name);
    let st;
    try {
      st = fs.statSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(md|csv|txt)$/i.test(p)) {
      acc.push({
        path: p.split(path.sep).join("/"),
        content: fs.readFileSync(p, "utf8"),
      });
    }
  }
  return acc;
}

const files = [
  ...walk("wiki"),
  ...walk("sources"),
  ...walk("log"),
  ...walk("raw"),
  ...walk("data"),
];

process.stdout.write(JSON.stringify({ files }));
