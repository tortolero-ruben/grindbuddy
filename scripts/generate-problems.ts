import fs from 'fs';
import path from 'path';

const README_URL = 'https://raw.githubusercontent.com/envico801/Neetcode-150-and-Blind-75/main/README.md';
const OUTPUT_FILE = path.join(process.cwd(), 'src/lib/data/problems.ts');

async function main() {
    console.log('Fetching README...');
    const response = await fetch(README_URL);
    const text = await response.text();

    console.log('Parsing content...');
    const problems = [];
    let currentCategory = '';

    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Match Category (Heading 3)
        // ### Arrays & Hashing
        const categoryMatch = line.match(/^### (.*)/);
        if (categoryMatch) {
            currentCategory = categoryMatch[1].trim();
            console.log('Found Category:', currentCategory);
            continue;
        }

        // Match Table Row
        // | **0217** | **[Contains Duplicate](...) - [Blind]** | ...
        if (line.startsWith('|') && line.includes('http')) {
            const parts = line.split('|').map(p => p.trim());
            // parts[0] is empty (before first |)
            // parts[1] is Number (**0217**)
            // parts[2] is Title (**[Contains Duplicate](...)**)
            // parts[3] is Leetcode Link
            // parts[4] is Difficulty

            if (parts.length < 5) continue;

            const numberStr = parts[1].replace(/\*\*/g, '');
            const number = parseInt(numberStr, 10);
            if (isNaN(number)) continue;

            // Title and Neetcode URL
            // **[Contains Duplicate](https://neetcode.io/problems/duplicate-integer) - [Blind]**
            const titleMatch = parts[2].match(/\[(.*?)\]\((.*?)\)/);
            if (!titleMatch) continue;

            let title = titleMatch[1];
            const neetcodeUrl = titleMatch[2];

            // Leetcode URL
            const leetcodeMatch = parts[3].match(/\((.*?)\)/);
            const leetcodeUrl = leetcodeMatch ? leetcodeMatch[1] : '';

            // Difficulty
            const difficulty = parts[4].trim();

            if (title && number && neetcodeUrl && leetcodeUrl) {
                // Generate slug from title
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                problems.push({
                    id,
                    number,
                    title,
                    difficulty,
                    neetcodeUrl, // Added neetcodeUrl to the problem object
                    leetcodeUrl,
                    patterns: [currentCategory]
                });
                console.log('Added Problem:', title);
            }
        }
    }

    console.log(`Found ${problems.length} problems.`);

    const fileContent = `export const problemsData = ${JSON.stringify(problems, null, 4)};`;

    // Ensure dir exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Saved to ${OUTPUT_FILE}`);
}

main();
