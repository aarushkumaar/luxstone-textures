/**
 * generate-thumbs.js
 * ------------------
 * One-time script to generate WebP thumbnails for all project images.
 * Run with: node generate-thumbs.js
 *
 * Output: ASSETS/thumbs/{same relative path}.webp (400px wide, quality 72)
 * Skips files that already exist.
 */

const sharp  = require('sharp');
const path   = require('path');
const fs     = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────
const ASSETS_DIR  = path.join(__dirname, 'ASSETS');
const THUMBS_DIR  = path.join(ASSETS_DIR, 'thumbs');
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 72;

// Extensions to process
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Folders to skip (thumbs folder itself, and any DS_Store etc.)
const IGNORE_DIRS = new Set(['thumbs', '.git', 'node_modules']);

// ── Walk directory recursively ────────────────────────────────────────────────
function walkDir(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!IGNORE_DIRS.has(entry.name)) {
                walkDir(fullPath, fileList);
            }
        } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const allImages = walkDir(ASSETS_DIR);
    console.log(`Found ${allImages.length} images to process.\n`);

    let skipped = 0;
    let generated = 0;
    let errors = 0;

    for (const imgPath of allImages) {
        // Compute relative path from ASSETS_DIR
        const relFromAssets = path.relative(ASSETS_DIR, imgPath);

        // Output path: ASSETS/thumbs/{same relative path}.webp
        const outRelPath = relFromAssets.replace(/\.[^.]+$/, '.webp');
        const outPath    = path.join(THUMBS_DIR, outRelPath);

        // Skip if thumbnail already exists
        if (fs.existsSync(outPath)) {
            skipped++;
            continue;
        }

        // Ensure output directory exists
        fs.mkdirSync(path.dirname(outPath), { recursive: true });

        try {
            await sharp(imgPath)
                .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
                .webp({ quality: THUMB_QUALITY })
                .toFile(outPath);

            const origSize  = (fs.statSync(imgPath).size / 1024).toFixed(0);
            const thumbSize = (fs.statSync(outPath).size / 1024).toFixed(0);
            console.log(`✓  ${relFromAssets}`);
            console.log(`   ${origSize} KB  →  ${thumbSize} KB WebP\n`);
            generated++;
        } catch (err) {
            console.error(`✗  Error on ${relFromAssets}: ${err.message}`);
            errors++;
        }
    }

    console.log('─'.repeat(50));
    console.log(`Done. Generated: ${generated}  |  Skipped: ${skipped}  |  Errors: ${errors}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
