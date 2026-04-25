import { createClient } from '@supabase/supabase-js';

// Fallback keys if environment variables are missing
const FALLBACK_URL = 'https://vrrhvrcxpjcykxxillit.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycmh2cmN4cGpjeWt4eGlsbGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjM5MzMsImV4cCI6MjA5MjYzOTkzM30.MN_k7XVUUeondik2tC468wCG4QeHZZmOWIw7ebyU1To';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
