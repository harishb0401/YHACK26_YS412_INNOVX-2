import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust dotenv resolution: root .env first, then server/.env fallback
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️ [Supabase Warning] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables. Set them in .env'
  );
}

const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || supabaseServiceRoleKey;

// Trusted backend client using the service role key (NEVER expose to frontend)
export const supabase = (supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Auth client specifically for validating user credentials via GoTrue signInWithPassword
export const authClient = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseServiceRoleKey && supabase);
};

/**
 * Lightweight safe connectivity check without modifying data
 */
export const checkSupabaseConnection = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return { configured: false, connected: false };
  }

  try {
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { configured: true, connected: false, error: error.message };
    }
    return { configured: true, connected: true };
  } catch (err) {
    return { configured: true, connected: false, error: err.message };
  }
};

export default supabase;
