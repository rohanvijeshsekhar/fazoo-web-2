const path = require('path');
const fs = require('fs');

// Add backend-node/node_modules to the module search paths
module.paths.push(path.join(__dirname, 'backend-node', 'node_modules'));

// Now we can require dotenv and other packages normally
const dotenv = require('dotenv');

// Load environment variables from backend-node/.env if it exists
const envPath = path.join(__dirname, 'backend-node', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Start the actual backend server
require('./backend-node/server.js');
