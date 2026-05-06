#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
async function run() {
  const sharp = require('sharp');
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    console.error('Usage: node tools/generate-icons.js <source-image-path>');
    process.exit(2);
  }
  const src = argv[0];
  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(2);
  }

  const outDir = path.resolve(__dirname, '..', 'assets', 'images');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const tasks = [
    { name: 'icon.png', size: 1024 },
    { name: 'splash-icon.png', size: 1024 },
    { name: 'favicon.png', size: 32 },
    { name: 'android-icon-foreground.png', size: 432 },
    { name: 'android-icon-background.png', size: 432 },
    { name: 'android-icon-monochrome.png', size: 432 },
  ];

  for (const t of tasks) {
    const out = path.join(outDir, t.name);
    await sharp(src)
      .resize(t.size, t.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(out);
    console.log('Wrote', out);
  }

  console.log('Icon generation complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
