
const fs = require('fs');
const data = JSON.parse(process.argv[2]);
let existing = [];
if (fs.existsSync('db_options.json')) {
    existing = JSON.parse(fs.readFileSync('db_options.json', 'utf8'));
}
existing = existing.concat(data);
fs.writeFileSync('db_options.json', JSON.stringify(existing, null, 2));
console.log(`Added ${data.length} items. Total: ${existing.length}`);
