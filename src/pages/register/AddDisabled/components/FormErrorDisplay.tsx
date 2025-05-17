import React from 'react';
import { motion } from 'framer-motion';
import { errorVariants, transition } from '../../../../config/animations';

interface FormErrorDisplayProps {
  errors: string[];
}

const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <motion.div
      variants={errorVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="bg-red-500/20 p-3 rounded-lg border border-red-500/30"
    >
      <ul className="list-disc pl-5">
        {errors.map((error, index) => (
          <li key={index} className="text-red-200">
            {error}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FormErrorDisplay;
