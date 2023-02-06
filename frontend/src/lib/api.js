import { createClient } from "@supabase/supabase-js";
import axios from 'axios';
import { REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY } from "./constants";

export const supabase = createClient(
  REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_KEY
);

export default axios.create({
  baseURL: 'https://yyuyncpblcnwlrfpvenq.functions.supabase.co'
});
