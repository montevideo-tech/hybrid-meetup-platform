import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from './constants';

export const supabase = createClient(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY,
);

export default axios.create({ baseURL: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL });
