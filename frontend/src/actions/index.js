import mvdTech from '../lib/api';
import { login } from '../reducers/userSlice';
import { VITE_SUPABASE_KEY } from '../lib/constants';

export const signInWithEmail = (data, onSuccess = null, onError = null) => async (dispatch) => {
  if (!data || !data.email || !data.password) {
    onError && onError('Internal error: Missing credentials');
    return;
  }
  const user = {
    email: data?.email,
    password: data?.password,
  };
  try {
    const response = await mvdTech.post(
      '/sign-in',
      JSON.stringify({ user }),
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    dispatch(
      login({
        email: response.data.data.user.email,
        token: response.data.data.session.access_token,
        role: response.data.data.role,
      }),
    );
    onSuccess && onSuccess(response);
  } catch (error) {
    const signInError = error.response
      ? (error.response?.data?.error?.message || error.response?.data)
      : error?.code;
    onError && onError(signInError);
  }
};

export const signUp = (data, onSuccess = null, onError = null) => async () => {
  if (!data || !data.email || !data.password || !data.name) {
    onError && onError('Internal error: Missing credentials');
    return;
  }
  const user = {
    username: data.name,
    email: data.email,
    password: data.password,
  };

  try {
    const response = await mvdTech.post(
      '/sign-up',
      JSON.stringify({ user }),
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
  } catch (error) {
    onError && onError(error);
  }
};

export const createRoom = (onSuccess = null, onError = null) => async () => {
  try {
    const response = await mvdTech.post(
      '/spaces',
      JSON.stringify({}),
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
  } catch (error) {
    onError && onError(error);
  }
};

export const deleteRoom = (providerId, onSuccess = null, onError = null) => async () => {
  try {
    const response = await mvdTech.delete(
      `/spaces/${providerId}`,
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
  } catch (error) {
    onError && onError(error);
  }
};

export const addRoomToDb = (data, onSuccess = null, onError = null) => async () => {
  if (!data) {
    onError && onError('Internal error: Missing data');
    return;
  }

  try {
    const response = await mvdTech.post(
      '/insert-db-entry',
      JSON.stringify({ table: 'rooms', ...data }),
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
  } catch (error) {
    onError && onError(error);
  }
};

export const roomJWTprovider = async (
  roomId,
  participantId,
  onError = null,
  onSuccess = null,
  onNotFound = null,
) => {
  if (!roomId || !participantId) {
    onError && onError(`Internal error: missing ${!roomId && 'roomId'} ${!participantId && 'participantId'}`);
    return;
  }
  try {
    const response = await mvdTech.post(
      '/room-jwtprovider',
      JSON.stringify({ spaceId: roomId, participantId }),
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
    return response.data.spaceToken;
  } catch (error) {
    if (error.response.status === 404) {
      onNotFound && onNotFound();
    } else if (error.response.status !== 200) {
      onError && onError(error);
    }
  }
};

export const giveUserRoleOnRoom = async (
  email,
  roomId,
  roleToAdd,
  onError = null,
  onSuccess = null,
  onNotFound = null,
) => {
  if (!email || !roomId || !roleToAdd) {
    onError && onError('Internal error: missing data');
    return;
  }
  try {
    const response = await mvdTech.post(
      '/give-rooms-permission',
      JSON.stringify({ userEmail: email, providerId: roomId, permission: roleToAdd }),
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
    return response.data;
  } catch (error) {
    if (error.response.status === 404) {
      onNotFound && onNotFound();
    } else if (error.response.status !== 200) {
      onError && onError(error);
    }
  }
};

export const getRoomPermissions = async (
  roomId,
  userEmail = null,
  onError = null,
  onSuccess = null,
) => {
  if (!roomId) {
    onError && onError('Internal error: missing roomId');
    return;
  }
  try {
    const response = await mvdTech.post(
      '/get-room-permission',
      JSON.stringify({ providerId: roomId, userEmail }),
      {
        headers: {
          Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
    return response.data.roomsData.data;
  } catch (error) {
    onError && onError(error);
    throw new Error(`unexpected ${error.response.status} response`);
  }
};
