import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaUpload } from 'react-icons/fa';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';
import WebcamCapture from './WebcamCapture';
import ImageUploader from './ImageUploader';

interface PhotoCaptureSectionProps {
  personDetails: DisabledFormData;
  useCamera: boolean;
  toggleCamera: () => void;
  capturedImage: string | null;
  onImageCapture: (imageSrc: string | null) => void;
  onFileSelect: (file: File | null) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const PhotoCaptureSection: React.FC<PhotoCaptureSectionProps> = ({
  personDetails,
  useCamera,
  toggleCamera,
  capturedImage,
  onImageCapture,
  onFileSelect,
  onPrev,
  onSubmit,
  loading,
}) => {
  const { t } = useTranslationWithFallback();

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold">
        {t('registration.photo', "Person's Photo")}
      </h3>
      <p className="text-white/80 text-sm sm:text-base">
        {t(
          'registration.photoInstructions',
          "Please upload a clear photo of the person's face. This will be used for identification purposes."
        )}
      </p>

      {/* Toggle between upload and camera capture */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          type="button"
          onClick={toggleCamera}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white text-sm sm:text-base rounded hover:bg-purple-700"
        >
          {useCamera
            ? t('registration.switchToUpload', 'Switch to Upload')
            : t('registration.switchToCamera', 'Switch to Camera')}
        </button>
        <div>
          {useCamera ? (
            <FaCamera className="text-white text-xl sm:text-2xl" />
          ) : (
            <FaUpload className="text-white text-xl sm:text-2xl" />
          )}
        </div>
      </div>

      {/* Upload image option */}
      {!useCamera ? (
        <ImageUploader
          image={personDetails.image}
          onFileSelect={onFileSelect}
        />
      ) : (
        // Camera capture section
        <WebcamCapture
          onImageCapture={onImageCapture}
          capturedImage={capturedImage}
        />
      )}

      <SectionButtons onPrev={onPrev} />

      {/* Submit Button */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className={`
            w-full sm:w-auto px-6 py-3 rounded-lg font-semibold
            flex items-center justify-center
            transition-all duration-300
            ${
              loading
                ? 'bg-pink-400 cursor-not-allowed'
                : 'bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-500/30'
            }
            text-white min-w-[180px] sm:min-w-[200px]
            relative overflow-hidden text-sm sm:text-base
          `}
        >
          {loading && (
            <motion.div
              className="absolute inset-0 bg-pink-500 opacity-30"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
            />
          )}

          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12l2 2 4-4m6 2a9 9 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t('common.loading', 'Processing...')}
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t('registration.submitRegistration', 'Submit Registration')}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PhotoCaptureSection;
