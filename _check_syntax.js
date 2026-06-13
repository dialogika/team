const fs = require('fs');
const h = fs.readFileSync('data/permit-reimburse-management.html', 'utf8');
const marker = '<script type="module">';
const i = h.indexOf(marker);
if (i < 0) { console.log('NOT FOUND'); process.exit(1); }
const start = i + marker.length;
const end = h.indexOf('</script>', start);
const js = h.substring(start, end);
// Remove all import statements (single and multi-line)
const clean = js
  .replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']*["']\s*;?/g, '')
  .replace(/import\s+\w+\s+from\s*["'][^"']*["']\s*;?/g, '')
  .replace(/import\s*{[^}]*}\s*from\s*["'][^"']*["']\s*;?/gs, '');
try {
  new Function(clean);
  console.log('VALID');
} catch(e) {
  console.log('ERR:', e.message);
}
