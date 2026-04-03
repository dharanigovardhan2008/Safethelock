import { useState, useEffect, useMemo } from 'react';
import { Plus, Shield, Search, WalletCards, Edit2, Check } from 'lucide-react';
import { PasswordCard } from './components/PasswordCard';
import { AddPasswordModal, PasswordData } from './components/AddPasswordModal';
import AuthScreen from './components/AuthScreen';
import CryptoJS from 'crypto-js';
import { db, auth } from './firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';

// The Secret Key used to lock and unlock your passwords
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'Vaultify-Super-Secret-AES-Key-2024!';

function VaultApp() {
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPassword, setEditingPassword] = useState<PasswordData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // LOAD & DECRYPT FROM FIREBASE
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'passwords'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPasswords: PasswordData[] = [];
      snapshot.forEach((document) => {
        const data = document.data();
        let decryptedPassword = data.password;

        // Try to unlock the password
        try {
          const bytes = CryptoJS.AES.decrypt(data.password, ENCRYPTION_KEY);
          const originalText = bytes.toString(CryptoJS.enc.Utf8);
          if (originalText) decryptedPassword = originalText;
        } catch (e) {
          // If it fails, it's probably old unencrypted data
        }

        loadedPasswords.push({ id: document.id, ...data, password: decryptedPassword } as PasswordData);
      });
      setPasswords(loadedPasswords.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)));
    });

    return () => unsubscribe();
  }, []);

  // ENCRYPT & SAVE TO FIREBASE
  const handleSavePassword = async (data: Omit<PasswordData, 'dateAdded'>) => {
    const user = auth.currentUser;
    if (!user) return;

    // Lock the password before sending it to the database
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg"><Shield className="text-white" size={24} /></div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Vaultify</h1>
              <p className="text-xs text-indigo-400 font-medium tracking-wide">SECURE CREDENTIALS</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-500" /></div>
              <input type="text" placeholder="Search vault..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
            </div>

            {passwords.length > 0 && (
              <button onClick={() => setIsEditMode(!isEditMode)} className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all shadow-lg ${isEditMode ? 'bg-indigo-500 text-white ring-2 ring-indigo-400' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}`}>
                {isEditMode ? <Check size={18} /> : <Edit2 size={16} />}
                <span className="hidden sm:inline">{isEditMode ? 'Done' : 'Edit Vault'}</span>
              </button>
            )}
            
            <button onClick={() => { setEditingPassword(null); setIsModalOpen(true); }} className="flex items-center space-x-2 bg-white text-slate-900 px-4 py-2 rounded-full font-semibold hover:bg-slate-200">
              <Plus size={18} /><span className="hidden sm:inline">Add New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {passwords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl"><WalletCards size={40} className="text-slate-600" /></div>
            <h2 className="text-2xl font-semibold text-slate-200 mb-2">Your vault is empty</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPasswords.map((pwd) => (
              <PasswordCard key={pwd.id} {...pwd} isEditMode={isEditMode} onEdit={handleEditPassword} onDelete={handleDeletePassword} />
            ))}
          </div>
        )}
      </main>

      <AddPasswordModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingPassword(null); }} onSave={handleSavePassword} editingPassword={editingPassword} />
    </div>
  );
}

export default function App() { return <AuthScreen><VaultApp /></AuthScreen>; }
