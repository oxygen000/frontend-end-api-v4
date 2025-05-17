import React from 'react';
import { motion } from 'framer-motion';
import AnimatedFaceIcon from '../../../../components/AnimatedFaceIcon';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface ImageUploaderProps {
  image: File | null;
  onFileSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  onFileSelect,
}) => {
  const { t } = useTranslationWithFallback();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      onFileSelect(file);
    } else if (file) {
      alert('File size exceeds 5MB');
      onFileSelect(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="cursor-pointer"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <AnimatedFaceIcon
          size="md"
          text={t('registration.clickToUpload', 'Click to upload')}
          color="#ffff"
        />
      </div>
      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        className="hidden"
      />

      {/* Image preview */}
      {image && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex justify-center"
        >
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="max-w-full max-h-48 sm:max-h-64 rounded shadow-md"
          />
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;
