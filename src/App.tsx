import { useState, useEffect, useMemo } from 'react';
import { Plus, Shield, Search, WalletCards, Edit2, Check, LogOut } from 'lucide-react';
import { PasswordCard } from './components/PasswordCard';
import { AddPasswordModal, PasswordData } from './components/AddPasswordModal';
import AuthScreen from './components/AuthScreen';
import CryptoJS from 'crypto-js';

import { db, auth } from './firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'Vaultify-Super-Secret-AES-Key-2024!';

function VaultApp() {
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPassword, setEditingPassword] = useState<PasswordData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'passwords'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPasswords: PasswordData[] = [];
      snapshot.forEach((document) => {
        const data = document.data();
        let decryptedPassword = data.password;

        try {
          const bytes = CryptoJS.AES.decrypt(data.password, ENCRYPTION_KEY);
          const originalText = bytes.toString(CryptoJS.enc.Utf8);
          if (originalText) {
            decryptedPassword = originalText;
          }
        } catch (e) {
          // Keep plaintext if decryption fails (old data)
        }

        loadedPasswords.push({ 
          id: document.id, 
          ...data, 
          password: decryptedPassword 
        } as PasswordData);
      });
      setPasswords(loadedPasswords.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)));
    });

    return () => unsubscribe();
  }, []);

  const handleSavePassword = async (data: Omit<PasswordData, 'dateAdded'>) => {
    const user = auth.currentUser;
    if (!user) return;

    const encryptedPassword = CryptoJS.AES.encrypt(data.password, ENCRYPTION_KEY).toString();

    try {
      if (data.id) {
        const docRef = doc(db, 'passwords', data.id);
        await updateDoc(docRef, {
          website: data.website, username: data.username, password: encryptedPassword, gradient: data.gradient
        });
      } else {
        const newPassword = {
          website: data.website, username: data.username, password: encryptedPassword, gradient: data.gradient,
          dateAdded: new Date().toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }), userId: user.uid 
        };
        await addDoc(collection(db, 'passwords'), newPassword);
      }
    } catch (error) {
      console.error("Error saving: ", error);
    }
  };

  const handleEditPassword = (id: string) => {
    const pwdToEdit = passwords.find(p => p.id === id);
    if (pwdToEdit) {
      setEditingPassword(pwdToEdit);
      setIsModalOpen(true);
      setIsEditMode(false);
    }
  };

  const handleDeletePassword = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        await deleteDoc(doc(db, 'passwords', id));
      } catch (error) {
        console.error("Error deleting: ", error);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const filteredPasswords = useMemo(() => {
    if (!searchQuery) return passwords;
    const lowerQuery = searchQuery.toLowerCase();
    return passwords.filter(p => p.website.toLowerCase().includes(lowerQuery) || p.username.toLowerCase().includes(lowerQuery));
  }, [passwords, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Vaultify</h1>
              <p className="hidden md:block text-[10px] md:text-xs text-indigo-400 font-medium tracking-wide">SECURE CREDENTIALS</p>
            </div>
          </div>
          
          {/* Actions Area */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Search Bar - Hidden on mobile/tablet, visible on large desktop */}
            <div className="relative hidden lg:block mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-500" /></div>
              <input type="text" placeholder="Search vault..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
            </div>

            {/* Edit Button - Perfect circle on mobile, expanded on desktop */}
            {passwords.length > 0 && (
              <button 
                onClick={() => setIsEditMode(!isEditMode)} 
                className={`flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 rounded-full font-semibold transition-all shrink-0
                  ${isEditMode 
                    ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'}
                `}
                title="Edit Vault"
              >
                {isEditMode ? <Check size={18} strokeWidth={2.5} /> : <Edit2 size={18} strokeWidth={2.5} />}
                <span className="hidden md:inline ml-2 text-sm">{isEditMode ? 'Done' : 'Edit'}</span>
              </button>
            )}
            
            {/* Add Button - Perfect circle on mobile, expanded on desktop */}
            <button 
              onClick={() => { setEditingPassword(null); setIsModalOpen(true); }} 
              className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 bg-white text-slate-900 hover:bg-slate-200 rounded-full transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
              title="Add New"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden md:inline ml-2 text-sm font-semibold">Add New</span>
            </button>

            {/* Logout Button - Perfect circle on mobile, expanded on desktop */}
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 rounded-full transition-colors border border-slate-800 shrink-0 ml-1 md:ml-2"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden md:inline ml-2 text-sm font-semibold">Logout</span>
            </button>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Mobile Search Bar - Shows up here since it's hidden in the header */}
        <div className="lg:hidden mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-slate-500" /></div>
          <input type="text" placeholder="Search vault..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </div>

        {passwords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl"><WalletCards size={40} className="text-slate-600" /></div>
            <h2 className="text-2xl font-semibold text-slate-200 mb-2">Your vault is empty</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Store your passwords securely like a digital wallet.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center sm:justify-items-start">
              {filteredPasswords.map((pwd) => (
                <PasswordCard 
                  key={pwd.id} 
                  {...pwd} 
                  isEditMode={isEditMode}
                  onEdit={handleEditPassword} 
                  onDelete={handleDeletePassword} 
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <AddPasswordModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingPassword(null); }} onSave={handleSavePassword} editingPassword={editingPassword} />
    </div>
  );
}

export default function App() {
  return <AuthScreen><VaultApp /></AuthScreen>;
}
