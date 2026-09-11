-- Migration: Make password_hash nullable in profiles table
-- Supabase Authentication (auth.users) is now the single source of truth for passwords.
-- Public profiles no longer store passwords or password hashes.

ALTER TABLE public.profiles ALTER COLUMN password_hash DROP NOT NULL;

-- Comment on column explaining the change
COMMENT ON COLUMN public.profiles.password_hash IS 'Deprecated: Authentication is handled by Supabase Auth (auth.users). Column is retained nullable for backward schema compatibility.';
