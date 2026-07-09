import { createClient } from "@supabase/supabase-js";

/**
 * Optional Supabase client. The app runs fine without it (localStorage demo mode).
 * When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, you can migrate the
 * data layer in src/data/store.ts to use this client instead of localStorage.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseEnabled = Boolean(url && anon);

export const supabase = supabaseEnabled ? createClient(url!, anon!) : null;
