import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';
import SuccessAnimation from '../../../components/SuccessAnimation';
import { useTranslationWithFallback } from '../../../hooks/useTranslationWithFallback';
import {
  errorVariants,
  transition,
  formVariants,
} from '../../../config/animations';

// Import extracted components
import PersonalInfoSection from './components/BasicInfoSection';
import GuardianInfoSection from './components/GuardianInfoSection';
import ImageSection from './components/ImageSection';

// Import types and utils
import type { FormData } from './types/types';
import { initialFormData } from './types/types';
import { validateForm } from './utils/FormValidation';
import { submitForm } from './utils/FormSubmission';
import DisappearanceDetailsSection from './components/DisappearanceDetailsSection';

const AddNormalChild = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [, setUploadedImage] = useState<File | null>(null);
  const [, setUploadedImagePreview] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const { t } = useTranslationWithFallback();
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof FormData] as unknown as {
            [key: string]: string | number | boolean | null | File;
          }),
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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

  // Unified next section function
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

  // Unified previous section function
  const prevSection = () => {
    setCurrentSection(currentSection - 1);
    // Scroll to top of form when changing sections
    setTimeout(() => {
      document
        .querySelector('form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors([
        t('validation.imageSizeLimit', 'Image size should be less than 5MB'),
      ]);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormErrors([
        t('validation.imageTypeInvalid', 'Please upload a valid image file'),
      ]);
      return;
    }

    try {
      // Create a preview without modifying the image
      const previewUrl = URL.createObjectURL(file);
      setUploadedImage(file);
      setUploadedImagePreview(previewUrl);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    } catch (error) {
      console.error('Image processing error:', error);
      setFormErrors([
        error instanceof Error
          ? error.message
          : t('common.generalError', 'Failed to process image'),
      ]);
      toast.error(
        error instanceof Error
          ? error.message
          : t('common.generalError', 'Failed to process image')
      );
    }
  };

  // Capture image from webcam without modification
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setUploadedImage(null);
        setUploadedImagePreview(null);
      }
    }
  };

  // Add function to toggle camera facing mode
  const toggleCameraFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAndProceed()) {
      return;
    }

    setLoading(true);

    try {
      const result = await submitForm(formData, capturedImage, t);

      if (result.success) {
        setSubmitSuccess(true);
        setRegisteredUserId(result.userId || null);

        // Reset form data after animation plays
        setTimeout(() => {
          setFormData(initialFormData);
          setCapturedImage(null);
          setCurrentSection(1);
          setSubmitSuccess(false);
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCamera = () => {
    setFormData((prevData) => ({
      ...prevData,
      useCamera: !prevData.useCamera,
      image: null,
    }));
    setCapturedImage(null);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Get the section title based on current section
  const getSectionTitle = () => {
    switch (currentSection) {
      case 1:
        return t('forms.child.sections.personal', 'Child Information');
      case 2:
        return t('forms.child.sections.guardian', 'Guardian Information');

      case 3:
        return t('forms.child.sections.photo', 'Photo');
      default:
        return t('forms.child.title', 'Child Registration');
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 ">
      <Link
        to="/home"
        className="inline-flex items-center text-white hover:text-cyan-300 transition-colors font-medium"
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

      {/* Form Progress Indicator - Hide when showing success */}
      {!submitSuccess && (
        <div className="max-w-2xl mx-auto mt-6 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            {t('forms.child.title', 'Child Registration')}
          </h1>
          <p className="text-white/70 text-center mb-6">
            {getSectionTitle()} ({currentSection}/5)
          </p>

          <div className="flex justify-center py-2 mb-4">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              {[1, 2, 3, 4].map((step, idx) => (
                <React.Fragment key={step}>
                  {idx > 0 && (
                    <div className="w-6 sm:w-10 md:w-16 h-1 bg-gray-300/30 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          currentSection >= step
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-400'
                            : 'bg-gray-300/30'
                        }`}
                        style={{
                          width:
                            currentSection > step
                              ? '100%'
                              : currentSection === step
                                ? '50%'
                                : '0%',
                        }}
                      ></div>
                    </div>
                  )}
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 text-xs sm:text-sm md:text-base ${
                      currentSection === step
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-lg shadow-teal-700/30 scale-110'
                        : currentSection > step
                          ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-white'
                          : 'bg-gray-200/20 text-white/70'
                    }`}
                  >
                    {step}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {submitSuccess ? (
          <SuccessAnimation
            title={t('registration.success', 'Registration Successful!')}
            message={t(
              'registration.successDescription',
              'User has been registered successfully.'
            )}
            id={registeredUserId}
            idLabel={t('registration.caseReferenceId', 'Registration ID:')}
          />
        ) : (
          <motion.form
            onSubmit={handleFormSubmit}
            className="w-full max-w-2xl mx-auto 
                      bg-white/10 backdrop-blur-lg 
                      p-5 sm:p-8 
                      mt-4 sm:mt-6 
                      rounded-2xl 
                      shadow-[0_10px_40px_-5px_rgba(20,184,166,0.3)] 
                      text-white 
                      border border-white/20 
                      space-y-6 sm:space-y-8"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Display form errors */}
            <AnimatePresence>
              {formErrors.length > 0 && (
                <motion.div
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={transition}
                  className="bg-red-500/20 p-4 rounded-xl border border-red-500/30 mb-4"
                >
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <ul className="list-disc pl-5 space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index} className="text-red-100 text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sections */}
            <AnimatePresence mode="wait">
              {currentSection === 1 && (
                <PersonalInfoSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  nextSection={nextSection}
                  t={t}
                />
              )}

              {currentSection === 2 && (
                <GuardianInfoSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  prevSection={prevSection}
                  nextSection={nextSection}
                  t={t}
                />
              )}
              {currentSection === 3 && (
                <DisappearanceDetailsSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  prevSection={prevSection}
                  nextSection={nextSection}
                  t={t}
                />
              )}

              {currentSection === 4 && (
                <ImageSection
                  formData={formData}
                  handleFileSelect={handleFileChange}
                  isSubmitting={loading}
                  capturedImage={capturedImage}
                  webcamRef={webcamRef}
                  facingMode={facingMode}
                  handleToggleCamera={handleToggleCamera}
                  captureImage={captureImage}
                  toggleCameraFacingMode={toggleCameraFacingMode}
                  retakePhoto={retakePhoto}
                  handleFormSubmit={handleFormSubmit}
                  prevSection={prevSection}
                  t={t}
                />
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddNormalChild;
