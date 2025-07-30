import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Cole suas credenciais do Supabase aqui
const supabaseUrl = 'https://nwtjyzbybbmbwyqkyubd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dGp5emJ5YmJtYnd5cWt5dWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDM0OTIsImV4cCI6MjA2OTM3OTQ5Mn0.TYtbsNJzvTRgrOUUjJadjx-AKIhtJ3rQRQAcqiZCqLY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});