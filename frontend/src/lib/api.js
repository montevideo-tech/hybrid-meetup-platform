import axios from "axios";
import { createClient } from "@supabase/supabase-js";

import {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY,
  VITE_SUPABASE_FUNCTIONS_URL,
} from "./constants";

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

export default axios.create({ baseURL: VITE_SUPABASE_FUNCTIONS_URL });
