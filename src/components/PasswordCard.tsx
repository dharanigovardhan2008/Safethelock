import React, { useState } from 'react';
import { Wifi, Copy, Check, Trash2, Key, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { FaGoogle, FaApple, FaAmazon, FaFacebook, FaTwitter, FaGithub, FaSpotify, FaMicrosoft, FaLinkedin, FaDiscord, FaEnvelope } from 'react-icons/fa';
import { SiNetflix } from 'react-icons/si';

interface PasswordCardProps {
  id: string; website: string; username: string; password: string; dateAdded: string; gradient: string;
  isEditMode: boolean; onDelete: (id: string) => void; onEdit: (id: string) => void;
}

const getServiceIcon = (website: string) => {
  const name = website.toLowerCase();
  if (name.includes('gmail')) return <FaEnvelope className="w-6 h-6 text-white" />;
  if (name.includes('google')) return <FaGoogle className="w-6 h-6 text-white" />;
  if (name.includes('apple')) return <FaApple className="w-6 h-6 text-white" />;
  if (name.includes('netflix')) return <SiNetflix className="w-6 h-6 text-white" />;
  if (name.includes('amazon')) return <FaAmazon className="w-6 h-6 text-white" />;
  return <Key className="w-6 h-6 text-white" />;
};

export const PasswordCard: React.FC<PasswordCardProps> = ({
  id, website, username, password, dateAdded, gradient, isEditMode, onDelete, onEdit
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleCardClick = (flipTo: boolean) => {
    if (isEditMode) onEdit(id);
    else setIsFlipped(flipTo);
  };

  return (
    <div className="relative group w-[340px] h-[215px] transition-transform duration-300 hover:-translate-y-2" style={{ perspective: '1000px' }}>
      <motion.div
        className="w-full h-full relative rounded-2xl shadow-2xl transition-shadow duration-300"
        initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT SIDE */}
        <div onClick={() => handleCardClick(true)} className={cn("absolute inset-0 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer", gradient)} style={{ backfaceVisibility: 'hidden' }}>
          
          {isEditMode && (
            <div className="absolute inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-indigo-500 rounded-2xl">
              <div className="bg-indigo-500 p-4 rounded-full shadow-lg mb-2"><Edit2 size={24} className="text-white" /></div>
              <span className="text-white font-bold tracking-wide">Click to Edit</span>
            </div>
          )}

          <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-full"><span className="text-sm font-bold text-white uppercase">{website}</span></div>
              {!isEditMode && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(id); }} className="pointer-events-auto p-2 bg-black/20 hover:bg-red-500 rounded-full text-white/70 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-50">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <Wifi size={24} className="text-white/70 rotate-90 mb-2" strokeWidth={2.5} />
              <div className="font-mono text-[22px] tracking-[4px] text-white/95">•••• •••• •••• ••••</div>
            </div>

            <div className="flex justify-between items-end mt-2">
              <div className="flex flex-col"><span className="text-[9px] uppercase text-white/60 mb-1">Cardholder</span><span className="font-medium text-white/90 truncate max-w-[180px]">{username}</span></div>
              <div className="flex flex-col items-center"><span className="text-[8px] uppercase text-white/60 mb-0.5">Valid Thru</span><span className="font-mono text-base text-white/90">{dateAdded}</span></div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div onClick={() => handleCardClick(false)} className={cn("absolute inset-0 rounded-2xl flex flex-col overflow-hidden cursor-pointer", gradient)} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="w-full h-12 bg-gray-900/90 mt-6 pointer-events-none z-10"></div>
          <div className="px-6 py-4 flex-1 flex flex-col relative z-10">
            <div className="text-[10px] uppercase text-white/70 mb-1 text-right w-full pointer-events-none">Authorized Signature</div>
            
            <div onClick={handleCopy} className="w-full h-10 bg-white/90 hover:bg-white rounded flex items-center justify-between px-3 relative cursor-pointer z-[100]">
              <span className="font-mono text-slate-800 font-bold text-sm pointer-events-none">{password}</span>
              <div className="relative z-10 flex items-center text-slate-500 pointer-events-none">
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded">Copied!</span>}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
