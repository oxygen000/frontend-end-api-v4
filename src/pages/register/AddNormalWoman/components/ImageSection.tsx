import React from 'react';
import type { Ref } from 'react';
import { motion } from 'framer-motion';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { FaCamera, FaUpload, FaRedo, FaSync } from 'react-icons/fa';
import Webcam from 'react-webcam';
import AnimatedFaceIcon from '../../../../components/AnimatedFaceIcon';

interface ImageSectionProps {
  formData: FormData;
  capturedImage: string | null;
  webcamRef: Ref<Webcam | null>;
  facingMode: 'user' | 'environment';
  handleToggleCamera: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  captureImage: () => void;
  toggleCameraFacingMode: () => void;
  retakePhoto: () => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  prevSection: () => void;
  t: (key: string, fallback: string) => string;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  formData,
  capturedImage,
  webcamRef,
  facingMode,
  handleToggleCamera,
  handleFileChange,
  captureImage,
  toggleCameraFacingMode,
  retakePhoto,
  handleFormSubmit,
  loading,
  prevSection,
  t,
}) => {
  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-3 sm:space-y-4"
    >
      {/* Toggle between upload and camera capture */}
      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
        <button
          type="button"
          onClick={handleToggleCamera}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm sm:text-base"
        >
          {formData.useCamera
            ? t('registration.switchToUpload', 'Switch to Upload')
            : t('registration.switchToCapture', 'Switch to Capture')}
        </button>
        <div>
          {formData.useCamera ? (
            <FaCamera className="text-white text-xl sm:text-2xl" />
          ) : (
            <FaUpload className="text-white text-xl sm:text-2xl" />
          )}
        </div>
      </div>

      {/* Upload image option */}
      {!formData.useCamera ? (
        <div className="flex flex-col items-center">
          <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
            {t('registration.uploadImage', 'Upload Image')}
          </label>
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
            name="image"
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
            className="hidden"
          />
        </div>
      ) : (
        // Camera capture section
        <div className="flex flex-col items-center text-white w-full">
          {!capturedImage ? (
            <>
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg overflow-hidden border-2 border-pink-400">
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
                    <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64  border-pink-400  opacity-50"></div>
                  </div>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M20,20 L20,30 L30,30 M70,30 L80,30 L80,20 M80,80 L80,70 L70,70 M30,70 L20,70 L20,80"
                      stroke="#ec4899"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                
              </div>

              <div className="flex space-x-2 mt-3 sm:mt-4">
                <button
                  type="button"
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center text-sm sm:text-base"
                  onClick={captureImage}
                >
                  <FaCamera className="mr-2" />{' '}
                  {t('registration.capturePhoto', 'Capture Photo')}
                </button>
                <button
                  type="button"
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm sm:text-base"
                  onClick={toggleCameraFacingMode}
                >
                  <FaSync className="mr-2" />{' '}
                  {facingMode === 'user'
                    ? t('registration.switchToBackCamera', 'Back Camera')
                    : t('registration.switchToFrontCamera', 'Front Camera')}
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
                {t('registration.retakePhoto', 'Retake Photo')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Image preview - only show for uploaded images */}
      {formData.image && !formData.useCamera && (
        <div className="mt-3 sm:mt-4 flex justify-center">
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Preview"
            className="max-w-full max-h-48 sm:max-h-64 rounded shadow-md"
          />
        </div>
      )}

      <SectionButtons onPrev={prevSection} />

      {/* Submit Button */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center">
        <button
          type="submit"
          disabled={loading}
          onClick={handleFormSubmit}
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
                  d="M4 12l2 2 4-4m6 2a9 9 0 118-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 114 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
              {t('registration.submitRegistration', 'Submit Registration')}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ImageSection;
