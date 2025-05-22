import React from 'react';
import { motion } from 'framer-motion';
import { inputFocusAnimation } from '../config/animations';

// Reusable Input Component with enhanced styling and validation
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  className = '',
  disabled = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-white font-medium mb-1.5 text-sm">
        {label}
        {required && <span className="text-pink-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          whileFocus={inputFocusAnimation}
          className={`w-full px-4 py-2.5 
                   rounded-xl 
                   bg-white/10 backdrop-blur-md 
                   border ${error ? 'border-red-400' : 'border-white/30'} 
                   text-white placeholder-white/50
                   focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-pink-400/70'} 
                   transition-all duration-200
                   disabled:opacity-60 disabled:cursor-not-allowed
                   ${type === 'date' ? 'text-white' : ''}
                   shadow-sm`}
          placeholder={placeholder}
        />
        {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
       
      </div>
    </div>
  );
};

export default Input;
