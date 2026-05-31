#!/usr/bin/env node
/**
 * sync-inventory.js
 * Reads the "Formatted" tab from the MAS Google Sheet, maps rows to the
 * inventory CSV schema, translates French captions via Claude API, and
 * appends new entries to public/data/inventory.csv.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node scripts/sync-inventory.js
 *
 * Requirements:
 *   - Google Sheet must be "Anyone with the link can view"
 *   - "Formatted" tab must exist (created by mas-form-trigger.gs)
 */

import Anthropic from "@anthropic-ai/sdk";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const CSV_PATH  = path.join(ROOT, "public", "data", "inventory.csv");
const QR_DIR    = path.join(ROOT, "public", "qr");
const SITE_BASE = "https://mysterwolf.github.io/mobile-art-services/";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SHEET_ID  = "1Z_IwDv162OO4hQCvn37b7pmFbwvCqt8GSPVVlm0jStY";
const SHEET_TAB = "Formatted";  // name of the tab written by mas-form-trigger.gs

// Inventory CSV column order
const SCHEMA = [
  "id", "filename", "title", "artist", "medium", "dimensions",
  "price", "status", "category", "caption", "condition", "source", "notes", "qr_url"
];

// ── CSV HELPERS ───────────────────────────────────────────────────────────────
function splitCSVRow(row) {
  const out = [];
  let cur = "", inQ = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"' && !inQ)                         { inQ = true; continue; }
    if (c === '"' && inQ && row[i+1] === '"')       { cur += '"'; i++; continue; }
    if (c === '"' && inQ)                          { inQ = false; continue; }
    if (c === ',' && !inQ)                         { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  const lines = text.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = splitCSVRow(lines[0]).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const vals = splitCSVRow(line);
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? "").trim()]));
  });
  return { headers, rows };
}

function toCSVRow(obj) {
  return SCHEMA.map(col => {
    const v = String(obj[col] ?? "").replace(/"/g, '""');
    return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v}"` : v;
  }).join(",");
}

// ── TRANSLATION ───────────────────────────────────────────────────────────────
async function translateIfFrench(client, text) {
  if (!text || !text.trim()) return text;
  const res = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{
      role: "user",
      content: `Detect the language of the text below. If it is French or mixed French/English, translate it fully to English. If it is already English, return it unchanged. Reply with ONLY the final English text.\n\nText: ${text}`
    }]
  });
  return res.content[0].text.trim();
}

// ── COLUMN MAPPING ────────────────────────────────────────────────────────────
// Actual sheet column names → inventory schema.
// These match the Google Form question titles as exported by Google Sheets.
function mapRow(r, index, existingCount) {
  const id = String(existingCount + index + 1).padStart(3, "0");
  return {
    id,
    filename:   "",
    title:      r["Title/Piece name"]  || r["title"]          || "",
    artist:     r["Artist Name"]       || r["artist"]         || "",
    medium:     r["Medium"]            || r["medium"]         || "",
    dimensions: r["Dimensions"]        || r["dimensions"]     || "",
    price:      r["Estimated Value"]   || r["estimated_value"]|| "0",
    status:     "staged",
    category:   "painting",
    caption:    r["Description"]       || r["description"]    || "",
    condition:  r["Condition"]         || r["condition"]      || "",
    source:     [r["Source"] || r["source"], r["Source Details"] || r["source_details"]].filter(Boolean).join(" — "),
    notes:      "",
  };
}

function getTitle(r) {
  return (r["Title/Piece name"] || r["title"] || "").toLowerCase().trim();
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const client = apiKey ? new Anthropic({ apiKey }) : null;
  if (!client) console.warn("Warning: ANTHROPIC_API_KEY not set — French text will not be translated. Entries with descriptions will be flagged for manual review.");

  // 1. Fetch the Formatted tab as CSV
  const tabParam = encodeURIComponent(SHEET_TAB);
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabParam}`;
  console.log(`Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Fetch failed (${res.status}). Check:\n  1. SHEET_ID is the full 44-char ID from the spreadsheet URL\n  2. Sheet sharing is set to "Anyone with the link can view"\n  3. The "Formatted" tab exists (created by mas-form-trigger.gs)`);
    process.exit(1);
  }
  const { rows: sheetRows } = parseCSV(await res.text());
  console.log(`${sheetRows.length} row(s) in Formatted tab.`);

  if (sheetRows.length === 0) {
    console.log("Nothing to sync.");
    return;
  }

  // 2. Load existing inventory + repair CSV header if schema has changed
  let existing = [];
  if (fs.existsSync(CSV_PATH)) {
    const raw = fs.readFileSync(CSV_PATH, "utf8");
    const existingHeader = raw.split("\n")[0].trim();
    if (existingHeader !== SCHEMA.join(",")) {
      const { rows: allRows } = parseCSV(raw);
      fs.writeFileSync(CSV_PATH, [SCHEMA.join(","), ...allRows.map(r => toCSVRow(r))].join("\n") + "\n");
      console.log("Repaired CSV header to match current schema.");
    }
    existing = parseCSV(fs.readFileSync(CSV_PATH, "utf8")).rows;
  }
  const existingTitles = new Set(
    existing.map(r => (r.title || "").toLowerCase().trim()).filter(Boolean)
  );

  // 3. Filter to new entries only (dedupe by title)
  const newSheetRows = sheetRows.filter(r => {
    const t = getTitle(r);
    return t && !existingTitles.has(t);
  });

  if (newSheetRows.length === 0) {
    console.log("No new entries — inventory is up to date.");
    return;
  }

  // 4. Map to inventory schema
  const newRows = newSheetRows.map((r, i) => mapRow(r, i, existing.length));

  // 5. Translate French captions (skipped if no API key)
  if (client) {
    console.log(`Translating ${newRows.length} caption(s)...`);
    for (const row of newRows) {
      if (row.caption) {
        const translated = await translateIfFrench(client, row.caption);
        if (translated !== row.caption) {
          console.log(`  [${row.id}] Caption translated.`);
          row.caption = translated;
        }
      }
    }
  } else {
    newRows.forEach(row => {
      if (row.caption) console.warn(`  [${row.id}] "${row.title || "untitled"}" — description written as-is, may contain French. Review manually.`);
    });
  }

  // 6. Generate QR codes
  fs.mkdirSync(QR_DIR, { recursive: true });
  console.log("Generating QR codes...");
  for (const row of newRows) {
    const qrUrl = `${SITE_BASE}?piece=${row.id}`;
    const qrPath = path.join(QR_DIR, `piece-${row.id}.png`);
    await QRCode.toFile(qrPath, qrUrl, { width: 400, margin: 2 });
    row.qr_url = qrUrl;
    console.log(`  [${row.id}] QR → public/qr/piece-${row.id}.png`);
  }

  // 7. Append new rows
  const needsHeader = !fs.existsSync(CSV_PATH);
  const lines = [];
  if (needsHeader) lines.push(SCHEMA.join(","));
  newRows.forEach(row => lines.push(toCSVRow(row)));

  const existing2 = needsHeader ? "" : fs.readFileSync(CSV_PATH, "utf8");
  const separator = existing2.endsWith("\n") ? "" : "\n";
  fs.appendFileSync(CSV_PATH, (needsHeader ? "" : separator) + lines.join("\n") + "\n");

  console.log(`\nAdded ${newRows.length} row(s) to public/data/inventory.csv:`);
  newRows.forEach(r => console.log(`  [${r.id}] "${r.title || "(untitled)"}" — ${r.artist || "unknown"}`));
}

main().catch(err => { console.error(err.message); process.exit(1); });
