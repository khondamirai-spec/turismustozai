
const fs = require('fs');

// Load R2 keys
const r2Files = JSON.parse(fs.readFileSync('r2_files.json', 'utf8'));

// Load CSV content
const csvContent = fs.readFileSync('tourism - Лист1 (2).csv', 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim() !== "");
const headers = lines[0].split(',');

// Normalize function (same as used in previous scripts to ensure consistency)
function normalize(str) {
    if (!str) return "";
    return str.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/o'|o’/g, 'o')
        .replace(/g'|g’/g, 'g');
}

const publicUrlPrefix = "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/";

const results = [];

// Skip header
for (let i = 1; i < lines.length; i++) {
    // Simple CSV split (note: doesn't handle quoted commas well, but let's check text first)
    // Looking at the CSV, some answers are quoted: "Ha, yozib oladi", "“Rahmat, muammoingizni aytganingiz uchun.”"
    // So using a smarter Split
    const parts = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
    if (!parts || parts.length < 4) continue;

    const module = parts[0].trim();
    const savol = parts[1].trim();
    const text = parts[2].trim().replace(/^"|"$/g, '');
    const correctAnswer = parts[3].trim().replace(/^"|"$/g, '');

    const modKey = normalize(module);
    const savolKey = normalize(savol);

    // Find all files in R2 that belong to this module and question
    const relatedFiles = r2Files.filter(f => {
        const nf = normalize(f);
        return nf.includes(modKey) && nf.includes(savolKey);
    });

    if (relatedFiles.length === 0) {
        console.log(`No images found for: ${module} - ${savol}`);
        continue;
    }

    relatedFiles.forEach(file => {
        const fileNameWithExt = file.split('/').pop();
        const fileName = fileNameWithExt.split('.').slice(0, -1).join('.'); // Remove extension

        const encodedMatch = file.split('/').map(part => encodeURIComponent(part)).join('/');
        const url = publicUrlPrefix + encodedMatch;

        // Determine if this option is the correct one
        // We match by comparing the normalized fileName with the normalized text of the correct answer
        const isCorrect = normalize(fileName).includes(normalize(correctAnswer)) || normalize(correctAnswer).includes(normalize(fileName));

        results.push({
            module: module,
            savol: savol,
            question_text: text,
            option_text: fileName,
            image_url: url,
            is_correct: isCorrect
        });
    });
}

fs.writeFileSync('scripts/new_modules_data.json', JSON.stringify(results, null, 2));
console.log(`Generated data for ${results.length} options across Modules 5-9.`);
