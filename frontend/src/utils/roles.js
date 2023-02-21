import { supabase } from '../lib/api';

const subscribeToRoleChanges = (roomId) => {
  console.log(roomId);
  supabase
    .channel('any')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rooms-data',
        filter: `providerId=eq.${roomId}`,
      },
      (payload) => console.log('Change received!', payload),
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'rooms-data',
        filter: `providerId=eq.${roomId}`,
      },
      (payload) => console.log('Deletion detected', payload),
    ).subscribe();
};

export default subscribeToRoleChanges;
