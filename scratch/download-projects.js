const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projects = [
  { name: 'tourmaline-cat-a86db8', id: 'c7b829b8-1300-4f27-a849-859287453859' },
  { name: 'coruscating-donut-a699dd', id: '8416d0af-9178-410a-a6cb-d68cbf326961' },
  { name: 'melodic-concha-df128c', id: 'c1c79a05-97bf-48b3-b5f2-2d33bd12feb8' },
  { name: 'enchanting-kashata-0f75b9', id: 'a4d96d99-3d6c-4b6d-98e8-745425023557' },
  { name: 'charming-starlight-7ca2f4', id: '94c66fc0-a4d4-4069-bb31-bd5c06f7bb94' }
];

const targetBaseDir = path.join(__dirname, '../public/play-static');

// Helper to make directories recursively
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Download file function
async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.statusText}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  ensureDirectoryExistence(destPath);
  fs.writeFileSync(destPath, buffer);
}

async function run() {
  if (!fs.existsSync(targetBaseDir)) {
    fs.mkdirSync(targetBaseDir, { recursive: true });
  }

  for (const proj of projects) {
    console.log(`\n========================================`);
    console.log(`Processing project: ${proj.name} (${proj.id})`);
    console.log(`========================================`);

    // Fetch site file list
    let filesJson;
    try {
      console.log(`Fetching file listing from Netlify API...`);
      const output = execSync(
        `npx netlify api listSiteFiles --data '{"site_id": "${proj.id}"}'`,
        { maxBuffer: 10 * 1024 * 1024 }
      ).toString();
      filesJson = JSON.parse(output);
    } catch (err) {
      console.error(`Error fetching file list for ${proj.name}:`, err.message);
      continue;
    }

    console.log(`Found ${filesJson.length} files to download.`);

    for (let i = 0; i < filesJson.length; i++) {
      const file = filesJson[i];
      const relativePath = file.path.startsWith('/') ? file.path : `/${file.path}`;
      const fileUrl = `https://${proj.name}.netlify.app${relativePath}`;
      const destPath = path.join(targetBaseDir, proj.name, relativePath);

      if (file.size > 20 * 1024 * 1024) {
        console.log(`[LARGE FILE] ${relativePath} (${(file.size / 1024 / 1024).toFixed(2)} MB) - Downloading...`);
      }

      // Check cache
      if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        if (stats.size === file.size) {
          console.log(`[${i + 1}/${filesJson.length}] [CACHED] ${relativePath}`);
          continue;
        }
      }

      console.log(`[${i + 1}/${filesJson.length}] Downloading ${relativePath} (${(file.size / 1024).toFixed(1)} KB)...`);
      
      try {
        await downloadFile(fileUrl, destPath);
      } catch (err) {
        console.error(`  --> Error downloading ${fileUrl}:`, err.message);
      }
    }
  }

  console.log('\nAll projects processed successfully!');
}

run().catch(console.error);
