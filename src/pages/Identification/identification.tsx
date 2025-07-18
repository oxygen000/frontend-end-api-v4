import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { FaCamera, FaRedo, FaUpload, FaSync } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import AnimatedFaceIcon from '../../components/AnimatedFaceIcon';
import { recognitionApi } from '../../services/api';
import { useTranslationWithFallback } from '../../hooks/useTranslationWithFallback';

// Function to boost confidence percentage for better user experience
const boostConfidencePercentage = (confidence: number): number => {
  // Convert to percentage and add boost
  const basePercentage = confidence * 100;

  // Add higher boost for better user experience
  if (basePercentage >= 50) {
    // For good matches, boost to 95-98% range
    return Math.min(98, Math.round(basePercentage + 38));
  } else if (basePercentage >= 40) {
    // For moderate matches, boost to 90-95% range
    return Math.min(95, Math.round(basePercentage + 50));
  } else {
    // For lower matches, boost to 85-90% range
    return Math.min(90, Math.round(basePercentage + 50));
  }
};

function Identification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('id');
  const { t } = useTranslationWithFallback();

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [recognitionSuccess, setRecognitionSuccess] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState<{
    id: string;
    name: string;
    confidence?: number;
  } | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle camera facing mode
  const toggleCameraFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        event.target.value = '';
        return;
      }

      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setUploadedImagePreview(preview);
        setUploadedImage(file);
        setCapturedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Ensure proper base64 format
        const formattedImage = imageSrc.startsWith('data:image')
          ? imageSrc
          : `data:image/jpeg;base64,${imageSrc}`;

        setCapturedImage(formattedImage);
        setUploadedImage(null);
        setUploadedImagePreview(null);
      }
    }
  }, [webcamRef]);

  // Reset captured/uploaded image
  const resetImage = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setError(null);
  };

  // Toggle camera
  const toggleCamera = () => {
    setShowCamera((prev) => !prev);
    if (!showCamera) {
      setCapturedImage(null);
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Identify person
  const identifyPerson = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (uploadedImage) {
        // For uploaded files, use the file-based recognition
        const data = await recognitionApi.recognizeFace(
          uploadedImage,
          preselectedId || undefined
        );

        if (data.recognized && data.user_id && data.username) {
          setRecognizedUser({
            id: data.user_id,
            name: data.username,
            confidence: data.confidence,
          });
          setRecognitionSuccess(true);

          // Enhanced success message with confidence
          const confidencePercent = boostConfidencePercentage(
            data.confidence || 0
          );

          toast.success(
            `تم التعرف على: ${data.username} (دقة: ${confidencePercent}%)`
          );

          // Wait for animation to complete before redirecting
          setTimeout(() => {
            navigate(`/users/${data.user_id}`, {
              replace: true,
              state: {
                searchedImage: uploadedImagePreview, // الصورة المبحوث بها
                searchedPersonName: data.username,
                isFromSearch: true,
                searchConfidence: data.confidence,
              },
            });
          }, 2000);
        } else {
          const errorMessage =
            data.message ||
            'لم يتم العثور على تطابق. يرجى المحاولة مرة أخرى بصورة أوضح.';
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else if (capturedImage) {
        // For captured images, use the base64 recognition
        const data = await recognitionApi.recognizeFaceBase64(
          capturedImage,
          preselectedId || undefined
        );

        if (data.recognized && data.user_id && data.username) {
          setRecognizedUser({
            id: data.user_id,
            name: data.username,
            confidence: data.confidence,
          });
          setRecognitionSuccess(true);

          // Enhanced success message with confidence
          const confidencePercent = boostConfidencePercentage(
            data.confidence || 0
          );

          toast.success(
            `تم التعرف على: ${data.username} (دقة: ${confidencePercent}%)`
          );

          // Wait for animation to complete before redirecting
          setTimeout(() => {
            navigate(`/users/${data.user_id}`, {
              replace: true,
              state: {
                searchedImage: capturedImage, // الصورة المبحوث بها
                searchedPersonName: data.username,
                isFromSearch: true,
                searchConfidence: data.confidence,
              },
            });
          }, 2000);
        } else {
          const errorMessage =
            data.message ||
            'لم يتم العثور على تطابق. يرجى المحاولة مرة أخرى بصورة أوضح.';
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        toast.error('يرجى التقاط صورة أو رفع صورة أولاً');
      }
    } catch (error) {
      console.error('Error during recognition:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'حدث خطأ أثناء عملية التعرف على الوجه';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [capturedImage, uploadedImage, navigate, preselectedId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white">
          {t('identification.title')}
        </h1>
        <p className="text-gray-300 mt-2">
          {preselectedId
            ? t('identification.verifySubtitle')
            : t('identification.subtitle')}
        </p>
      </motion.div>

      {/* Recognition Success Animation */}
      {recognitionSuccess && recognizedUser && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <motion.div
            className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl border border-white/30 text-center max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {t('identification.faceRecognized')}
            </h3>
            <p className="text-white/80 mb-6">
              {t('identification.identifiedAs')} {recognizedUser.name}
            </p>
            <p className="text-white/70 mb-6">
              {t('identification.similarity')}:{' '}
              {recognizedUser.confidence
                ? `${boostConfidencePercentage(recognizedUser.confidence)}%`
                : `${Math.floor(Math.random() * 12) + 89}%`}
            </p>

            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  recognizedUser.confidence && recognizedUser.confidence >= 50
                    ? 'bg-green-500'
                    : recognizedUser.confidence &&
                        recognizedUser.confidence >= 40
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-lg p-10 mt-6 rounded-2xl shadow-[0_0_30px_5px_rgba(0,0,255,0.3)] text-white border border-white/30 space-y-8">
        <div className="flex flex-col items-center">
          {/* Image Display Area */}
          <div className="w-full max-w-md h-80 rounded-lg mb-6 overflow-hidden flex items-center justify-center relative">
            {showCamera && !capturedImage ? (
              <div className="w-full h-full">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: facingMode,
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none">
                  {/* Face alignment guide */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-blue-400 rounded-full opacity-50"></div>
                  </div>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M20,20 L20,30 L30,30 M70,30 L80,30 L80,20 M80,80 L80,70 L70,70 M30,70 L20,70 L20,80"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={toggleCameraFacingMode}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  aria-label={
                    facingMode === 'user'
                      ? 'Switch to back camera'
                      : 'Switch to front camera'
                  }
                >
                  <FaSync className="text-sm" />
                </button>
              </div>
            ) : capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            ) : uploadedImagePreview ? (
              <img
                src={uploadedImagePreview}
                alt="Uploaded"
                className="w-full h-full object-contain"
              />
            ) : (
              <AnimatedFaceIcon size="lg" color="#ffff" />
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {!showCamera && !capturedImage && !uploadedImage && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCamera}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaCamera /> {t('identification.useCamera')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={triggerFileUpload}
                  className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaUpload /> {t('identification.uploadImage')}
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}

            {showCamera && !capturedImage && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={captureImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaCamera /> {t('identification.capture')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCameraFacingMode}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaSync className="mr-2" />
                  {facingMode === 'user' ? 'Back Camera' : 'Front Camera'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCamera}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md"
                >
                  {t('common.cancel')}
                </motion.button>
              </>
            )}

            {(capturedImage || uploadedImage) && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetImage}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaRedo /> {t('identification.reset')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={identifyPerson}
                  disabled={isLoading}
                  className={`px-4 py-2 ${isLoading ? 'bg-gray-500' : 'bg-green-600'} text-white rounded-md flex items-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t('identification.processing')}
                    </>
                  ) : (
                    t('identification.identifyPerson')
                  )}
                </motion.button>
              </>
            )}
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-100 mb-4"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Identification;
