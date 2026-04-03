import React, { useState, useEffect } from 'react';
import { X, Save, Lock, User, Globe, AlertCircle, Palette } from 'lucide-react';
import { cn } from '../utils/cn';

export interface PasswordData {
  id: string;
  website: string;
  username: string;
  password: string;
  dateAdded: string;
  gradient: string;
}

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Notice we now pass the 'id' and 'gradient' to support Editing and Colors!
  onSave: (data: Omit<PasswordData, 'dateAdded'>) => void; 
  editingPassword?: PasswordData | null; // NEW: Receives data if we are editing
}

// Your beautiful premium gradients!
const GRADIENTS = [
  'bg-gradient-to-br from-gray-900 via-black to-gray-800', // Midnight Black
  'bg-gradient-to-tr from-blue-900 via-blue-800 to-blue-950', // Royal Blue
  'bg-gradient-to-bl from-slate-300 via-gray-400 to-slate-500', // Titanium Silver
  'bg-gradient-to-r from-amber-200 via-yellow-400 to-yellow-600', // Gold
  'bg-gradient-to-br from-rose-900 via-red-900 to-black', // Ruby Red
  'bg-gradient-to-tr from-emerald-800 via-teal-900 to-emerald-950', // Emerald
  'bg-gradient-to-tl from-indigo-900 via-purple-900 to-black', // Deep Purple
];

export const AddPasswordModal: React.FC<AddPasswordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPassword,
}) => {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [error, setError] = useState('');

  // NEW: When the modal opens, check if we are editing or adding new!
  useEffect(() => {
    if (editingPassword) {
      // We are EDITING: Pre-fill all the fields with the existing data
      setWebsite(editingPassword.website);
      setUsername(editingPassword.username);
      setPassword(editingPassword.password);
      setSelectedGradient(editingPassword.gradient || GRADIENTS[0]);
    } else {
      // We are ADDING NEW: Clear the fields and pick a random default color
      setWebsite('');
      setUsername('');
      setPassword('');
      setSelectedGradient(GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]);
    }
    setError('');
  }, [editingPassword, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!website || !username || !password) {
      setError('Please fill out all fields.');
      return;
    }
    
    // Save the data (If editing, pass the existing ID. If new, pass empty string)
    onSave({ 
      id: editingPassword ? editingPassword.id : '',
      website, 
      username, 
      password,
      gradient: selectedGradient
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Lock className="mr-2 text-indigo-400" size={20} />
              {/* Dynamic Title */}
              {editingPassword ? 'Edit Credentials' : 'Add Credentials'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 text-sm text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label htmlFor="website" className="text-sm font-medium text-slate-300">
                Website / App Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe size={16} className="text-slate-500" />
                </div>
                <input
                  id="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. Netflix, Google"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-slate-300">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow font-mono"
                />
              </div>
            </div>

            {/* NEW: THE COLOR PICKER! */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Palette size={14} className="text-slate-400" />
                Card Color
              </label>
              <div className="flex gap-3 justify-center bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
                {GRADIENTS.map((gradient) => (
                  <button
                    key={gradient}
                    type="button"
                    onClick={() => setSelectedGradient(gradient)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all duration-200 border-2",
                      gradient, // Applies your specific tailwind color class
                      selectedGradient === gradient 
                        ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
                    )}
                    title="Select color"
                  />
                ))}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Save size={16} />
                {/* Dynamic Button Text */}
                <span>{editingPassword ? 'Save Changes' : 'Save Securely'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
