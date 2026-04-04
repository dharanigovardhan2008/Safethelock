import React, { useState, useEffect } from 'react';
import { X, Save, Palette, Database, Globe } from 'lucide-react';
import { FaGithub, FaAws } from 'react-icons/fa';
import { SiFirebase, SiVercel } from 'react-icons/si';

export interface ProjectData {
  id: string; projectName: string; github: string; firebase: string; vercel: string; aws: string; liveUrl: string; dateAdded: string; gradient: string;
}

interface AddProjectModalProps {
  isOpen: boolean; onClose: () => void; onSave: (data: Omit<ProjectData, 'dateAdded'>) => void; editingProject?: ProjectData | null;
}

const PRESET_GRADIENTS = [
  'bg-gradient-to-br from-slate-900 to-slate-800', 'bg-gradient-to-tr from-blue-900 to-indigo-900', 'bg-gradient-to-br from-emerald-900 to-teal-900',
  'bg-gradient-to-tl from-purple-900 to-fuchsia-900', 'bg-gradient-to-br from-rose-900 to-red-950', 'bg-gradient-to-r from-amber-900 to-orange-950'
];

// 1. MOVED OUTSIDE to prevent React from losing focus on every keystroke
const InputRow = ({ icon: Icon, label, value, onChange, placeholder }: any) => (
  <div className="flex-1 space-y-1.5">
    <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5">
      <Icon size={14} className="text-slate-500" /> {label}
    </label>
    <input 
      type="text" 
      value={value} 
      onChange={onChange} 
      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
      placeholder={placeholder} 
    />
  </div>
);

export function AddProjectModal({ isOpen, onClose, onSave, editingProject }: AddProjectModalProps) {
  const [formData, setFormData] = useState({ projectName: '', github: '', firebase: '', vercel: '', aws: '', liveUrl: '' });
  const [selectedGradient, setSelectedGradient] = useState(PRESET_GRADIENTS[0]);

  useEffect(() => {
    if (editingProject) {
      setFormData({ projectName: editingProject.projectName, github: editingProject.github, firebase: editingProject.firebase, vercel: editingProject.vercel, aws: editingProject.aws, liveUrl: editingProject.liveUrl });
      setSelectedGradient(editingProject.gradient || PRESET_GRADIENTS[0]);
    } else {
      setFormData({ projectName: '', github: '', firebase: '', vercel: '', aws: '', liveUrl: '' });
      setSelectedGradient(PRESET_GRADIENTS[Math.floor(Math.random() * PRESET_GRADIENTS.length)]);
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName) return;
    onSave({ id: editingProject ? editingProject.id : '', ...formData, gradient: selectedGradient });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className={`p-5 bg-gradient-to-r ${selectedGradient} flex justify-between items-center`}>
          <h2 className="text-xl font-bold text-white tracking-wide">{editingProject ? 'Edit Hub' : 'New Project Hub'}</h2>
          <button type="button" onClick={onClose} className="text-white/80 hover:text-white p-1.5 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Updated to pass value and onChange explicitly */}
          <InputRow icon={Database} label="Project Name" value={formData.projectName} onChange={(e: any) => setFormData({...formData, projectName: e.target.value})} placeholder="e.g. E-Commerce App" />
          
          <div className="flex gap-4">
            <InputRow icon={FaGithub} label="GitHub Email" value={formData.github} onChange={(e: any) => setFormData({...formData, github: e.target.value})} placeholder="user@github.com" />
            <InputRow icon={SiFirebase} label="Firebase Email" value={formData.firebase} onChange={(e: any) => setFormData({...formData, firebase: e.target.value})} placeholder="user@firebase.com" />
          </div>
          
          <div className="flex gap-4">
            <InputRow icon={SiVercel} label="Vercel Email" value={formData.vercel} onChange={(e: any) => setFormData({...formData, vercel: e.target.value})} placeholder="user@vercel.com" />
            <InputRow icon={FaAws} label="AWS Email" value={formData.aws} onChange={(e: any) => setFormData({...formData, aws: e.target.value})} placeholder="user@aws.com" />
          </div>
          
          <InputRow icon={Globe} label="Live URL" value={formData.liveUrl} onChange={(e: any) => setFormData({...formData, liveUrl: e.target.value})} placeholder="https://myapp.com" />
          
          <div>
            <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 mb-2"><Palette size={12} /> Card Theme</label>
            <div className="flex gap-3 bg-slate-950/30 p-2 rounded-xl border border-slate-800/50 justify-center">
              {PRESET_GRADIENTS.map((gradient) => (<button key={gradient} type="button" onClick={() => setSelectedGradient(gradient)} className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} ${selectedGradient === gradient ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-40 hover:opacity-80 transition-all'}`} />))}
            </div>
          </div>
          
          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all active:scale-[0.98]"><Save size={18} className="inline mr-2" />{editingProject ? 'Save Hub' : 'Create Hub'}</button>
        </form>
      </div>
    </div>
  );
}
