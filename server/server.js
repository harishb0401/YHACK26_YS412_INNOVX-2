import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env before importing app or supabase
const rootEnvPath = path.resolve(__dirname, '../.env');
const serverEnvPath = path.resolve(__dirname, '.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

import app from './app.js';
import { isSupabaseConfigured } from './config/supabase.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Eco-Link API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Supabase Status: ${isSupabaseConfigured() ? 'CONFIGURED ✅' : 'NOT CONFIGURED ⚠️ (Set SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY in .env)'}`);
  console.log(`==================================================\n`);
});
