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
  if (name.includes('gmail')) return <FaEnvelope className="w-5 h-5 text-white/90" />;
  if (name.includes('google')) return <FaGoogle className="w-5 h-5 text-white/90" />;
  if (name.includes('apple')) return <FaApple className="w-5 h-5 text-white/90" />;
  if (name.includes('netflix')) return <SiNetflix className="w-5 h-5 text-white/90" />;
  if (name.includes('amazon')) return <FaAmazon className="w-5 h-5 text-white/90" />;
  if (name.includes('facebook')) return <FaFacebook className="w-5 h-5 text-white/90" />;
  if (name.includes('twitter') || name === 'x') return <FaTwitter className="w-5 h-5 text-white/90" />;
  if (name.includes('github')) return <FaGithub className="w-5 h-5 text-white/90" />;
  if (name.includes('spotify')) return <FaSpotify className="w-5 h-5 text-white/90" />;
  if (name.includes('microsoft')) return <FaMicrosoft className="w-5 h-5 text-white/90" />;
  if (name.includes('linkedin')) return <FaLinkedin className="w-5 h-5 text-white/90" />;
  if (name.includes('discord')) return <FaDiscord className="w-5 h-5 text-white/90" />;
  return <Key className="w-5 h-5 text-white/90" />;
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

  return (
    <div className="relative group w-[340px] h-[215px] transition-transform duration-300 hover:-translate-y-2" style={{ perspective: '1000px' }}>
      <motion.div
        className="w-full h-full relative rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)] transition-shadow duration-300"
        initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div onClick={() => handleCardClick(true)} className={cn("absolute inset-0 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer ring-1 ring-white/10", gradient)} style={{ backfaceVisibility: 'hidden' }}>
          
          {/* REALISTIC LIGHTING GLARE */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/20 to-transparent opacity-50 pointer-events-none mix-blend-overlay"></div>
          
          {/* DIAGONAL SHINE (Moves on hover) */}
          <div className="absolute -inset-[100%] bg-gradient-to-br from-transparent via-white/30 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

          {/* EDIT MODE OVERLAY */}
          {isEditMode && (
            <div className="absolute inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-indigo-500 rounded-2xl animate-in fade-in duration-200">
              <div className="bg-indigo-500 p-4 rounded-full shadow-lg mb-2"><Edit2 size={24} className="text-white" /></div>
              <span className="text-white font-bold tracking-wide">Click to Edit</span>
            </div>
          )}

          <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
            
            {/* TOP HEADER */}
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                {getServiceIcon(website)}
                <span className="text-[13px] font-extrabold tracking-widest text-white drop-shadow-md uppercase opacity-90">{website}</span>
              </div>
              
              {/* DELETE BUTTON */}
              {!isEditMode && (
                <button 
                  onPointerDownCapture={(e) => { e.stopPropagation(); onDelete(id); }}
                  className="pointer-events-auto p-2 bg-black/30 hover:bg-red-500 rounded-full text-white/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100 border border-white/20 backdrop-blur-sm cursor-pointer shadow-lg z-50"
                  title="Delete Password"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            {/* REALISTIC CHIP & CONTACTLESS */}
            <div className="flex flex-col mt-4">
              <div className="flex items-center space-x-5 mb-3">
                {/* Microchip */}
                <div className="w-11 h-8 rounded-md bg-gradient-to-br from-[#e6c27a] via-[#ffd700] to-[#c59b27] p-[1px] shadow-sm relative overflow-hidden opacity-90">
                  <div className="absolute inset-[1px] rounded-[5px] bg-gradient-to-br from-[#ffe082] to-[#ffca28] border border-yellow-700/30"></div>
                  {/* Chip circuitry lines */}
                  <div className="absolute top-[30%] left-0 w-full h-[1px] bg-yellow-900/30"></div>
                  <div className="absolute top-[60%] left-0 w-full h-[1px] bg-yellow-900/30"></div>
                  <div className="absolute top-0 left-[35%] w-[1px] h-full bg-yellow-900/30"></div>
                  <div className="absolute top-0 right-[35%] w-[1px] h-full bg-yellow-900/30"></div>
                  <div className="absolute top-[20%] left-[25%] right-[25%] bottom-[20%] border rounded-sm border-yellow-900/20"></div>
                </div>
                {/* Contactless Icon */}
                <Wifi size={26} className="text-white/60 rotate-90" strokeWidth={2} />
              </div>
              
              {/* EMBOSSED CARD NUMBERS */}
              <div className="font-mono text-[23px] tracking-[6px] text-gray-100 h-[33px] flex items-center"
                   style={{ textShadow: '-1px -1px 0 rgba(255,255,255,0.2), 1px 1px 0 rgba(0,0,0,0.6)' }}>
                •••• •••• •••• ••••
              </div>
            </div>

            {/* CARDHOLDER & EXPIRY */}
            <div className="flex justify-between items-end mt-1">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/50 mb-0.5 font-semibold">Cardholder Name</span>
                <span className="font-sans text-[15px] font-bold tracking-widest text-white/90 uppercase truncate max-w-[180px]" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
                  {username.split('@')[0]} {/* Looks more realistic to show name instead of full email */}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex space-x-2 items-center text-[7px] uppercase tracking-[0.2em] text-white/50 mb-0.5 font-bold">
                  <span className="flex flex-col leading-[8px] text-right"><span>Valid</span><span>Thru</span></span>
                  <span className="text-lg leading-none">▶</span>
                </div>
                <span className="font-mono text-sm tracking-widest text-white/90" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>{dateAdded}</span>
              </div>
            </div>
            
            {/* REALISTIC NETWORK LOGO (Mastercard Style) */}
            <div className="absolute bottom-5 right-5 z-0 pointer-events-none flex">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm mix-blend-overlay"></div>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm mix-blend-overlay -ml-4"></div>
            </div>
            
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div onClick={() => handleCardClick(false)} className={cn("absolute inset-0 rounded-2xl flex flex-col overflow-hidden cursor-pointer ring-1 ring-white/10", gradient)} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

          {/* MATTE MAGNETIC STRIPE */}
          <div className="w-full h-12 bg-[#1a1a1a] mt-6 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] pointer-events-none z-10 border-t border-b border-black/50"></div>

          <div className="px-6 py-4 flex-1 flex flex-col relative z-10">
            <div className="text-[9px] uppercase tracking-widest text-white/60 mb-1 text-right w-full pointer-events-none font-bold">Authorized Signature</div>
            
            {/* SECURE SIGNATURE STRIP (COPY BUTTON) */}
            <div onPointerDownCapture={handleCopy} className="w-full h-10 bg-[#f8f9fa] hover:bg-white rounded flex items-center justify-between px-3 relative shadow-inner cursor-pointer group/copy transition-colors z-[100]" title="Click to copy password">
              
              {/* Paper Texture Pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 4px)' }}></div>
              
              {/* Password text looks like ink printed on the signature strip */}
              <span className="font-mono text-slate-800 font-bold tracking-widest text-sm select-all relative z-10 pointer-events-none" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                {password}
              </span>
              
              <div className="relative z-10 flex items-center text-slate-400 group-hover/copy:text-blue-600 transition-colors pointer-events-none">
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2.5 py-1 rounded shadow-lg pointer-events-none font-sans font-medium tracking-normal">Copied!</span>}
              </div>
            </div>
            
            {/* HOLOGRAM STICKER (Back) */}
            <div className="absolute bottom-5 left-6 w-8 h-6 rounded bg-gradient-to-tr from-pink-300 via-purple-300 to-cyan-300 opacity-40 mix-blend-overlay pointer-events-none"></div>

            <div className="mt-auto text-[7.5px] text-white/50 text-center uppercase tracking-widest leading-relaxed pointer-events-none font-medium max-w-[280px] mx-auto">
              This card remains the property of Vaultify. Misuse of this card is governed by the terms of the credential agreement. If found, destroy immediately.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
