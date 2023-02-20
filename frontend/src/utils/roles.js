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
      },
      (payload) => console.log('Change received!', payload),
    )
    .subscribe();
};

export default subscribeToRoleChanges;
