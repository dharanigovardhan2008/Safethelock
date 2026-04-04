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

  const handleCopy = async (e: React.PointerEvent, text: string, field: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleCardClick = (flipTo: boolean) => {
    if (isEditMode) {
      onEdit(id);
    } else {
      setIsFlipped(flipTo);
    }
  };

  const embossedText = {
    textShadow: '0px 1px 1px rgba(255,255,255,0.3), 0px -1px 1px rgba(0,0,0,0.8)'
  };

  const ServiceRow = ({ icon: Icon, name, value, field }: any) => (
    <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 pointer-events-auto">
      <div className="flex items-center gap-3 overflow-hidden">
        <Icon className="text-slate-300 shrink-0 drop-shadow-sm" size={14} />
        <span className="text-[10px] font-bold text-slate-300 tracking-wider w-16 shrink-0 drop-shadow-sm">{name}</span>
        <span className="text-xs text-[#f8f9fa] truncate font-mono drop-shadow-sm">{value || '—'}</span>
      </div>
      {value && (
        <button 
          onPointerDownCapture={(e) => handleCopy(e, value, field)} 
          className="p-1.5 text-slate-400 hover:text-white transition-colors relative z-50 active:scale-95"
        >
          {copiedField === field ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="relative group w-[340px] h-[240px] transition-transform duration-300 hover:-translate-y-2" style={{ perspective: '1200px' }}>
      <motion.div
        className="w-full h-full relative rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-shadow duration-300 ring-1 ring-white/20"
        initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div onClick={() => handleCardClick(true)} className={cn("absolute inset-0 rounded-2xl overflow-hidden cursor-pointer", gradient)} style={{ backfaceVisibility: 'hidden' }}>
          
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, transparent 70%)' }}></div>
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.3) 25%, transparent 35%, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 60%)' }}></div>

          {isEditMode && (
            <div className="absolute inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center border-[3px] border-indigo-400 rounded-2xl animate-in fade-in duration-200 shadow-[inset_0_0_50px_rgba(99,102,241,0.3)]">
              <div className="bg-indigo-500 p-4 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.6)] mb-3"><Edit2 size={28} className="text-white" /></div>
              <span className="text-white font-black tracking-widest uppercase text-sm drop-shadow-md">Click to Edit</span>
            </div>
          )}
          
          <div className="absolute inset-0 p-5 flex flex-col z-10 pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-inner drop-shadow-lg">
                <Code2 className="text-white w-5 h-5" />
              </div>
              
              {/* DELETE BUTTON EXACTLY AS IN PASSWORD CARD */}
              {!isEditMode && (
                <button 
                  onPointerDownCapture={(e) => { e.stopPropagation(); onDelete(id); }}
                  className="pointer-events-auto p-2 bg-black/40 hover:bg-rose-600 rounded-full text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20 backdrop-blur-md shadow-xl z-50 active:scale-95"
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            
            <div className="flex flex-col mt-auto mb-4">
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/60 mb-1 font-bold drop-shadow-sm">Project Hub</span>
              <span className="font-sans text-xl font-bold tracking-[0.1em] text-[#f8f9fa] uppercase truncate opacity-95" style={embossedText}>
                {projectName}
              </span>
            </div>
            
            <div className="flex justify-between items-end border-t border-white/20 pt-3">
              <div className="flex flex-col">
                <span className="text-[6px] uppercase tracking-[0.2em] text-white/70 font-bold drop-shadow-sm">Created</span>
                <span className="font-mono text-xs text-[#f8f9fa] font-bold opacity-95" style={embossedText}>{dateAdded}</span>
              </div>
              <div className="absolute bottom-4 right-5 flex items-center drop-shadow-lg opacity-90">
                <div className="w-8 h-8 rounded-full bg-cyan-400/80 mix-blend-multiply"></div>
                <div className="w-8 h-8 rounded-full bg-indigo-500/80 mix-blend-multiply -ml-3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div onClick={() => handleCardClick(false)} className={cn("absolute inset-0 rounded-2xl flex flex-col overflow-hidden cursor-pointer ring-1 ring-white/20", gradient)} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          
          <div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px]"></div>

          <div className="w-full h-8 bg-black/20 border-b border-white/10 flex items-center px-4 relative z-10 pointer-events-none">
            <span className="text-[10px] font-black tracking-widest text-indigo-300 uppercase drop-shadow-sm">Connected Services</span>
          </div>
          
          {/* Removed pointer-events-none from here so clicks register normally */}
          <div className="px-4 py-2 pb-4 flex-1 flex flex-col relative z-10">
            <ServiceRow icon={FaGithub} name="GITHUB" value={github} field="github" />
            <ServiceRow icon={SiFirebase} name="FIREBASE" value={firebase} field="firebase" />
            <ServiceRow icon={SiVercel} name="VERCEL" value={vercel} field="vercel" />
            <ServiceRow icon={FaAws} name="AWS" value={aws} field="aws" />
            
            <div className="mt-auto flex justify-between items-center pt-2">
              <div className="flex gap-2 relative z-50">
                <button 
                  onPointerDownCapture={(e) => { e.stopPropagation(); onEdit(id); }}
                  className="p-2 bg-white/10 hover:bg-indigo-500 rounded-lg text-slate-300 hover:text-white transition-colors active:scale-95 border border-white/10 backdrop-blur-md shadow-md"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onPointerDownCapture={(e) => { e.stopPropagation(); onDelete(id); }}
                  className="p-2 bg-white/10 hover:bg-rose-500 rounded-lg text-slate-300 hover:text-white transition-colors active:scale-95 border border-white/10 backdrop-blur-md shadow-md"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {liveUrl && (
                <a 
                  onPointerDownCapture={(e) => e.stopPropagation()} 
                  href={liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors relative z-50 active:scale-95 border border-emerald-500/30 backdrop-blur-md shadow-md"
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
