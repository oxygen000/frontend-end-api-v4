import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { registrationApi } from '../../../services/api';
import { useTranslationWithFallback } from '../../../hooks/useTranslationWithFallback';
import SuccessAnimation from '../../../components/SuccessAnimation';

// Import types and form components
import type {
  DisabledFormData,
  DisabledFormSection,
} from './types/disabled-form';
import { initialFormData } from './types/disabled-form';
import FormProgressIndicator from './components/FormProgressIndicator';
import FormErrorDisplay from './components/FormErrorDisplay';
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

  // Form data
  const [personDetails, setPersonDetails] =
    useState<DisabledFormData>(initialFormData);

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPersonDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    setPersonDetails((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleToggleCamera = () => {
    setUseCamera(!useCamera);
    setPersonDetails((prev) => ({
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
    const errors = validateForm(
      personDetails,
      currentSection,
      capturedImage,
      t
    );
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

    const errors = validateForm(personDetails, 4, capturedImage, t);
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
    const submissionKey = `${personDetails.name}-${personDetails.dob}-${Date.now()}`;

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
      const formDataToSend = buildSubmissionFormData(
        personDetails,
        capturedImage
      );

      // Process and attach the image file
      const imageFile = prepareImageFile(personDetails.image, capturedImage);
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
        setPersonDetails({ ...initialFormData });
        setCapturedImage(null);

        // If we didn't get proper data back, try to recreate it
        let userId, userName;

        // If we have a proper response, use it
        if (responseData?.user_id || responseData?.user?.id) {
          userId = responseData.user_id || responseData.user?.id || '';
          userName = responseData.user?.name || personDetails.name;
        } else {
          // Create a fallback temporary response object
          userId = `temp-${Date.now()}`;
          userName = personDetails.name;

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
          setPersonDetails({ ...initialFormData });
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
    <div className="px-4 sm:px-6 w-full max-w-full overflow-x-hidden">
      {/* "Back" Button */}
      <div className="mt-4 sm:mt-6">
        <Link
          to="/home"
          className="inline-flex items-center text-white hover:text-purple-300 transition-colors"
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
        <FormProgressIndicator currentSection={currentSection} />
      )}

      {submitSuccess ? (
        <SuccessAnimation
          title={t('registration.success', 'Registration Successful!')}
          message={t(
            'forms.disabled.title',
            'The information has been recorded successfully.'
          )}
          id={registeredUserId}
          idLabel={t('registration.caseReferenceId', 'Registration ID:')}
        />
      ) : (
        <motion.form
          onSubmit={handleFormSubmit}
          className="max-w-xl mx-auto bg-white/20 backdrop-blur-lg p-5 sm:p-10 mt-4 sm:mt-6 rounded-2xl shadow-[0_0_30px_5px_rgba(128,0,128,0.5)] border border-white/30 text-white space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
            {t('forms.disabled.title', 'Accompanying Person Registration')}
          </h2>

          {/* Display form errors */}
          <FormErrorDisplay errors={formErrors} />

          {/* Render the appropriate form section based on current step */}
          {currentSection === 1 && (
            <BasicInformationSection
              personDetails={personDetails}
              handleInputChange={handleInputChange}
              onNext={nextSection}
            />
          )}

          {currentSection === 2 && (
            <ContactInformationSection
              personDetails={personDetails}
              handleInputChange={handleInputChange}
              onNext={nextSection}
              onPrev={prevSection}
            />
          )}

          {currentSection === 3 && (
            <DisabilityInformationSection
              personDetails={personDetails}
              handleInputChange={handleInputChange}
              onNext={nextSection}
              onPrev={prevSection}
            />
          )}

          {currentSection === 4 && (
            <PhotoCaptureSection
              personDetails={personDetails}
              useCamera={useCamera}
              toggleCamera={handleToggleCamera}
              capturedImage={capturedImage}
              onImageCapture={handleImageCapture}
              onFileSelect={handleFileSelect}
              onPrev={prevSection}
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          )}
        </motion.form>
      )}
    </div>
  );
}

export default AddDisabled;
