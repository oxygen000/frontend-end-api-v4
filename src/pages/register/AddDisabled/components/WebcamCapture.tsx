import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaRedo, FaSync } from 'react-icons/fa';
import Webcam from 'react-webcam';
import { useTranslationWithFallback } from '../../../../hooks/useTranslationWithFallback';

interface WebcamCaptureProps {
  onImageCapture: (imageSrc: string | null) => void;
  capturedImage: string | null;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onImageCapture,
  capturedImage,
}) => {
  const { t } = useTranslationWithFallback();
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Function to capture image from webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onImageCapture(imageSrc);
      }
    }
  };

  // Function to retake photo
  const retakePhoto = () => {
    onImageCapture(null);
  };

  // Function to toggle camera facing mode
  const toggleCameraFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="flex flex-col items-center text-white w-full">
      {!capturedImage ? (
        <>
          <div className="relative w-full max-w-xs sm:max-w-md rounded-lg overflow-hidden border-2 border-pink-400">
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
                <div className="w-48 h-48 sm:w-64 sm:h-64 border-2 border-pink-400 rounded-full opacity-50"></div>
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
            <button
              type="button"
              onClick={toggleCameraFacingMode}
              className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
              aria-label="Switch camera"
            >
              <FaSync className="text-sm" />
            </button>
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center text-sm sm:text-base"
              onClick={captureImage}
            >
              <FaCamera className="mr-2" />{' '}
              {t('registration.capturePhoto', 'Capture Photo')}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm sm:text-base"
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
          <div className="relative w-full max-w-xs sm:max-w-md rounded-lg overflow-hidden border-2 border-green-400">
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
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm sm:text-base"
            onClick={retakePhoto}
          >
            <FaRedo className="mr-2" />{' '}
            {t('registration.retakePhoto', 'Retake Photo')}
          </button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
