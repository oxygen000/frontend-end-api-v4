import React from 'react';
import { motion } from 'framer-motion';
import { inputFocusAnimation } from '../config/animations';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  className = '',
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}) => (
  <div className={`mb-6 ${className}`}>
    <label className="block text-white font-medium mb-1.5 text-sm">
      {label}
      {required && <span className="text-pink-400 ml-1">*</span>}
    </label>
    <div className="relative">
      <motion.textarea
        name={name}
        value={value}
        onChange={onChange}
        whileFocus={inputFocusAnimation}
        disabled={disabled}
        className={`w-full p-4 
                 rounded-xl 
                 bg-white/10 backdrop-blur-md 
                 border ${error ? 'border-red-400' : 'border-white/30'} 
                 text-white placeholder-white/70 
                 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-pink-400/70'} 
                 resize-none 
                 transition-all duration-200
                 disabled:opacity-60 disabled:cursor-not-allowed
                 shadow-sm`}
        placeholder={`Enter ${label.toLowerCase()}`}
        rows={4}
      />
      {error && (
        <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>
      )}
    </div>
  </div>
);

export default Textarea;