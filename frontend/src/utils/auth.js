import mvdTech from '../lib/api';

async function signUp(data, onSuccess = null , onError = null ) {
  const user = {
    email: data.email,
    password: data.password,
  };

  try {
    const response = await mvdTech.post('/sign-up',
    JSON.stringify({ user }),
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }
    }
    )
    onSuccess && onSuccess(response)
  } catch (error) {
    onError && onError(response)
  }
}

async function signInWithEmail(data, onSuccess = null, onError = null) {
  const user = {
    email: data.email,
    password: data.password,
  };

  try {
    const response = await mvdTech.post('/sign-in', JSON.stringify({ user }),
      {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    onSuccess && onSuccess(response)
  } catch (error) {
    onError && onError(response)
}
}

// async function signInWithGoogle() {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//     });
// }

// async function getSession() {
//     const { data, error } = await supabase.auth.getSession();
//     console.log(data);
// }

// async function signOut() {
//     const { error } = await supabase.auth.signOut();
// }

export default { signInWithEmail, signUp };
