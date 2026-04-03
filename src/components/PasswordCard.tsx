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
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const getServiceIcon = (website: string) => {
  const name = website.toLowerCase();
  if (name.includes('gmail')) return <FaEnvelope className="w-6 h-6 text-white" />;
  if (name.includes('google')) return <FaGoogle className="w-6 h-6 text-white" />;
  if (name.includes('apple')) return <FaApple className="w-6 h-6 text-white" />;
  if (name.includes('netflix')) return <SiNetflix className="w-6 h-6 text-white" />;
  if (name.includes('amazon')) return <FaAmazon className="w-6 h-6 text-white" />;
  if (name.includes('facebook')) return <FaFacebook className="w-6 h-6 text-white" />;
  if (name.includes('twitter') || name === 'x') return <FaTwitter className="w-6 h-6 text-white" />;
  if (name.includes('github')) return <FaGithub className="w-6 h-6 text-white" />;
  if (name.includes('spotify')) return <FaSpotify className="w-6 h-6 text-white" />;
  if (name.includes('microsoft')) return <FaMicrosoft className="w-6 h-6 text-white" />;
  if (name.includes('linkedin')) return <FaLinkedin className="w-6 h-6 text-white" />;
  if (name.includes('discord')) return <FaDiscord className="w-6 h-6 text-white" />;
  return <Key className="w-6 h-6 text-white" />;
};

export const PasswordCard: React.FC<PasswordCardProps> = ({
  id, website, username, password, dateAdded, gradient, onDelete, onEdit
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="relative group w-[340px] h-[215px] transition-transform duration-300 hover:-translate-y-2" style={{ perspective: '1000px' }}>
      <motion.div
        className="w-full h-full relative rounded-2xl shadow-2xl group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-shadow duration-300"
        initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className={cn("absolute inset-0 rounded-2xl overflow-hidden", gradient)} style={{ backfaceVisibility: 'hidden' }}>
          
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>
          <div className="absolute -inset-[100%] bg-gradient-to-br from-transparent via-white/20 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

          {/* INVISIBLE FLIP TRIGGER - Clicking the card background flips it */}
          <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsFlipped(true)} />

          {/* FRONT CONTENT (z-10) */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                {getServiceIcon(website)}
                <span className="text-sm font-bold tracking-wider text-white/90 drop-shadow-md uppercase">{website}</span>
              </div>
              
              {/* DELETE BUTTON (Front) - Re-enabled pointer events so it's clickable */}
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                className="pointer-events-auto p-2 bg-black/20 hover:bg-red-500/80 rounded-full text-white/70 hover:text-white transition-colors opacity-0 group-hover:opacity-100 border border-white/10 backdrop-blur-sm cursor-pointer z-50"
                title="Delete Password"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Chip & Masked Password */}
            <div className="flex flex-col mt-2">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-9 rounded-md bg-gradient-to-br from-[#ffd700] via-[#ffb300] to-[#b8860b] p-[1px] shadow-sm relative overflow-hidden">
                  <div className="absolute inset-[1px] rounded-[4px] bg-gradient-to-br from-[#ffe082] to-[#ffca28]"></div>
                  <div className="absolute top-[25%] left-0 w-full h-[1px] bg-yellow-900/40"></div>
                  <div className="absolute top-[50%] left-0 w-full h-[1px] bg-yellow-900/40"></div>
                  <div className="absolute top-[75%] left-0 w-full h-[1px] bg-yellow-900/40"></div>
                  <div className="absolute top-0 left-[30%] w-[1px] h-full bg-yellow-900/40"></div>
                  <div className="absolute top-0 left-[70%] w-[1px] h-full bg-yellow-900/40"></div>
                  <div className="absolute top-[30%] left-[35%] right-[35%] bottom-[30%] border border-yellow-900/40 rounded-sm"></div>
                </div>
                <Wifi size={24} className="text-white/70 rotate-90" strokeWidth={2.5} />
              </div>
              <div className="font-mono text-[22px] tracking-[4px] text-white/95 drop-shadow-md h-[33px] flex items-center">•••• •••• •••• ••••</div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-2">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/60 mb-1">Cardholder Name</span>
                <span className="font-sans font-medium tracking-wide text-white/90 truncate max-w-[180px]">{username}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex space-x-2 items-center text-[8px] uppercase tracking-widest text-white/60 mb-0.5"><span>Valid</span><span>Thru</span></div>
                <span className="font-mono text-base tracking-widest text-white/90">{dateAdded}</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div className={cn("absolute inset-0 rounded-2xl flex flex-col overflow-hidden", gradient)} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          
          {/* INVISIBLE FLIP TRIGGER - Clicking the card background flips it back */}
          <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsFlipped(false)} />

          {/* Magnetic Stripe */}
          <div className="w-full h-12 bg-gray-900/90 mt-6 shadow-inner pointer-events-none z-10"></div>

          <div className="px-6 py-4 flex-1 flex flex-col relative z-10 pointer-events-none">
            <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1 text-right w-full">Authorized Signature</div>
            
            {/* COPY PASSWORD BAR - Re-enabled pointer events */}
            <div onClick={handleCopy} className="pointer-events-auto w-full h-10 bg-white/90 hover:bg-white rounded flex items-center justify-between px-3 relative shadow-inner cursor-pointer group/copy transition-colors z-50" title="Click to copy password">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
              <span className="font-mono text-slate-800 font-bold tracking-wider text-sm select-all relative z-10">{password}</span>
              <div className="relative z-10 flex items-center text-slate-500 group-hover/copy:text-indigo-600 transition-colors">
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none">Copied!</span>}
              </div>
            </div>

            {/* EDIT BUTTON (Back) - Re-enabled pointer events */}
            <div className="flex justify-end mt-4 z-50">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(id); }} 
                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-indigo-500 rounded-lg text-white/90 text-xs font-semibold transition-colors border border-white/20 shadow-lg cursor-pointer" 
                title="Edit Password"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
            
            <div className="mt-auto text-[8px] text-white/50 text-center uppercase tracking-widest leading-relaxed">
              This card remains the property of Vaultify. Use of this card is governed by the terms and conditions of the credential agreement.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
