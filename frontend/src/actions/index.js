/* eslint-disable no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import mvdTech from '../lib/api';
import { login } from '../reducers/userSlice';

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
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    dispatch(
      login({
        email: response.data.data.user.email,
        token: response.data.data.session.access_token,
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
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
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
      '/create-space',
      JSON.stringify({}),
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
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
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
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
  onError = null,
  onSuccess = null,
  onNotFound = null,
) => {
  if (!roomId) {
    onError && onError('Internal error: missing roomId');
    return;
  }
  try {
    const response = await mvdTech.post(
      '/room-jwtprovider',
      JSON.stringify({ spaceId: roomId, participantId: `gerardoq@qualabs.com${Math.random()}` }),
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );
    onSuccess && onSuccess(response);
    /* eslint-disable consistent-return */
    return response.data.spaceToken;
  } catch (error) {
    if (error.response.status === 404) {
      onNotFound && onNotFound();
    } else if (error.response.status !== 200) {
      throw new Error(`unexpected ${error.response.status} response`);
    }
  }
};
