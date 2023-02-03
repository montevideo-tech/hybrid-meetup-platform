async function singUp(data) {
  console.log('sdfsdfdsfsfs');
  console.log(data);
  const user = {
    email: data.email,
    password: data.password,
  };

  await fetch('https://yyuyncpblcnwlrfpvenq.functions.supabase.co/sign-up', {
    method: 'POST',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dXluY3BibGNud2xyZnB2ZW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUxMDAwODUsImV4cCI6MTk5MDY3NjA4NX0.pP-9Q36Dnj2ZF3GsjS8w4BlEcrQfnWsDgXazW9K4QEw',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: JSON.stringify({ user: user }),
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
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dXluY3BibGNud2xyZnB2ZW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzUxMDAwODUsImV4cCI6MTk5MDY3NjA4NX0.pP-9Q36Dnj2ZF3GsjS8w4BlEcrQfnWsDgXazW9K4QEw',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: JSON.stringify({ user: user }),
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
