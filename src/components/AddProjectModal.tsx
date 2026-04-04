import React, { useState, useEffect } from 'react';
import { X, Save, Palette, Github, Database, Cloud, Globe } from 'lucide-react';
import { cn } from '../utils/cn';

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

  const InputRow = ({ icon: Icon, label, field, placeholder }: any) => (
    <div className="flex-1 space-y-1.5">
      <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5"><Icon size={12} /> {label}</label>
      <input type="text" value={(formData as any)[field]} onChange={(e) => setFormData({...formData, [field]: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className={`p-5 bg-gradient-to-r ${selectedGradient} flex justify-between items-center`}>
          <h2 className="text-xl font-bold text-white tracking-wide">{editingProject ? 'Edit Hub' : 'New Project Hub'}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1.5"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <InputRow icon={Database} label="Project Name" field="projectName" placeholder="e.g. E-Commerce App" />
          <div className="flex gap-4">
            <InputRow icon={Github} label="GitHub Email" field="github" placeholder="user@github.com" />
            <InputRow icon={Database} label="Firebase Email" field="firebase" placeholder="user@firebase.com" />
          </div>
          <div className="flex gap-4">
            <InputRow icon={Cloud} label="Vercel Email" field="vercel" placeholder="user@vercel.com" />
            <InputRow icon={Cloud} label="AWS Email" field="aws" placeholder="user@aws.com" />
          </div>
          <InputRow icon={Globe} label="Live URL" field="liveUrl" placeholder="https://myapp.com" />
          
          <div>
            <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 mb-2"><Palette size={12} /> Card Theme</label>
            <div className="flex gap-3 bg-slate-950/30 p-2 rounded-xl border border-slate-800/50 justify-center">
              {PRESET_GRADIENTS.map((gradient) => (<button key={gradient} type="button" onClick={() => setSelectedGradient(gradient)} className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} ${selectedGradient === gradient ? 'ring-2 ring-white scale-110' : 'opacity-40'}`} />))}
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold tracking-wide"><Save size={18} className="inline mr-2" />{editingProject ? 'Save Hub' : 'Create Hub'}</button>
        </form>
      </div>
    </div>
  );
}
