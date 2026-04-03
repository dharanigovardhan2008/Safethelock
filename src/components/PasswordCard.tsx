import React, { useState } from 'react';
import { Wifi, Copy, Check, Trash2, Key, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  FaGoogle, FaApple, FaAmazon, FaFacebook, FaTwitter, FaGithub, 
  FaSpotify, FaMicrosoft, FaLinkedin, FaDiscord, FaEnvelope
} from 'react-icons/fa';
import { SiNetflix } from 'react-icons/si';

interface PasswordCardProps {
  id: string;
  website: string;
  username: string;
  password: string;
  dateAdded: string;
  gradient: string;
  isEditMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const getServiceIcon = (website: string) => {
  const name = website.toLowerCase();
  if (name.includes('gmail')) return <FaEnvelope className="w-5 h-5" />;
  if (name.includes('google')) return <FaGoogle className="w-5 h-5" />;
  if (name.includes('apple')) return <FaApple className="w-5 h-5" />;
  if (name.includes('netflix')) return <SiNetflix className="w-5 h-5" />;
  if (name.includes('amazon')) return <FaAmazon className="w-5 h-5" />;
  if (name.includes('facebook')) return <FaFacebook className="w-5 h-5" />;
  if (name.includes('twitter') || name === 'x') return <FaTwitter className="w-5 h-5" />;
  if (name.includes('github')) return <FaGithub className="w-5 h-5" />;
  if (name.includes('spotify')) return <FaSpotify className="w-5 h-5" />;
  if (name.includes('microsoft')) return <FaMicrosoft className="w-5 h-5" />;
  if (name.includes('linkedin')) return <FaLinkedin className="w-5 h-5" />;
  if (name.includes('discord')) return <FaDiscord className="w-5 h-5" />;
  return <Key className="w-5 h-5" />;
};

export const PasswordCard: React.FC<PasswordCardProps> = ({
  id, website, username, password, dateAdded, gradient, isEditMode, onDelete, onEdit
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const formattedName = username.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').trim().toUpperCase() || 'VAULT USER';

  return (
    <div className="relative group w-[340px] h-[215px] transition-transform duration-300 hover:-translate-y-2" style={{ perspective: '1200px' }}>
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
              <div className="flex items-center space-x-2.5 drop-shadow-lg">
                <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-inner">
                  {getServiceIcon(website)}
                </div>
                <span className="text-[14px] font-black tracking-[0.15em] text-white uppercase opacity-95 font-sans">
                  {website}
                </span>
              </div>
              
              {!isEditMode && (
                <button 
                  onPointerDownCapture={(e) => { e.stopPropagation(); onDelete(id); }}
                  className="pointer-events-auto p-2 bg-black/40 hover:bg-rose-600 rounded-full text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20 backdrop-blur-md shadow-xl z-50 active:scale-95"
                  title="Delete Password"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-col mt-4">
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

            {/* BOTTOM ROW: Name (Left), Date (Middle-Right), Logo (Far Right) */}
            {/* Added pr-[70px] so the text stops before hitting the Logo */}
            <div className="flex justify-between items-end mt-auto mb-1 pl-1 pr-[70px]">
              <div className="flex flex-col">
                <span className="text-[7.5px] uppercase tracking-[0.25em] text-white/60 mb-0.5 font-bold drop-shadow-sm">Cardholder</span>
                <span className="font-sans text-[15px] font-bold tracking-[0.1em] text-[#f8f9fa] uppercase truncate max-w-[130px] opacity-95" style={embossedText}>
                  {formattedName}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex flex-col text-[6px] uppercase tracking-[0.2em] text-white/70 font-bold text-right leading-[8px] drop-shadow-sm">
                  <span>Valid</span>
                  <span>Thru</span>
                </div>
                <span className="font-mono text-[15px] tracking-widest text-[#f8f9fa] font-bold opacity-95" style={embossedText}>
                  {dateAdded}
                </span>
              </div>
            </div>
            
            {/* THE LOGO - Pinned to absolute bottom right */}
            <div className="absolute bottom-5 right-5 z-0 pointer-events-none flex items-center drop-shadow-lg opacity-90">
              <div className="w-10 h-10 rounded-full bg-red-500/80 mix-blend-multiply"></div>
              <div className="w-10 h-10 rounded-full bg-yellow-400/80 mix-blend-multiply -ml-4"></div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] font-black tracking-widest text-white/80 uppercase">Vault</span>
            </div>
            
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div onClick={() => handleCardClick(false)} className={cn("absolute inset-0 rounded-2xl flex flex-col overflow-hidden cursor-pointer ring-1 ring-white/20", gradient)} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="absolute inset-0 bg-black/20 pointer-events-none backdrop-blur-[2px]"></div>
          <div className="w-full h-12 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#1a1a1a] mt-5 shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none z-10 border-t border-b border-black"></div>

          <div className="px-5 py-3 flex-1 flex flex-col relative z-10">
            <div className="text-[7px] uppercase tracking-widest text-white/60 w-full pointer-events-none font-bold mb-2">
              Customer Service: +1 (800) VAULT-SECURE
            </div>
            
            <div className="flex w-full h-[42px] relative z-[100] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <div className="flex-1 bg-[#f0f0f0] rounded-l-sm relative overflow-hidden flex items-center px-3 border border-r-0 border-gray-400 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 1px, transparent 1px, transparent 6px)' }}></div>
                <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold absolute top-1 left-2 italic">Authorized Signature</div>
                <span className="font-mono text-slate-800 font-bold tracking-widest text-[13px] select-all relative z-10 mt-3" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                  {password}
                </span>
              </div>
              
              <div onPointerDownCapture={handleCopy} className="w-16 bg-white rounded-r-sm border border-gray-400 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors group/copy relative">
                <div className="absolute -top-4 text-[7px] font-black text-white/80 tracking-widest">CVV</div>
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={16} className="text-slate-400 group-hover/copy:text-blue-600 transition-colors" />}
                {copied && <span className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg font-sans font-medium tracking-normal whitespace-nowrap">Copied!</span>}
              </div>
            </div>
            
            <div className="absolute bottom-4 left-5 w-10 h-7 rounded bg-gradient-to-tr from-pink-400 via-yellow-200 to-cyan-400 opacity-60 mix-blend-overlay shadow-inner pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)' }}></div>

            <div className="mt-auto text-[6.5px] text-white/50 text-center uppercase tracking-widest leading-relaxed pointer-events-none font-bold max-w-[260px] mx-auto opacity-70">
              This card is issued by Vaultify Security. Use constitutes acceptance of terms. If found, please destroy or return to secure location.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
