
const fs = require('fs');

async function listAllFiles() {
    const accountId = 'ab31ac08e0f090fade1049d8a217b4e8';
    const bucketName = 'tourism';
    const token = 'dYT2Nosm0bmqA8sKURWMWDMCoWqe3DQ8tL4vnPWo';
    let allFiles = [];
    let cursor = null;
    let hasMore = true;

    try {
        while (hasMore) {
            let url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects?per_page=500`;
            if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!data.success) {
                console.error('Error:', data.errors);
                break;
            }

            const files = data.result.map(obj => obj.key);
            allFiles = allFiles.concat(files);

            if (data.result_info && data.result_info.cursor) {
                cursor = data.result_info.cursor;
            } else {
                hasMore = false;
            }
        }

        fs.writeFileSync('r2_files.json', JSON.stringify(allFiles, null, 2));
        console.log(`Saved ${allFiles.length} files to r2_files.json`);
    } catch (error) {
        console.error('Script failed:', error);
    }
}

listAllFiles();
