import fs from 'node:fs';
import { PDFParse } from 'pdf-parse';

const categories = ['無線電規章與相關法規','無線電通訊方法','無線電系統原理','無線電相關安全防護','電磁相容性技術','射頻干擾的預防與排除'];
const pdf = new PDFParse({ data: fs.readFileSync('3.pdf') });
const text = (await pdf.getText()).text.replace(/\r/g, '');
await pdf.destroy();
const esc = value => `'${String(value).replaceAll("'", "''")}'`;
const sql = ['DELETE FROM questions WHERE level=3;'];
let total = 0;
const questionStart = text.indexOf('無線電規章與相關法規題庫\n', text.indexOf('測試題庫'));
for (const category of categories) {
  const start = text.indexOf(category + '題庫\n', questionStart);
  const next = categories.map(c => text.indexOf(c + '題庫\n', start + category.length)).filter(i => i > start).sort((a,b) => a-b)[0] ?? text.length;
  const section = text.slice(start, next);
  const matches = [...section.matchAll(/(?:^|\n)\s*[（(]\s*([1-4])\s*[）)]\s*(\d+)\.\s*/g)];
  for (let i=0; i<matches.length; i++) {
    const m=matches[i], block=section.slice(m.index + m[0].length, matches[i+1]?.index ?? section.length).trim();
    const options=[];
    for (const om of block.matchAll(/(?:^|\n)\s*[（(]\s*([1-4])\s*[）)]\s*([^\n]*)/g)) options[Number(om[1])-1]=om[2].trim();
    const prompt=block.split(/\n\s*[（(]\s*[1-4]\s*[）)]/)[0].replace(/\n/g, ' ').trim();
    if (options.slice(0, 4).every(Boolean)) {
      const id=`l3-${category}-${m[2]}`;
      sql.push(`INSERT OR IGNORE INTO questions(id,level,category,number,prompt,options_json,answer,source) VALUES(${esc(id)},3,${esc(category)},${m[2]},${esc(prompt)},${esc(JSON.stringify(options.slice(0, 4)))},${esc(m[1])},${esc('3.pdf:' + category)});`);
      total++;
    }
  }
}
fs.writeFileSync('tmp-level3.sql', sql.join('\n'));
console.log(`Prepared ${total} questions`);
