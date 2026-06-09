/**
 * build.js — Cross-platform build script for FAZO single-deployment.
 * Installs frontend deps, runs Vite build, then copies dist → backend/public.
 * Works identically on Windows, Linux, and macOS.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Resolve paths relative to this file (backend-node/build.js)
const backendDir = __dirname;
const faz00Dir = path.resolve(backendDir, '..', 'faz00');
const distDir = path.join(faz00Dir, 'dist');
const publicDir = path.join(backendDir, 'public');

console.log('\n[build] Installing frontend dependencies...');
execSync('npm install', { cwd: faz00Dir, stdio: 'inherit' });

console.log('\n[build] Building React frontend with Vite...');
execSync('npm run build', { cwd: faz00Dir, stdio: 'inherit' });

console.log('\n[build] Copying dist → backend-node/public...');
fs.rmSync(publicDir, { recursive: true, force: true });
fs.cpSync(distDir, publicDir, { recursive: true });

console.log('[build] ✓ Frontend successfully integrated into backend/public\n');
