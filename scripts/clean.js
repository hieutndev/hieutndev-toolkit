const fs = require('fs');
const path = require('path');

function cleanDist() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('✅ Cleaned dist directory');
  }
}

cleanDist();