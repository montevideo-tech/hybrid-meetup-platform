import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'loggedUser',
  initialState: {
    email: null,
    token: null,
    role: null,
  },
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.email = null;
      state.token = null;
      state.role = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
