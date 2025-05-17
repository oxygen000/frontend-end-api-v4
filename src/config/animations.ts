import type { Variants } from 'framer-motion';

// Form animation variants - more polished animations
export const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

// Section animation variants with smoother transitions
export const sectionVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

// Success animation with attention-grabbing effect
export const successVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      scale: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

// Error animation with attention-drawing bounce
export const errorVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

// Progress bar animation
export const progressBarVariants: Variants = {
  hidden: { width: 0 },
  visible: { width: '100%', transition: { duration: 0.7, ease: 'easeOut' } },
};

// Standard transition configuration
export const transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1], // Custom easing for professional smoothness
};

// Enhanced success animation styles
export const successAnimationStyles = {
  container:
    'max-w-2xl mx-auto bg-gradient-to-b from-green-500/30 to-green-600/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-green-300/40 text-white mt-6',
  icon: {
    wrapper:
      'w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30',
    color: 'text-white text-4xl',
  },
  title: 'text-3xl font-bold text-white mb-3 text-center',
  message: 'text-white/90 mb-6 text-center',
  progressBar: {
    container: 'w-full bg-white/20 rounded-full h-2 overflow-hidden',
    indicator: 'bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full',
  },
  subtitle: 'text-center mt-5 text-white/80',
  idContainer: 'mt-6 p-4 bg-white/10 rounded-lg border border-white/20',
  idTitle: 'text-center font-medium text-white/90 mb-1',
  idValue: 'text-center text-xl font-bold',
  idNote: 'text-center text-sm mt-3 text-white/70',
};

// Modal animation for dialogs and popovers
export const modalVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      scale: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.3 } },
};

// Card animation for list items and cards
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
    boxShadow:
      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// List item animation for staggered list entries
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -10, y: 10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

// Page transition animation
export const pageTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Button hover animation - enhanced for better feedback
export const buttonHoverAnimation = {
  scale: 1.03,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: { duration: 0.2 },
};

// Input focus animations
export const inputFocusAnimation = {
  scale: 1.01,
  boxShadow: '0 0 0 2px rgba(236, 72, 153, 0.3)',
  transition: { duration: 0.2 },
};

// Registration button standardized animations
export const registrationButtonAnimation = {
  rest: {
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.25)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: 'easeOut' },
  },
};

// Define animation configs as objects
export const customAnimationConfig = {
  spring: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  delayedAppearance: (delay: number) => ({
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }),
  // Staggered children animation for lists and grids
  staggerChildren: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  // Form element animations
  formElement: {
    initial: { opacity: 0, y: 15 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  },
};
