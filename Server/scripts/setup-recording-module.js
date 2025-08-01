/**
 * Setup script for Recording module
 * Creates necessary directories and initialization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Create temporary directory for file uploads
const tempDir = path.join(rootDir, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('Created temp directory for file uploads');
}

// Create public directory for static files if it doesn't exist
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory for static files');
}

// Create placeholder directories for organizing public files
const placeholders = [
    path.join(publicDir, 'thumbnails'),
    path.join(publicDir, 'placeholders'),
];

placeholders.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${path.relative(rootDir, dir)}`);
    }
});

console.log('Recording module setup completed successfully!');
console.log('');
console.log('IMPORTANT: Make sure to set the following environment variables:');
console.log('- CLOUDINARY_CLOUD_NAME');
console.log('- CLOUDINARY_API_KEY');
console.log('- CLOUDINARY_API_SECRET');
console.log('');
console.log('You can copy these from .env.example to your .env file');
