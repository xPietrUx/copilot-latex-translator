const fs = require('fs');
const path = require('path');

// Paths to source libraries
const markedSrc = path.join(__dirname, '../node_modules/marked/marked.min.js');
const katexDistSrc = path.join(__dirname, '../node_modules/katex/dist');

// Destination paths
const distLibDir = path.join(__dirname, '../dist/lib');
const markedDest = path.join(distLibDir, 'marked.min.js');
const katexDistDest = path.join(distLibDir, 'katex');

// Function for recursive directory copying
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read directory contents
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // If it's a directory, call recursively
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    }
    // If it's a file, copy it
    else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Create main lib directory if it doesn't exist
if (!fs.existsSync(distLibDir)) {
  fs.mkdirSync(distLibDir, { recursive: true });
}

// Copy Marked
console.log(`Copying marked.min.js to ${markedDest}`);
fs.copyFileSync(markedSrc, markedDest);

// Copy KaTeX
console.log(`Copying KaTeX to ${katexDistDest}`);
copyDir(katexDistSrc, katexDistDest);

console.log('Libraries copied successfully!');
