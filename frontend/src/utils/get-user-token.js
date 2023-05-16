import { store } from "../store";

export const getUserToken = () => {
  const userToken = store.getState().user?.token;
  return userToken || null;
};

export default getUserToken;
