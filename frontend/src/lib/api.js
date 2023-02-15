import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

import { REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY } from './constants';

export const supabase = createClient(
  REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_KEY,
);

export default axios.create({ baseURL: process.env.REACT_APP_SUPABASE_FUNCTIONS_URL });
