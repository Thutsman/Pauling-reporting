/**
 * One-off script to read Excel files and output structure for SQL mapping.
 * Run: node scripts/read-excel.js
 */
import XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const files = [
  'The Bowery Income statement  Confidential.xlsx',
  'January and December Report AUDITED.xlsx',
];

function toJson(val) {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') return val.trim() || null;
  return val;
}

function inspectSheet(workbook, name) {
  const ws = workbook.Sheets[name];
  if (!ws) return null;
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
  return { name, rows: data.length, data: data.slice(0, 25) };
}

for (const file of files) {
  const path = join(root, file);
  console.log('\n' + '='.repeat(80));
  console.log('FILE:', file);
  console.log('='.repeat(80));
  try {
    const buf = readFileSync(path);
    const wb = XLSX.read(buf, { type: 'buffer' });
    console.log('Sheet names:', wb.SheetNames);
    for (const sheetName of wb.SheetNames) {
      const info = inspectSheet(wb, sheetName);
      if (info) {
        console.log('\n--- Sheet:', sheetName, '---');
        console.log('Row count (first 25 rows shown):', info.rows);
        console.log(JSON.stringify(info.data, null, 2));
      }
    }
  } catch (e) {
    console.error('Error reading', file, e.message);
  }
}
