// authService.js
// Supabase Authentication Helper Service for EliteHire Mobile

const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

let supabaseClient = null;

async function getSupabase() {
  if (supabaseClient) return supabaseClient;
  
  let url = SUPABASE_URL;
  let key = SUPABASE_ANON_KEY;
  
  try {
    const backendOrigin = window.location.origin.includes('localhost') 
      ? 'http://localhost:8080' 
      : window.location.origin;
    const configRes = await fetch(`${backendOrigin}/api/config`);
    if (configRes.ok) {
      const config = await configRes.json();
      url = config.supabaseUrl;
      key = config.supabaseAnonKey;
    }
  } catch (e) {
    console.warn("Could not load dynamic Supabase config, using defaults:", e);
  }
  
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(url, key);
    return supabaseClient;
  }
  
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      supabaseClient = window.supabase.createClient(url, key);
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  
  return supabaseClient;
}

export async function signUp(email, password) {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { success: true, message: "Account created! Please check your email.", user: data.user, session: data.session };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function signIn(email, password) {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { success: true, message: "Welcome!", user: data.user, session: data.session };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function signOut() {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true, message: "Signed out successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) return { success: false, message: "No active session." };
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function resetPassword(email) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/mobile/screens/mobile_3f182e61b905473294e58ff1bc99f585_Account_Security_MFA_-_Mobile.html'
    });
    if (error) throw error;
    return { success: true, message: "Password reset email sent!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updatePassword(newPassword) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export function onAuthStateChange(callback) {
  let unsubscribeFn = () => {};
  getSupabase().then(supabase => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session ? session.user : null);
    });
    unsubscribeFn = () => subscription.unsubscribe();
  });
  
  return () => unsubscribeFn();
}
