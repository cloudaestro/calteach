// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mccfjtfmqagnrjzsoevq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jY2ZqdGZtcWFnbnJqenNvZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDYyMzgsImV4cCI6MjA0OTEyMjIzOH0.oBOGfDM6k-H7IUjDWXE87U2oDTBiDDfg6i3lF8tsy4M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);