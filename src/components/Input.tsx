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
}) => (
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
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
      {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
      {type === 'date' && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white/40"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  </div>
);

export default Input;
