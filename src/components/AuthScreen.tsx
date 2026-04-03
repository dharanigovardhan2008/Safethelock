import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Lock, LogOut, ShieldCheck } from 'lucide-react';

export default function AuthScreen({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'login' | 'setup_pin' | 'enter_pin' | 'unlocked'>('loading');
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  // Listen for user login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().pin) {
          setAuthStatus('enter_pin');
        } else {
          setAuthStatus('setup_pin');
        }
      } else {
        setUser(null);
        setAuthStatus('login');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSetupPin = async () => {
    if (pinInput.length !== 4 || !user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { pin: pinInput }, { merge: true });
      setAuthStatus('unlocked');
      setPinInput('');
    } catch (err) {
      setError("Error saving PIN");
    }
  };

  const handleVerifyPin = async () => {
    if (pinInput.length !== 4 || !user) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().pin === pinInput) {
        setAuthStatus('unlocked');
        setPinInput('');
        setError('');
      } else {
        setError("Incorrect PIN");
        setPinInput(''); // Clear input on wrong pin
      }
    } catch (err) {
      setError("Error verifying PIN");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setAuthStatus('login');
  };

  // --- RENDERING SCREENS ---
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium tracking-wide">Securing connection...</p>
      </div>
    );
  }

  if (authStatus === 'unlocked') {
    return (
      <div className="relative min-h-screen bg-slate-950 text-white">
        <button 
          onClick={handleLogout} 
          className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 px-4 py-2 rounded-full text-slate-300 hover:text-white transition border border-white/5 shadow-lg"
        >
          <LogOut size={16} /> Logout
        </button>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-50 selection:bg-indigo-500/30 font-sans">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center relative z-10">
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-8">
          <ShieldCheck size={32} className="text-white" />
        </div>

        {authStatus === 'login' && (
          <>
            <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Vaultify</h1>
            <p className="text-slate-400 mb-10 text-center">Securely store your credentials in the cloud.</p>
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </>
        )}

        {(authStatus === 'setup_pin' || authStatus === 'enter_pin') && (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2 text-white">
              {authStatus === 'setup_pin' ? 'Create a 4-Digit PIN' : 'Enter your PIN'}
            </h1>
            <p className="text-slate-400 mb-8 text-center text-sm">
              {authStatus === 'setup_pin' ? 'This secures your vault on this device.' : user?.email}
            </p>

            {/* UPGRADED 4-DIGIT PIN UI */}
            <div className="relative flex gap-3 sm:gap-4 justify-center mb-8">
              {/* Invisible input that handles the actual typing and mobile keyboard */}
              <input 
                type="tel"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setError(''); // Clear error when typing
                  setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
                autoFocus
              />
              
              {/* Visual 4-box layout */}
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pinInput.length > index;
                const isActive = pinInput.length === index;

                return (
                  <div 
                    key={index}
                    className={`w-14 h-16 sm:w-16 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 
                      ${isActive ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-slate-800/80 scale-105' : 
                        isFilled ? 'border-slate-600 bg-slate-800' : 'border-slate-800 bg-slate-900/50'}
                    `}
                  >
                    {isFilled && (
                      <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-in zoom-in duration-200" />
                    )}
                  </div>
                );
              })}
            </div>

            {error && (
              <p className="text-rose-400 mb-6 text-sm font-medium animate-in slide-in-from-top-2">{error}</p>
            )}

            <button 
              onClick={authStatus === 'setup_pin' ? handleSetupPin : handleVerifyPin}
              disabled={pinInput.length !== 4}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] 
                ${pinInput.length === 4 
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 cursor-pointer' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }
              `}
            >
              <Lock size={18} />
              {authStatus === 'setup_pin' ? 'Save PIN' : 'Unlock Vault'}
            </button>
            
            <button 
              onClick={handleLogout} 
              className="mt-6 text-sm text-slate-500 hover:text-slate-300 transition"
            >
              Not {user?.email?.split('@')[0]}? Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
