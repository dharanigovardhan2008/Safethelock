import React, { useState } from 'react';
import { Wifi, Copy, Check, Trash2, Edit2, ExternalLink, Code2 } from 'lucide-react';
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

  const embossedText = {
    textShadow: '0px 1px 1px rgba(255,255,255,0.3), 0px -1px 1px rgba(0,0,0,0.8)'
  };

  const ServiceRow = ({ icon: Icon, name, value, field }: any) => (
    <div className="flex w-full h-[30px] relative z-[100] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] mb-2 pointer-events-auto">
      {/* Label Box */}
      <div className="w-[85px] bg-[#e0e0e0] flex items-center px-2 border border-gray-400 border-r-0 rounded-l-sm relative overflow-hidden pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 6px)' }}></div>
         <Icon className="text-slate-600 shrink-0 mr-1.5 relative z-10" size={12} />
         <span className="text-[8px] uppercase tracking-widest text-slate-700 font-bold relative z-10">{name}</span>
      </div>
      
      {/* Value/Signature Box */}
      <div className="flex-1 bg-[#f0f0f0] relative overflow-hidden flex items-center px-2 border border-gray-400 border-r-0 border-l-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 6px)' }}></div>
        <span className="font-mono text-slate-800 font-bold tracking-widest text-[10px] select-all relative z-10 truncate" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
          {value || '—'}
        </span>
      </div>
      
      {/* Copy Button */}
      {value ? (
        <div onPointerDownCapture={(e) => handleCopy(e, value, field)} className="w-10 bg-white rounded-r-sm border border-gray-400 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors group/copy relative active:scale-95">
          {copiedField === field ? <Check size={14} className="text-emerald-600" /> : <Copy size={12} className="text-slate-400 group-hover/copy:text-blue-600 transition-colors" />}
          {copiedField === field && <span className="absolute -top-6 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded shadow-lg font-sans font-medium tracking-normal whitespace-nowrap z-[200]">Copied!</span>}
        </div>
      ) : (
        <div className="w-10 bg-gray-100 rounded-r-sm border border-gray-400 flex items-center justify-center opacity-50"></div>
      )}
    </div>
  );

  return (
    <div className="relative group w-[340px] h-[255px] transition-transform duration-300 hover:-translate-y-2" style={{ perspective: '1200px' }}>
      <motion.div className="w-full h-full relative rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.7)] transition-shadow duration-300 ring-1 ring-white/20" initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}>
        
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
              <div className="flex items-center space-x-2.5 drop-shadow-lg">
                <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-inner">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[14px] font-black tracking-[0.15em] text-white uppercase opacity-95 font-sans">
                  PROJECT HUB
                </span>
              </div>
              
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

            <div className="flex flex-col mt-5">
              <div className="flex items-center space-x-4 mb-2 pl-1">
                <div className="w-[46px] h-[34px] rounded-md bg-gradient-to-br from-[#d4af37] via-[#fff4cc] to-[#996515] p-[1px] shadow-[0_2px_5px_rgba(0,0,0,0.4)] relative overflow-hidden">
                  <div className="absolute inset-[1px] rounded-[5px] bg-gradient-to-br from-[#e8c871] to-[#c99a2e] border border-[#8b6508]/50 shadow-inner"></div>
                  <div className="absolute top-[25%] left-0 w-full h-[1px] bg-[#755000]/40 shadow-[0_1px_0_rgba(255,255,255,0.4)]"></div>
                  <div className="absolute top-[50%] left-0 w-full h-[1px] bg-[#755000]/40 shadow-[0_1px_0_rgba(255,255,255,0.4)]"></div>
                  <div className="absolute top-[75%] left-0 w-full h-[1px] bg-[#755000]/40 shadow-[0_1px_0_rgba(255,255,255,0.4)]"></div>
                  <div className="absolute top-0 left-[35%] w-[1px] h-full bg-[#755000]/40 shadow-[1px_0_0_rgba(255,255,255,0.4)]"></div>
                  <div className="absolute top-0 right-[35%] w-[1px] h-full bg-[#755000]/40 shadow-[1px_0_0_rgba(255,255,255,0.4)]"></div>
                  <div className="absolute top-[30%] left-[30%] right-[30%] bottom-[30%] border border-[#755000]/40 rounded-sm"></div>
                </div>
                <Wifi size={28} className="text-white/70 rotate-90 drop-shadow-md" strokeWidth={2.5} />
              </div>
              
              <div className="font-sans font-bold text-[22px] tracking-[0.2em] whitespace-nowrap text-[#f8f9fa] h-[30px] flex items-center pl-1 opacity-95" style={embossedText}>
                •••• •••• •••• ••••
              </div>
            </div>

            <div className="flex justify-between items-end mt-auto mb-1 pl-1 pr-[70px]">
              <div className="flex flex-col">
                <span className="text-[7.5px] uppercase tracking-[0.25em] text-white/60 mb-0.5 font-bold drop-shadow-sm">Project Name</span>
                <span className="font-sans text-[15px] font-bold tracking-[0.1em] text-[#f8f9fa] uppercase truncate max-w-[140px] opacity-95" style={embossedText}>
                  {projectName || 'UNTITLED'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex flex-col text-[6px] uppercase tracking-[0.2em] text-white/70 font-bold text-right leading-[8px] drop-shadow-sm">
                  <span>Created</span>
                  <span>Date</span>
                </div>
                <span className="font-mono text-[15px] tracking-widest text-[#f8f9fa] font-bold opacity-95" style={embossedText}>
                  {dateAdded}
                </span>
              </div>
            </div>
            
            {/* Red/Yellow Logo */}
            <div className="absolute bottom-5 right-5 z-0 pointer-events-none flex items-center drop-shadow-lg opacity-90">
              <div className="w-10 h-10 rounded-full bg-indigo-500/80 mix-blend-multiply"></div>
              <div className="w-10 h-10 rounded-full bg-cyan-400/80 mix-blend-multiply -ml-4"></div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] font-black tracking-widest text-white/80 uppercase">Hub</span>
            </div>
            
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div onClick={() => handleCardClick(false)} className={cn("absolute inset-0 rounded-2xl flex flex-col overflow-hidden cursor-pointer ring-1 ring-white/20", gradient)} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="absolute inset-0 bg-black/30 pointer-events-none backdrop-blur-[2px]"></div>
          
          {/* Magnetic Stripe */}
          <div className="w-full h-10 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#1a1a1a] mt-4 shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none z-10 border-t border-b border-black"></div>

          <div className="px-5 py-3 flex-1 flex flex-col relative z-10">
            <div className="text-[7px] uppercase tracking-widest text-white/60 w-full pointer-events-none font-bold mb-2">
              Connected Infrastructure Services
            </div>
            
            {/* Service Rows inside pointer-events-none wrapper to prevent card flip issues, row itself handles clicks */}
            <div className="flex-1 flex flex-col relative z-10 pointer-events-none">
              <ServiceRow icon={FaGithub} name="GITHUB" value={github} field="github" />
              <ServiceRow icon={SiFirebase} name="FIREBASE" value={firebase} field="firebase" />
              <ServiceRow icon={SiVercel} name="VERCEL" value={vercel} field="vercel" />
              <ServiceRow icon={FaAws} name="AWS" value={aws} field="aws" />
            </div>
            
            {/* Holographic Sticker */}
            <div className="absolute bottom-4 left-5 w-10 h-7 rounded bg-gradient-to-tr from-indigo-400 via-purple-300 to-cyan-400 opacity-60 mix-blend-overlay shadow-inner pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)' }}></div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-2 flex justify-between items-center pointer-events-auto relative z-[100] pb-1">
              <div className="flex gap-2 pl-14"> {/* offset for hologram */}
                <button onPointerDownCapture={(e) => { e.stopPropagation(); onEdit(id); }} className="p-1.5 bg-white/10 hover:bg-indigo-500 rounded text-slate-300 hover:text-white transition-colors active:scale-95 backdrop-blur-md border border-white/10 shadow-lg">
                  <Edit2 size={12} />
                </button>
                <button onPointerDownCapture={(e) => { e.stopPropagation(); onDelete(id); }} className="p-1.5 bg-white/10 hover:bg-rose-500 rounded text-slate-300 hover:text-white transition-colors active:scale-95 backdrop-blur-md border border-white/10 shadow-lg">
                  <Trash2 size={12} />
                </button>
              </div>
              {liveUrl && (
                <a onPointerDownCapture={(e) => e.stopPropagation()} href={liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded text-[8px] font-bold tracking-widest uppercase transition-colors border border-emerald-500/30 active:scale-95 backdrop-blur-md shadow-lg">
                  Live Link <ExternalLink size={10} />
                </a>
              )}
            </div>

            <div className="mt-2 text-[5.5px] text-white/50 text-center uppercase tracking-widest leading-relaxed pointer-events-none font-bold mx-auto opacity-70">
              Project Hub System. Authorized Devs Only.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
