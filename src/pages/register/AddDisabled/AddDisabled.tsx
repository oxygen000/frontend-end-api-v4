import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registrationApi } from '../../../services/api';
import { useTranslationWithFallback } from '../../../hooks/useTranslationWithFallback';
import SuccessAnimation from '../../../components/SuccessAnimation';
import {
  errorVariants,
  transition,
  formVariants,
} from '../../../config/animations';

// Import types and form components
import type {
  DisabledFormData,
  DisabledFormSection,
} from './types/disabled-form';
import { initialFormData } from './types/disabled-form';
import BasicInformationSection from './components/BasicInformationSection';
import ContactInformationSection from './components/ContactInformationSection';
import DisabilityInformationSection from './components/DisabilityInformationSection';
import PhotoCaptureSection from './components/PhotoCaptureSection';

// Import utility functions
import {
  validateForm,
  buildSubmissionFormData,
  prepareImageFile,
} from './utils/formValidation';

// Track submissions to prevent duplicates
const pendingSubmissions = new Set<string>();

function AddDisabled() {
  const { t } = useTranslationWithFallback();
  const [currentSection, setCurrentSection] = useState<DisabledFormSection>(1);
  const [useCamera, setUseCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DisabledFormData>(initialFormData);

  // Event handlers
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
          ...(prev[section as keyof DisabledFormData] as unknown as {
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

  const handleFileSelect = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleToggleCamera = () => {
    setUseCamera(!useCamera);
    setFormData((prev) => ({
      ...prev,
      useCamera: !useCamera,
      image: null,
    }));
    setCapturedImage(null);
  };

  const handleImageCapture = (imageSrc: string | null) => {
    setCapturedImage(imageSrc);
  };

  // Navigation functions
  const nextSection = () => {
    const errors = validateForm(formData, currentSection, capturedImage, t);
    setFormErrors(errors);

    if (errors.length === 0) {
      setCurrentSection((currentSection + 1) as DisabledFormSection);
      // Scroll to top of form when changing sections
      setTimeout(() => {
        document
          .querySelector('form')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // If there are errors, scroll to the error section
      setTimeout(() => {
        document
          .querySelector('.bg-red-500\\/20')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const prevSection = () => {
    setCurrentSection((currentSection - 1) as DisabledFormSection);
    // Scroll to top of form when changing sections
    setTimeout(() => {
      document
        .querySelector('form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formData, 4, capturedImage, t);
    setFormErrors(errors);

    if (errors.length > 0) {
      // Scroll to errors
      setTimeout(() => {
        document
          .querySelector('.bg-red-500\\/20')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    // Generate submission key to detect duplicate submissions
    const submissionKey = `${formData.name}-${formData.dob}-${Date.now()}`;

    // Prevent duplicate submissions
    if (pendingSubmissions.has(submissionKey)) {
      toast.error('A submission is already in progress');
      return;
    }

    // Mark as pending
    pendingSubmissions.add(submissionKey);
    setLoading(true);
    toast.loading('Registering information...', {
      id: 'disabled-registration',
    });

    try {
      // Build form data for submission
      const formDataToSend = buildSubmissionFormData(formData, capturedImage);

      // Process and attach the image file
      const imageFile = prepareImageFile(formData.image, capturedImage);
      if (imageFile) {
        formDataToSend.append('file', imageFile);
      } else {
        pendingSubmissions.delete(submissionKey);
        toast.dismiss('disabled-registration');
        throw new Error('Please provide a photo');
      }

      // Send the registration request
      try {
        const responseData = await registrationApi.registerUser(formDataToSend);
        console.log('Response data from registerUser:', responseData);

        // Clear pending submission immediately
        pendingSubmissions.delete(submissionKey);

        // Handle successful registration
        setSubmitSuccess(true);

        // Clear form data immediately to prevent duplicate submissions
        setFormData({ ...initialFormData });
        setCapturedImage(null);

        // If we didn't get proper data back, try to recreate it
        let userId, userName;

        // If we have a proper response, use it
        if (responseData?.user_id || responseData?.user?.id) {
          userId = responseData.user_id || responseData.user?.id || '';
          userName = responseData.user?.name || formData.name;
        } else {
          // Create a fallback temporary response object
          userId = `temp-${Date.now()}`;
          userName = formData.name;

          // Save the form data to localStorage for potential recovery
          try {
            const formDataObj: Record<string, string> = {};
            formDataToSend.forEach((value, key) => {
              if (typeof value === 'string') {
                formDataObj[key] = value;
              }
            });

            localStorage.setItem(
              `temp_registration_${userId}`,
              JSON.stringify({
                id: userId,
                name: userName,
                form_type: 'disabled',
                timestamp: new Date().toISOString(),
                data: formDataObj,
              })
            );

            console.log(
              `Saved form data to localStorage with key: temp_registration_${userId}`
            );
          } catch (e) {
            console.error('Failed to save form data to localStorage:', e);
          }
        }

        // Store the ID for reference
        setRegisteredUserId(userId);
        toast.success(`${userName} registered successfully!`, {
          id: 'disabled-registration',
        });

        // Show success animation
        setSubmitSuccess(true);

        // Reset form data after animation plays
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
      } catch (err) {
        pendingSubmissions.delete(submissionKey);
        handleRegistrationError(err);
      }
    } catch (err) {
      pendingSubmissions.delete(submissionKey);
      handleRegistrationError(err);
    }
  };

  // Error handling helper
  const handleRegistrationError = (err: unknown) => {
    console.error('Registration error:', err);

    // Check for specific face angle error
    let errorMessage = 'An error occurred during registration';

    if (err instanceof Error) {
      errorMessage = err.message;

      // Provide more user-friendly message for face angle errors
      if (
        errorMessage.includes('Face angle') ||
        errorMessage.includes('face is not')
      ) {
        errorMessage =
          "The uploaded photo doesn't meet our requirements. Please upload a clear front-facing photo where the person is looking directly at the camera.";
      }
      // Handle unique constraint errors
      else if (errorMessage.includes('UNIQUE constraint failed')) {
        errorMessage =
          'Registration could not be completed. Please try again with a different image.';
      }
    }

    toast.error(errorMessage, { id: 'disabled-registration' });
    setFormErrors([errorMessage]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 ">
      <Link
        to="/home"
        className="inline-flex items-center text-white hover:text-purple-300 transition-colors font-medium"
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
            {t('forms.disabled.title', 'Disabled Person Registration')}
          </h1>
          <p className="text-white/70 text-center mb-6">
            {currentSection}/{5}
          </p>

          <div className="flex justify-center py-2 mb-4">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              {[1, 2, 3, 4, 5].map((step, idx) => (
                <React.Fragment key={step}>
                  {idx > 0 && (
                    <div className="w-6 sm:w-10 md:w-16 h-1 bg-gray-300/30 rounded-full">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          currentSection >= step
                            ? 'bg-gradient-to-r from-purple-500 to-violet-600'
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
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-700/30 scale-110'
                        : currentSection > step
                          ? 'bg-gradient-to-r from-purple-400 to-violet-500 text-white'
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
                      shadow-[0_10px_40px_-5px_rgba(147,51,234,0.3)] 
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
                <BasicInformationSection
                  personDetails={formData}
                  handleInputChange={handleInputChange}
                  onNext={nextSection}
                />
              )}

              {currentSection === 2 && (
                <ContactInformationSection
                  personDetails={formData}
                  handleInputChange={handleInputChange}
                  onNext={nextSection}
                  onPrev={prevSection}
                />
              )}

              {currentSection === 3 && (
                <DisabilityInformationSection
                  personDetails={formData}
                  handleInputChange={handleInputChange}
                  onNext={nextSection}
                  onPrev={prevSection}
                />
              )}

              {currentSection === 4 && (
                <PhotoCaptureSection
                  personDetails={formData}
                  useCamera={useCamera}
                  toggleCamera={handleToggleCamera}
                  capturedImage={capturedImage}
                  onImageCapture={handleImageCapture}
                  onFileSelect={handleFileSelect}
                  onSubmit={handleFormSubmit}
                  onPrev={prevSection}
                  loading={loading}
                />
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AddDisabled;
