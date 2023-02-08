/* eslint-disable no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import mvdTech from '../lib/api';
import { login } from '../reducers/userSlice';

export const signInWithEmail = (data, onSuccess = null, onError = null) => async (dispatch) => {
  const user = {
    email: data.email,
    password: data.password,
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
    const signInError = error.response ? error.response?.data?.error?.message : error?.code;
    onError && onError(signInError);
  }
};

export const signUp = (data, onSuccess = null, onError = null) => async () => {
  const user = {
    email: data.email,
    password: data.password,
    username: data.name,
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
