import React, { useState } from 'react';
import { Copy, Check, Trash2, Edit2, ExternalLink, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { FaGithub, FaAws } from 'react-icons/fa';
import { SiFirebase, SiVercel } from 'react-icons/si';

interface ProjectCardProps {
  id: string; projectName: string; github: string; firebase: string; vercel: string; aws: string; liveUrl: string; dateAdded: string; gradient: string; isEditMode: boolean; onDelete: (id: string) => void; onEdit: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id, projectName, github, firebase, vercel, aws, liveUrl, dateAdded, gradient, isEditMode, onDelete, onEdit
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Changed from PointerEvent to MouseEvent
  const handleCopy = async (e: React.MouseEvent, text: string, field: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the card from flipping
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {}
  };

  const handleCardClick = (flipTo: boolean) => {
    if (isEditMode) onEdit(id);
    else setIsFlipped(flipTo);
  };

  const ServiceRow = ({ icon: Icon, name, value, field }: any) => (
    <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3 overflow-hidden">
        <Icon className="text-slate-400 shrink-0" size={14} />
        <span className="text-[10px] font-bold text-slate-400 tracking-wider w-16 shrink-0">{name}</span>
        <span className="text-xs text-white/90 truncate font-mono">{value || '—'}</span>
      </div>
      {value && (
        // Replaced onPointerDownCapture with onClick
        <button onClick={(e) => handleCopy(e, value, field)} className="p-1.5 text-slate-500 hover:text-white transition-colors relative z-50">
          {copiedField === field ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="relative group w-[340px] h-[240px] transition-transform duration-300 hover:-translate-y-2" style={{ perspective: '1200px' }}>
      <motion.div className="w-full h-full relative rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-shadow duration-300 ring-1 ring-white/20" initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}>
        
        {/* FRONT SIDE */}
        <div onClick={() => handleCardClick(true)} className={cn("absolute inset-0 rounded-2xl overflow-hidden cursor-pointer", gradient)} style={{ backfaceVisibility: 'hidden' }}>
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, transparent 70%)' }}></div>
          {isEditMode && (
            <div className="absolute inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center border-[3px] border-indigo-400 rounded-2xl animate-in fade-in duration-200">
              <div className="bg-indigo-500 p-4 rounded-full mb-3"><Edit2 size={28} className="text-white" /></div><span className="text-white font-black tracking-widest uppercase text-sm">Click to Edit</span>
            </div>
          )}
          <div className="absolute inset-0 p-5 flex flex-col z-10 pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-inner"><Code2 className="text-white" size={20} /></div>
              {!isEditMode && (
                // Replaced onPointerDownCapture with onClick
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    onDelete(id); 
                  }} 
                  className="pointer-events-auto p-2 bg-black/40 hover:bg-rose-600 rounded-full text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20 relative z-50"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-col mt-auto mb-4">
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/60 mb-1 font-bold">Project Hub</span>
              <span className="font-sans text-xl font-bold tracking-[0.1em] text-white uppercase truncate" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>{projectName}</span>
            </div>
            <div className="flex justify-between items-end border-t border-white/20 pt-3">
              <div className="flex flex-col"><span className="text-[6px] uppercase tracking-[0.2em] text-white/70 font-bold">Created</span><span className="font-mono text-xs text-white/90">{dateAdded}</span></div>
              <div className="absolute bottom-4 right-5 flex items-center drop-shadow-lg opacity-90"><div className="w-8 h-8 rounded-full bg-cyan-400/80 mix-blend-multiply"></div><div className="w-8 h-8 rounded-full bg-indigo-500/80 mix-blend-multiply -ml-3"></div></div>
            </div>
          </div>
        </div>

        {/* BACK SIDE (Dev Project Stats) */}
        <div onClick={() => handleCardClick(false)} className="absolute inset-0 rounded-2xl flex flex-col overflow-hidden cursor-pointer bg-[#0a0f1a] ring-1 ring-white/10" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="w-full h-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/5 flex items-center px-4"><span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">Connected Services</span></div>
          <div className="px-4 py-2 pb-4 flex-1 flex flex-col relative z-10">
            <ServiceRow icon={FaGithub} name="GITHUB" value={github} field="github" />
            <ServiceRow icon={SiFirebase} name="FIREBASE" value={firebase} field="firebase" />
            <ServiceRow icon={SiVercel} name="VERCEL" value={vercel} field="vercel" />
            <ServiceRow icon={FaAws} name="AWS" value={aws} field="aws" />
            
            <div className="mt-auto flex justify-between items-center pt-2">
              <div className="flex gap-2 relative z-50">
                {/* Replaced onPointerDownCapture with onClick */}
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    onEdit(id); 
                  }} 
                  className="p-2 bg-white/5 hover:bg-indigo-500 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    onDelete(id); 
                  }} 
                  className="p-2 bg-white/5 hover:bg-rose-500 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {liveUrl && (
                {/* Replaced onPointerDownCapture with onClick */}
                <a 
                  onClick={(e) => e.stopPropagation()} 
                  href={liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors relative z-50"
                >
                  Live Link <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
