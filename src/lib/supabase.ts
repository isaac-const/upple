import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { demoClient } from './demo';

// Cole suas credenciais do Supabase aqui.
// Sem credenciais, o app roda em modo demonstração, com dados fictícios em memória.
const supabaseUrl = '';
const supabaseAnonKey = '';

export const isDemo = !supabaseUrl;

export const supabase: any = isDemo
  ? demoClient
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
