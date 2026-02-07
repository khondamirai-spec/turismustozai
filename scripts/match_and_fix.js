
const fs = require('fs');

const r2Files = JSON.parse(fs.readFileSync('r2_files.json', 'utf8'));

// Sample of data to verify logic, then I will run it on full data
function normalize(str) {
    if (!str) return "";
    // Keep Uzbek letters but lower case and remove special chars
    return str.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/o'|o’/g, 'o')
        .replace(/g'|g’/g, 'g');
}

const publicUrlPrefix = "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/";

async function matchAll() {
    const dbOptions = JSON.parse(fs.readFileSync('db_options.json', 'utf8'));
    let sqlUpdates = "";
    let matchCount = 0;

    dbOptions.forEach(option => {
        const modKey = normalize(option.module);
        const optKey = normalize(option.option_text);

        // Find match
        let bestMatch = null;

        // Filter r2 files by module first if possible
        const moduleFiles = r2Files.filter(f => normalize(f).includes(modKey));

        // Exact match check
        bestMatch = moduleFiles.find(f => normalize(f).includes(optKey));

        // Fuzzy match if no match?
        if (!bestMatch) {
            // Try matching without module restriction if module name is slightly different
            bestMatch = r2Files.find(f => normalize(f).includes(modKey) && normalize(f).includes(optKey));
        }

        if (bestMatch) {
            const encodedMatch = bestMatch.split('/').map(part => encodeURIComponent(part)).join('/');
            const newUrl = publicUrlPrefix + encodedMatch;

            // Only update if it's different and not a placeholder
            if (newUrl !== option.image_url) {
                sqlUpdates += `UPDATE quiz_options SET image_url = '${newUrl}' WHERE id = '${option.id}';\n`;
                matchCount++;
            }
        }
    });

    fs.writeFileSync('scripts/fix_urls.sql', sqlUpdates);
    console.log(`Matched ${matchCount} options. SQL saved to scripts/fix_urls.sql`);
}

matchAll();
