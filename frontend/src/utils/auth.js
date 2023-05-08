// TODO: DELETE WHEN MIGRATION TO STORE IS COMPLETED

// import mvdTech from '../lib/api';
// import { VITE_SUPABASE_KEY } from './constants';

// async function signUp(data, onSuccess = null, onError = null) {
//   const user = {
//     email: data.email,
//     password: data.password,
//   };

//   try {
//     const response = await mvdTech.post('/sign-up', JSON.stringify({ user }), {
//       headers: {
//         Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
//         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       },
//     });
//     onSuccess && onSuccess(response);
//   } catch (error) {
//     onError && onError(error);
//   }
// }

// async function signInWithEmail(data, onSuccess = null, onError = null) {
//   const user = {
//     email: data.email,
//     password: data.password,
//   };

//   try {
//     const response = await mvdTech.post('/sign-in', JSON.stringify({ user }), {
//       headers: {
//         Authorization: `Bearer ${VITE_SUPABASE_KEY}`,
//         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       },
//     });
//     onSuccess && onSuccess(response);
//   } catch (error) {
//     onError && onError(error);
//   }
// }

// async function signInWithGoogle() {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//   });
// }

// async function getSession() {
//   const { data, error } = await supabase.auth.getSession();
//   console.log(data);
// }

// async function signOut() {
//   const { error } = await supabase.auth.signOut();
// }

// export default { signUp };
