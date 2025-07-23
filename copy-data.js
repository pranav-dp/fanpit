const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourcePath = path.join(__dirname, 'fanpit_data.json');
const buildDir = path.join(__dirname, '.next', 'server', 'app', 'api', 'invoke');

// Create the directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
  console.log(`Created directory: ${buildDir}`);
}

// Copy the file
try {
  fs.copyFileSync(sourcePath, path.join(buildDir, 'fanpit_data.json'));
  console.log(`Successfully copied fanpit_data.json to ${buildDir}`);
} catch (error) {
  console.error('Error copying file:', error);
}
