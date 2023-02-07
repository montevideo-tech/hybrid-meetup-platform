import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';

export default configureStore({
  reducer: {
    loggedUser: userReducer,
  }
});
