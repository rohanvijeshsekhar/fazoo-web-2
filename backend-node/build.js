/**
 * build.js — Cross-platform build script for FAZO single-deployment.
 * Installs frontend deps, runs Vite build, then copies dist → backend-node/public.
 * backend-node is fully self-contained — no files outside this directory are required.
 * Works identically on Windows, Linux, and macOS.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// All paths resolve within backend-node/ — fully self-contained
const backendDir = __dirname;
const frontendDir = path.join(backendDir, 'frontend');   // backend-node/frontend/
const distDir = path.join(frontendDir, 'dist');           // backend-node/frontend/dist/
const publicDir = path.join(backendDir, 'public');        // backend-node/public/

console.log('\n[build] Installing frontend dependencies...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

console.log('\n[build] Building React frontend with Vite...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

console.log('\n[build] Copying dist → backend-node/public...');
fs.rmSync(publicDir, { recursive: true, force: true });
fs.cpSync(distDir, publicDir, { recursive: true });

console.log('[build] ✓ Frontend successfully integrated into backend/public\n');
