import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaUpload, FaRedo, FaSync } from 'react-icons/fa';
import Webcam from 'react-webcam';
import type { DisabledFormData } from '../types/disabled-form';
import SectionButtons from './SectionButtons';
import { sectionVariants, transition } from '../../../../config/animations';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';
import { prepareImageFile } from '../utils/formValidation';
import AnimatedFaceIcon from '../../../../components/AnimatedFaceIcon';

interface PhotoCaptureSectionProps {
  formData: DisabledFormData;
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
  formData,
  useCamera,
  toggleCamera,
  capturedImage,
  onImageCapture,
  onFileSelect,
  onPrev,
  onSubmit,
  loading,
}) => {
  const { t } = useTranslationWithFallback('forms/disabled');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Cleanup function for object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (formData.image) {
        try {
          const url = URL.createObjectURL(formData.image);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error with object URL:', error);
        }
      }
    };
  }, [formData.image]);

  const handleToggleCamera = () => {
    setIsProcessingImage(true);

    // When switching from webcam to upload mode, convert the captured image to a File if it exists
    if (useCamera && capturedImage) {
      const fileFromCapturedImage = prepareImageFile(null, capturedImage);
      if (fileFromCapturedImage) {
        onFileSelect(fileFromCapturedImage);
      }
    }

    toggleCamera();
    // Reset processing state after a short delay to allow for smooth transition
    setTimeout(() => setIsProcessingImage(false), 500);
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onImageCapture(imageSrc);
    }
  };

  const retakePhoto = () => {
    onImageCapture(null);
  };

  const toggleCameraFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessingImage(true);
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
    setTimeout(() => setIsProcessingImage(false), 500);
  };

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className="space-y-3 sm:space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold">
        {t('photo.title', "Person's Photo")}
      </h3>
      <p className="text-white/80 text-sm sm:text-base">
        {t(
          'photo.instructions',
          "Please upload a clear photo of the person's face. This will be used for identification purposes."
        )}
      </p>

      <div className="flex flex-col items-center">
        {/* Toggle between upload and camera capture */}
        <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
          <button
            type="button"
            onClick={handleToggleCamera}
            disabled={isProcessingImage}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-purple-600 text-white rounded hover:bg-purple-700 transition-all duration-300 ${
              isProcessingImage ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {useCamera
              ? t('photo.switchToUpload', 'Switch to Upload')
              : t('photo.switchToCamera', 'Switch to Camera')}
          </button>
          <div>
            {useCamera ? (
              <FaCamera className="text-white text-xl sm:text-2xl" />
            ) : (
              <FaUpload className="text-white text-xl sm:text-2xl" />
            )}
          </div>
        </div>

        {!useCamera ? (
          <div className="flex flex-col items-center">
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              {t('photo.uploadImage', 'Upload Image')}
            </label>
            <div
              className="cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <AnimatedFaceIcon
                size="md"
                text={t('photo.clickToUpload', 'Click to Upload')}
              />
              <input
                id="fileInput"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {formData.image && (
              <div className="mt-3 sm:mt-4 flex justify-center">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="max-w-full max-h-48 sm:max-h-64 rounded shadow-md"
                />
              </div>
            )}
          </div>
        ) : (
          // Camera capture section
          <div className="flex flex-col items-center text-white w-full">
            {!capturedImage ? (
              <>
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg overflow-hidden border-2 border-purple-400">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 480,
                      height: 480,
                      facingMode: facingMode,
                    }}
                    className="w-full"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Face alignment guide */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-2 border-purple-400 rounded-full opacity-50"></div>
                    </div>
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M20,20 L20,30 L30,30 M70,30 L80,30 L80,20 M80,80 L80,70 L70,70 M30,70 L20,70 L20,80"
                        stroke="#a855f7"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={toggleCameraFacingMode}
                    className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
                    aria-label="Switch camera"
                  >
                    <FaSync className="text-sm" />
                  </button>
                </div>
                <div className="flex space-x-2 mt-3 sm:mt-4">
                  <button
                    type="button"
                    className="px-4 sm:px-6 py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center text-sm sm:text-base"
                    onClick={captureImage}
                  >
                    <FaCamera className="mr-2" />{' '}
                    {t('photo.capturePhoto', 'Capture Photo')}
                  </button>
                  <button
                    type="button"
                    className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm sm:text-base"
                    onClick={toggleCameraFacingMode}
                  >
                    <FaSync className="mr-2" />{' '}
                    {facingMode === 'user'
                      ? t('photo.switchToBackCamera', 'Back Camera')
                      : t('photo.switchToFrontCamera', 'Front Camera')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg overflow-hidden border-2 border-green-400">
                  <img src={capturedImage} alt="Captured" className="w-full" />
                  <div className="absolute top-2 right-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-green-500 text-white p-2 rounded-full"
                    >
                      ✓
                    </motion.div>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm sm:text-base"
                  onClick={retakePhoto}
                >
                  <FaRedo className="mr-2" />{' '}
                  {t('photo.retakePhoto', 'Retake Photo')}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <SectionButtons onPrev={onPrev} />

      {/* Submit Button */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className={`
            px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold
            flex items-center justify-center
            transition-all duration-300 text-sm sm:text-base
            ${
              loading
                ? 'bg-pink-400 cursor-not-allowed'
                : 'bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-500/30'
            }
            text-white w-full sm:w-auto sm:min-w-[200px]
            relative overflow-hidden
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
                className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
              {t('photo.submit', 'Submit Registration')}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PhotoCaptureSection;
