import { supabase } from "../lib/api";
import { VITE_WEBRTC_PROVIDER_NAME, VITE_DOLBY_API_KEY } from "../lib/constants";

const getProvider = async () => {
  if (VITE_WEBRTC_PROVIDER_NAME) {
    return VITE_WEBRTC_PROVIDER_NAME;
  }
  
  const { data } = await supabase
    .from('environment')
    .select('value')
    .eq('key', 'PROVIDER_NAME');
    
  return data[0]?.value;
}

const getDolbyKey = async () => {
  if (VITE_DOLBY_API_KEY) {
    return VITE_DOLBY_API_KEY;
  }
  
  const { data } = await supabase
    .from('environment')
    .select('value')
    .eq('key', 'DOLBY_API_KEY');
    
  return data[0]?.value;
}

export { getProvider, getDolbyKey };