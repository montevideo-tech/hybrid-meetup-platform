import { supabase } from "../lib/api";
import { VITE_WEBRTC_PROVIDER_NAME, VITE_DOLBY_API_KEY } from "../lib/constants";

let providerNameCache;
let dolbyApiKeyCache;

const getProvider = async () => {
  if (providerNameCache) {
    return providerNameCache;
  }
  
  
  if (VITE_WEBRTC_PROVIDER_NAME) {
    providerNameCache = VITE_WEBRTC_PROVIDER_NAME;
    return providerNameCache;
  }
  
  const { data } = await supabase
    .from('environment')
    .select('value')
    .eq('key', 'PROVIDER_NAME');
    
  providerNameCache = data[0]?.value;
  return providerNameCache;
}

const getDolbyKey = async () => {
  if (dolbyApiKeyCache) {
    return dolbyApiKeyCache;
  }
  
  if (VITE_DOLBY_API_KEY) {
    dolbyApiKeyCache = VITE_DOLBY_API_KEY;
    return dolbyApiKeyCache;
  }
  
  const { data } = await supabase
    .from('environment')
    .select('value')
    .eq('key', 'DOLBY_API_KEY');
    
  dolbyApiKeyCache = data[0]?.value;
  return dolbyApiKeyCache;
}

export { getProvider, getDolbyKey };