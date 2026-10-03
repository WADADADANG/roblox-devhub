const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function ensureLune() {
  const binDir = path.join(__dirname, '..', 'bin');
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  const luneLinuxPath = path.join(binDir, 'lune-linux');
  if (fs.existsSync(luneLinuxPath) && fs.statSync(luneLinuxPath).size > 1000000) {
    console.log('✅ Lune Linux binary already present.');
    return;
  }

  console.log('⬇️ Downloading Lune v0.10.5 for Linux x86_64...');
  const zipUrl = 'https://github.com/lune-org/lune/releases/download/v0.10.5/lune-0.10.5-linux-x86_64.zip';
  const zipPath = path.join(binDir, 'lune-temp.zip');

  try {
    const res = await fetch(zipUrl);
    if (!res.ok) {
      throw new Error(`Failed to download Lune: HTTP ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(zipPath, Buffer.from(arrayBuffer));
    console.log(`📦 Downloaded Lune zip (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB). Extracting...`);

    // Extract using bsdtar (built-in on Windows and Linux)
    try {
      execSync(`tar -xf "${zipPath}" -C "${binDir}"`);
    } catch {
      // Fallback command if tar fails
      execSync(`unzip -o "${zipPath}" -d "${binDir}"`);
    }

    // Rename extracted 'lune' binary to 'lune-linux'
    const extractedBinary = path.join(binDir, 'lune');
    if (fs.existsSync(extractedBinary)) {
      if (fs.existsSync(luneLinuxPath)) fs.unlinkSync(luneLinuxPath);
      fs.renameSync(extractedBinary, luneLinuxPath);
      try {
        fs.chmodSync(luneLinuxPath, 0o755);
      } catch {}
      console.log('✅ Lune Linux binary ready at bin/lune-linux');
    }

    // Clean up zip
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
  } catch (err) {
    console.warn('⚠️ Warning: Failed to download Lune binary:', err.message);
    console.log('ℹ️ Simulator will use the Smart Cloud Engine fallback.');
  }
}

ensureLune();
