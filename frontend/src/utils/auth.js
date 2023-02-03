import axios from 'axios';

// async function singUp() {
//     const { data, error } = await supabase.auth.signUp({
//         email: 'hernanr@qualabs.com',
//         password: 'example-password',
//     });
// }

async function signInWithEmail(data) {
    const user = {data}

    await axios.post(`https://yyuyncpblcnwlrfpvenq.functions.supabase.co/sign-up`, {user})
        .catch(error => {
          return error;
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

export default {signInWithEmail}