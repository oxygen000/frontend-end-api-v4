import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { errorVariants, transition } from '../../../config/animations';
import SuccessAnimation from '../../../components/SuccessAnimation';
import { useTranslationWithFallback } from '../../../hooks/useTranslationWithFallback';

// Import components and utilities
import BasicInfoSection from './components/BasicInfoSection';
import GuardianInfoSection from './components/GuardianInfoSection';
import DisappearanceDetailsSection from './components/DisappearanceDetailsSection';
import ImageSection from './components/ImageSection';
import { validateForm } from './utils/FormValidation';
import { submitChildForm } from './utils/DirectSubmission';
import type { FormData } from './types/types';
import { initialFormData } from './types/types';

function AddNormalChild() {
  const { t } = useTranslationWithFallback();
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, ] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Toggle camera/upload mode
  const handleToggleCamera = () => {
    setFormData((prev) => ({
      ...prev,
      useCamera: !prev.useCamera,
      image: null,
    }));
    setCapturedImage(null);
  };

  // Capture image from webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
      setCapturedImage(imageSrc);

      // Convert the captured image to a File object for API submission
      if (imageSrc) {
        // Convert base64 to blob
        const byteString = atob(imageSrc.split(',')[1]);
        const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'captured-image.jpg', {
          type: 'image/jpeg',
        });

        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
        }
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setCapturedImage(null);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    } else if (file) {
      setFormErrors(['File size exceeds 5MB']);
    }
  };

  // Unified validation and section navigation
  const validateAndProceed = () => {
    const errors = validateForm(formData, currentSection, capturedImage, t);
    setFormErrors(errors);

    if (errors.length > 0) {
      setTimeout(() => {
        const errorElement = document.querySelector('.bg-red-500\\/20');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return false;
    }

    return true;
  };

  // Navigate to next section
  const nextSection = () => {
    if (validateAndProceed()) {
      setCurrentSection(currentSection + 1);
      // Scroll to top of form when changing sections
      setTimeout(() => {
        document
          .querySelector('form')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Navigate to previous section
  const prevSection = () => {
    setCurrentSection(currentSection - 1);
    // Scroll to top of form when changing sections
    setTimeout(() => {
      document
        .querySelector('form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Toggle camera facing mode (front/back)
  const toggleCameraFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  // Form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug - check if we're using the updated FormSubmission
    console.log('Using submitForm function - version check');

    // Validate form before submission
    const errors = validateForm(formData, currentSection, capturedImage, t);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    // Prevent multiple submissions
    if (loading) {
      return;
    }

    setLoading(true);
    setFormErrors([]);

    try {
      const result = await submitChildForm(formData, capturedImage, t);

      if (result.success) {
        // Store the user ID and set success state
        const userId = result.userId || `temp-${Date.now()}`;
      setRegisteredUserId(userId);
        
        // Clear form data immediately to prevent duplicate submissions
        setFormData({ ...initialFormData });
        setCapturedImage(null);
        
        // Show success animation
        setSubmitSuccess(true);
        
        // After showing success animation, reset everything to initial state
        setTimeout(() => {
          // Reset success state to show the form again
          setSubmitSuccess(false);
          
          // Make sure form is fully reset
          setFormData({ ...initialFormData });
          setCapturedImage(null);
          setCurrentSection(1);
          setLoading(false);
          console.log('Form reset completed after success animation');
        }, 3500);
      } else {
        // If not successful, show error message
        setFormErrors([
          t('registration.failed', 'Registration failed. Please try again.'),
        ]);
      }
    } catch (error) {
      console.error('Form submission error:', error);

      let errorMessage = t(
        'registration.generalError',
        'An error occurred during registration'
      );

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setFormErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* "Back" Button */}
      <div>
        <Link
          to="/home"
          className="inline-flex items-center text-white hover:text-orange-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t('common.back', 'Back to Home')}
        </Link>
      </div>

      {/* Form Progress Indicator - Only show when not in success state */}
      {!submitSuccess && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[1, 2, 3, 4].map((step, idx) => (
              <React.Fragment key={step}>
                {idx > 0 && (
                  <div className="w-8 sm:w-16 h-1 bg-gray-300">
                    <div
                      className={`h-full ${currentSection >= step ? 'bg-orange-600' : 'bg-gray-300'}`}
                    ></div>
                  </div>
                )}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentSection === step
                      ? 'bg-orange-600 text-white scale-110'
                      : currentSection > step
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {step}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {submitSuccess ? (
        <SuccessAnimation
          title={t('registration.success')}
          message={t('forms.child.title') + ' ' + t('common.success')}
          id={registeredUserId}
          idLabel={t('registration.caseReferenceId', 'Case Reference ID:')}
        />
      ) : (
        <motion.form
          onSubmit={handleFormSubmit}
          className="w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-lg p-4 sm:p-6 md:p-10 mt-4 sm:mt-6 rounded-xl sm:rounded-2xl shadow-[0_0_30px_5px_rgba(255,165,0,0.3)] text-white border border-white/30 space-y-4 sm:space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
            {t('forms.child.title')}
          </h2>

          {/* Display form errors */}
          {formErrors.length > 0 && (
            <motion.div
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
              className="bg-red-500/20 p-3 rounded-lg border border-red-500/30 mb-4"
            >
              <ul className="list-disc pl-5">
                {formErrors.map((error, index) => (
                  <li key={index} className="text-red-200 text-sm sm:text-base">
                    {error}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Section 1: Basic Information */}
          {currentSection === 1 && (
            <BasicInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              nextSection={nextSection}
              t={t}
            />
          )}

          {/* Section 2: Guardian Information */}
          {currentSection === 2 && (
            <GuardianInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              prevSection={prevSection}
              nextSection={nextSection}
              t={t}
            />
          )}

          {/* Section 3: Disappearance Details */}
          {currentSection === 3 && (
            <DisappearanceDetailsSection
              formData={formData}
              handleInputChange={handleInputChange}
              prevSection={prevSection}
              nextSection={nextSection}
              t={t}
            />
          )}

          {/* Section 4: Upload Image */}
          {currentSection === 4 && (
            <ImageSection
              formData={formData}
              capturedImage={capturedImage}
              webcamRef={webcamRef}
              facingMode={facingMode}
              handleToggleCamera={handleToggleCamera}
              handleFileSelect={handleFileSelect}
              captureImage={captureImage}
              toggleCameraFacingMode={toggleCameraFacingMode}
              retakePhoto={retakePhoto}
              handleFormSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              prevSection={prevSection}
              t={t}
            />
          )}
        </motion.form>
      )}
    </div>
  );
}

export default AddNormalChild;
