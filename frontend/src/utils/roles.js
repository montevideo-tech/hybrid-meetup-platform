import { supabase } from '../lib/api';

export const ROLES = {
  HOST: 'HOST',
  PRESENTER: 'PRESENTER',
  GUEST: 'GUEST',
};

const subscribeToRoleChanges = (roomId, handleRoleChange) => {
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
      (payload) => handleRoleChange(payload),
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'rooms-data',
        filter: `providerId=eq.${roomId}`,
      },
      (payload) => handleRoleChange(payload),
    ).subscribe();
};

export default subscribeToRoleChanges;
