import { supabase } from '../lib/api';

// export async function getGuestMuted() {
//   supabase
//     .from('rooms')
//     .select('guestMuted')
//     .eq('id', 54)
//     .then(result => {
//       console.log(result.data[0].guestMuted);
//       return result.data[0].guestMuted;
//     })
//     .catch(error => {
//       console.error(error)
//     });
// };

export async function getGuestMuted() {
  const urlParams = window.location.pathname;;
  const parts = urlParams.split("/");
  const roomId = parts[2];
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('guestMuted')
      .eq('providerId', roomId)
    if (error) throw error
    return data[0].guestMuted
  } catch (error) {
    console.error(error)
    return null
  }
}

export function setGuestMuted(guestMutedStatus) {
  const urlParams = window.location.pathname;;
  const parts = urlParams.split("/");
  const roomId = parts[2];
  supabase
    .from('rooms')
    .update({ guestMuted: guestMutedStatus })
    .eq('providerId', roomId)
    .then(result => {
    })
    .catch(error => {
      console.error(error)
    })
};