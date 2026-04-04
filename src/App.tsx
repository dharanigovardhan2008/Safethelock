import { useState, useEffect } from 'react';
import { Plus, Shield, Search, WalletCards, Edit2, Check, LogOut, LayoutDashboard, Lock } from 'lucide-react';
import { PasswordCard } from './components/PasswordCard';
import { AddPasswordModal, PasswordData } from './components/AddPasswordModal';
import { ProjectCard } from './components/ProjectCard';
import { AddProjectModal, ProjectData } from './components/AddProjectModal';
import AuthScreen from './components/AuthScreen';
import CryptoJS from 'crypto-js';

import { db, auth } from './firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'Vaultify-Super-Secret-AES-Key-2024!';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'vault' | 'projects'>('vault');

  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordData | null>(null);

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubPwd = onSnapshot(query(collection(db, 'passwords'), where('userId', '==', user.uid)), (snapshot) => {
      const loaded: PasswordData[] = [];
      snapshot.forEach((d) => {
        let p = d.data().password;
        try { const bytes = CryptoJS.AES.decrypt(p, ENCRYPTION_KEY); const t = bytes.toString(CryptoJS.enc.Utf8); if(t) p = t; } catch(e){}
        loaded.push({ id: d.id, ...d.data(), password: p } as PasswordData);
      });
      setPasswords(loaded.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)));
    });

    const unsubProj = onSnapshot(query(collection(db, 'projects'), where('userId', '==', user.uid)), (snapshot) => {
      const loaded: ProjectData[] = [];
      snapshot.forEach((d) => {
        let data = d.data();
        ['github', 'firebase', 'vercel', 'aws'].forEach(field => {
          try { if(data[field]) { const bytes = CryptoJS.AES.decrypt(data[field], ENCRYPTION_KEY); const t = bytes.toString(CryptoJS.enc.Utf8); if(t) data[field] = t; } } catch(e){}
        });
        loaded.push({ id: d.id, ...data } as ProjectData);
      });
      setProjects(loaded.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)));
    });

    return () => { unsubPwd(); unsubProj(); };
  }, []);

  const handleSavePassword = async (data: Omit<PasswordData, 'dateAdded'>) => {
    const user = auth.currentUser; if (!user) return;
    const enc = CryptoJS.AES.encrypt(data.password, ENCRYPTION_KEY).toString();
    try {
      if (data.id) await updateDoc(doc(db, 'passwords', data.id), { ...data, password: enc });
      else await addDoc(collection(db, 'passwords'), { ...data, password: enc, dateAdded: new Date().toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }), userId: user.uid });
    } catch (error: any) { alert("Error: " + error.message); }
  };

  const handleSaveProject = async (data: Omit<ProjectData, 'dateAdded'>) => {
    const user = auth.currentUser; if (!user) return;
    const encData = { ...data } as any;
    ['github', 'firebase', 'vercel', 'aws'].forEach(f => {
      if(encData[f]) encData[f] = CryptoJS.AES.encrypt(encData[f], ENCRYPTION_KEY).toString();
    });
    try {
      if (data.id) await updateDoc(doc(db, 'projects', data.id), encData);
      else await addDoc(collection(db, 'projects'), { ...encData, dateAdded: new Date().toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }), userId: user.uid });
    } catch (error: any) { alert("Error: " + error.message); }
  };

  const filteredPasswords = passwords.filter(p => p.website.toLowerCase().includes(searchQuery.toLowerCase()) || p.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProjects = projects.filter(p => p.projectName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#050914] text-slate-50 selection:bg-indigo-500/30 font-sans pb-20">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 bg-[#050914]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg"><Shield className="text-white" size={24} /></div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Vaultify</h1>
              <p className="hidden md:block text-[10px] md:text-xs text-indigo-400 font-medium tracking-wide uppercase">Workspace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden lg:block mr-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-500" /></div>
              <input type="text" placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
            </div>

            <button onClick={() => setIsEditMode(!isEditMode)} className={`flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-full font-semibold transition-all shrink-0 ${isEditMode ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}>
              {isEditMode ? <Check size={18} /> : <Edit2 size={18} />} <span className="hidden sm:inline ml-2 text-sm">{isEditMode ? 'Done' : 'Edit'}</span>
            </button>
            
            <button onClick={() => { activeTab === 'vault' ? (setEditingPassword(null), setIsPwdModalOpen(true)) : (setEditingProject(null), setIsProjModalOpen(true)); }} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-white text-slate-900 hover:bg-slate-200 rounded-full transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0">
              <Plus size={18} /> <span className="hidden sm:inline ml-2 text-sm font-semibold">New {activeTab === 'vault' ? 'Pass' : 'Project'}</span>
            </button>

            <button onClick={() => signOut(auth)} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-slate-900 hover:bg-rose-500/20 text-rose-400 rounded-full transition-colors border border-slate-800 shrink-0 ml-1">
              <LogOut size={18} /> <span className="hidden sm:inline ml-2 text-sm font-semibold">Exit</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex gap-4 border-t border-white/5 pt-3">
          <button onClick={() => setActiveTab('vault')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${activeTab === 'vault' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>
            <Lock size={16} /> Password Vault
          </button>
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${activeTab === 'projects' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>
            <LayoutDashboard size={16} /> Dev Projects
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {activeTab === 'vault' && (
          <>
            {passwords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24"><WalletCards size={48} className="text-slate-700 mb-4" /><h2 className="text-xl font-bold text-slate-300">Vault Empty</h2></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center sm:justify-items-start">
                {filteredPasswords.map((pwd) => (
                  <PasswordCard key={pwd.id} {...pwd} isEditMode={isEditMode} onEdit={(id) => { setEditingPassword(passwords.find(p => p.id === id) || null); setIsPwdModalOpen(true); setIsEditMode(false); }} onDelete={(id) => deleteDoc(doc(db, 'passwords', id))} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'projects' && (
          <>
            {projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5"><h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-1">Total Project Hubs</h3><span className="text-3xl font-black text-white">{projects.length}</span></div>
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5"><h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-1">Live Websites</h3><span className="text-3xl font-black text-indigo-400">{projects.filter(p => p.liveUrl).length}</span></div>
              </div>
            )}

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24"><LayoutDashboard size={48} className="text-slate-700 mb-4" /><h2 className="text-xl font-bold text-slate-300">No Projects Found</h2></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center sm:justify-items-start">
                {filteredProjects.map((proj) => (
                  <ProjectCard 
                    key={proj.id} 
                    {...proj} 
                    isEditMode={isEditMode} 
                    onEdit={(id) => { 
                      setEditingProject(projects.find(p => p.id === id) || null); 
                      setIsProjModalOpen(true); 
                      setIsEditMode(false); 
                    }} 
                    onDelete={async (id) => { 
                      console.log("Deleting Project ID:", id); // Verify ID exists
                      if (!id) return alert("Error: ID is missing!");
                      try { 
                        await deleteDoc(doc(db, 'projects', id)); 
                        console.log("Delete Successful!");
                      } catch (error: any) { 
                        console.error(error);
                        alert("Delete failed! " + error.message); 
                      } 
                    }} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <AddPasswordModal isOpen={isPwdModalOpen} onClose={() => setIsPwdModalOpen(false)} onSave={handleSavePassword} editingPassword={editingPassword} />
      <AddProjectModal isOpen={isProjModalOpen} onClose={() => setIsProjModalOpen(false)} onSave={handleSaveProject} editingProject={editingProject} />
    </div>
  );
}

export default function App() { return <AuthScreen><MainApp /></AuthScreen>; }
