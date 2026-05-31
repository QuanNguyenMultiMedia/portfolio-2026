const fs = require('fs');
const path = require('path');

console.log("=== RUNNING PORTFOLIO 2026 STANDALONE TEST SUITE ===");

const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
    console.error("❌ FAIL: " + message);
  } else {
    console.log("✅ PASS: " + message);
  }
}

// 1. Verify existence of primary files
const filesToCheck = [
  'src/components/MobileTopBar.tsx',
  'src/components/LogoMark.tsx',
  'src/components/Navbar.tsx',
  'src/components/MobileNavbar.tsx',
  'src/components/GlobalSideBar.tsx',
  'src/lib/designSystem.ts',
  'tsconfig.json',
  'next.config.ts',
  'src/app/layout.tsx',
  'src/app/contacts/page.tsx',
  'src/app/works/[slug]/page.tsx',
  'src/app/play/[slug]/page.tsx',
  'src/app/takes/[slug]/page.tsx'
];

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  assert(fs.existsSync(filePath), `File exists: ${file}`);
});

// 2. Verify designSystem.ts has resolved uppercase removal
try {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/lib/designSystem.ts'), 'utf-8');
  assert(!content.includes('h2:       "text-lg md:text-xl lg:text-2xl 3xl:text-3xl 4xl:text-4xl font-display uppercase'), "designSystem.ts successfully removed forced uppercase from t.h2");
} catch (e) {
  errors.push("Failed to check designSystem.ts: " + e.message);
}

// 3. Verify layout.tsx padding wrapper is removed
try {
  const content = fs.readFileSync(path.join(__dirname, '..', 'src/app/layout.tsx'), 'utf-8');
  assert(!content.includes('<div className="pt-9 md:pt-0">'), "layout.tsx successfully removed pt-9 spacer division wrapper");
} catch (e) {
  errors.push("Failed to check layout.tsx: " + e.message);
}

// 4. Verify tsconfig.json excludes the out directory
try {
  const content = fs.readFileSync(path.join(__dirname, '..', 'tsconfig.json'), 'utf-8');
  const json = JSON.parse(content);
  assert(json.exclude && json.exclude.includes('out'), "tsconfig.json successfully includes 'out' in exclude paths");
} catch (e) {
  errors.push("Failed to parse tsconfig.json: " + e.message);
}

// 5. Verify no large MP4 video file left in public assets
const videoPath = path.join(__dirname, '..', 'public/assets/MinhQuan Motion Design Intro Reel.mp4');
assert(!fs.existsSync(videoPath), "Raw MP4 video file successfully removed from public assets");

if (errors.length > 0) {
  console.error(`\n❌ TEST SUITE COMPLETED WITH ${errors.length} ERRORS.`);
  process.exit(1);
} else {
  console.log("\n✨ ALL QUALITY CHECKS PASSED SUCCESSFULLY!");
}
