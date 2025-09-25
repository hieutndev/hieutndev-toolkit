const fs = require('fs');
const path = require('path');

function generateIndexFiles() {
  const distDir = path.join(__dirname, '..', 'dist');
  const hooksDir = path.join(distDir, 'hooks');
  const utilsDir = path.join(distDir, 'utils');

  // Function to get all .js files (excluding index.js) in a directory
  function getExportFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    
    return fs.readdirSync(dir)
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .map(file => file.replace('.js', ''));
  }

  // Generate hooks index files
  if (fs.existsSync(hooksDir)) {
    const hookFiles = getExportFiles(hooksDir);
    if (hookFiles.length > 0) {
      const hooksExports = hookFiles.map(file => `export * from './${file}';`).join('\n');
      
      // Write hooks/index.js
      fs.writeFileSync(path.join(hooksDir, 'index.js'), hooksExports);
      console.log('Generated hooks/index.js');
      
      // Write hooks/index.d.ts
      fs.writeFileSync(path.join(hooksDir, 'index.d.ts'), hooksExports);
      console.log('Generated hooks/index.d.ts');
    }
  }

  // Generate utils index files
  if (fs.existsSync(utilsDir)) {
    const utilFiles = getExportFiles(utilsDir);
    if (utilFiles.length > 0) {
      const utilsExports = utilFiles.map(file => `export * from './${file}';`).join('\n');
      
      // Write utils/index.js
      fs.writeFileSync(path.join(utilsDir, 'index.js'), utilsExports);
      console.log('Generated utils/index.js');
      
      // Write utils/index.d.ts
      fs.writeFileSync(path.join(utilsDir, 'index.d.ts'), utilsExports);
      console.log('Generated utils/index.d.ts');
    }
  }

  // Generate main index files
  const mainExports = [];
  if (fs.existsSync(hooksDir) && getExportFiles(hooksDir).length > 0) {
    mainExports.push("export * from './hooks';");
  }
  if (fs.existsSync(utilsDir) && getExportFiles(utilsDir).length > 0) {
    mainExports.push("export * from './utils';");
  }

  if (mainExports.length > 0) {
    const mainExportContent = mainExports.join('\n');
    
    // Write main index.js
    fs.writeFileSync(path.join(distDir, 'index.js'), mainExportContent);
    console.log('Generated index.js');
    
    // Write main index.d.ts
    fs.writeFileSync(path.join(distDir, 'index.d.ts'), mainExportContent);
    console.log('Generated index.d.ts');
  }

  console.log('✅ All index files generated successfully!');
}

generateIndexFiles();