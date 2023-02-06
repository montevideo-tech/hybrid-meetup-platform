async function singUp(data) {
  const user = {
    email: data.email,
    password: data.password,
  };

  await fetch('https://yyuyncpblcnwlrfpvenq.functions.supabase.co/sign-up', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: JSON.stringify({ user }),
  });

  return data.session.access_token;
}

async function signInWithEmail(data) {
  const user = {
    email: data.email,
    password: data.password,
  };

  await fetch('https://yyuyncpblcnwlrfpvenq.functions.supabase.co/sign-in', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: JSON.stringify({ user }),
  });

  return data.session.access_token;
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

export default { signInWithEmail, singUp };
