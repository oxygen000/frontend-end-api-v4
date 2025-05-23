/**
 * AddDisabled Component
 *
 * This component handles the registration form for disabled persons.
 * It includes multiple form sections and manages form state and validation.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registrationApi } from '../../../services/api';
import { useTranslationWithFallback } from '../../../hooks/useTranslationWithFallback';
import SuccessAnimation from '../../../components/SuccessAnimation';
import { errorVariants, formVariants } from '../../../config/animations';

// Import types and form components
import type {
  DisabledFormData,
  DisabledFormSection,
} from './types/disabled-form';
import { initialFormData } from './types/disabled-form';
import BasicInformationSection from './components/BasicInformationSection';
import ContactInformationSection from './components/ContactInformationSection';
import ReporterInformationSection from './components/ReporterInformationSection';
import MissingInformationSection from './components/MissingInformationSection';
import PhotoCaptureSection from './components/ImageSection';

// Import utility functions
import { validateForm, buildSubmissionFormData } from './utils/formValidation';
import type { RegistrationResult } from '../../../services/api/types';

// Track submissions to prevent duplicates
const pendingSubmissions = new Set<string>();

/**
 * AddDisabled Component Function
 *
 * This component handles the registration form for disabled persons.
 */
function AddDisabled() {
  // Translation hook
  const { t } = useTranslationWithFallback('forms/disabled');

  // Form state
  const [currentSection, setCurrentSection] = useState<DisabledFormSection>(1);
  const [formData, setFormData] = useState<DisabledFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Image capture state
  const [useCamera, setUseCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Submission state
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

  /**
   * Image handling functions
   */
  const handleToggleCamera = () => setUseCamera((prev) => !prev);
  const handleImageCapture = (image: string | null) => setCapturedImage(image);
  const handleFileSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCapturedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setCapturedImage(null);
    }
  };

  /**
   * Form input change handler
   *
   * Handles changes to form inputs, including nested fields.
   *
   * @param e - The change event
   */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested fields (e.g., "section.field")
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
      // Handle top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /**
   * Navigation functions
   */

  /**
   * Move to the next form section
   *
   * Validates the current section before proceeding.
   * If validation fails, displays errors and scrolls to them.
   */
  const nextSection = () => {
    // Validate the current section
    const errors = validateForm(formData, currentSection, capturedImage);
    setFormErrors(errors);

    if (errors.length === 0) {
      // If no errors, proceed to next section
      setCurrentSection((currentSection + 1) as DisabledFormSection);

      // Scroll to the top of the form
      setTimeout(() => {
        document
          .querySelector('form')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // If errors, scroll to the error messages
      setTimeout(() => {
        document
          .querySelector('.bg-red-500\\/20')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  /**
   * Move to the previous form section
   */
  const prevSection = () => {
    setCurrentSection((currentSection - 1) as DisabledFormSection);

    // Scroll to the top of the form
    setTimeout(() => {
      document
        .querySelector('form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  /**
   * Form submission handler
   *
   * Validates all form sections, prepares form data, and submits it to the API.
   * Handles success and error cases, including timeouts and network errors.
   *
   * @param e - The form submission event
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setLoading(true);

    try {
      // Validate all sections before submission
      const allSectionErrors = [];
      for (let section = 1; section <= 6; section++) {
        const sectionErrors = validateForm(
          formData,
          section as DisabledFormSection,
          capturedImage
        );
        if (sectionErrors.length > 0) {
          allSectionErrors.push(...sectionErrors);
        }
      }

      // If validation fails, show errors and return
      if (allSectionErrors.length > 0) {
        setFormErrors(allSectionErrors);
        setLoading(false);

        // Scroll to first error
        setTimeout(() => {
          document
            .querySelector('.bg-red-500\\/20')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }

      // Generate a unique key for this submission
      const submissionKey = `${formData.name}-${Date.now()}`;

      // Check if this submission is already pending
      if (pendingSubmissions.has(submissionKey)) {
        setFormErrors([
          t(
            'form.errors.duplicateSubmission',
            'A submission is already in progress. Please wait.'
          ),
        ]);
        setLoading(false);
        return;
      }

      // Mark as pending
      pendingSubmissions.add(submissionKey);

      // Show loading toast
      toast.loading(t('form.submitting', 'Registering information...'), {
        id: 'disabled-registration',
        duration: 30000, // 30 second timeout
      });

      // Set a timeout for the entire submission process
      const submissionTimeout = setTimeout(() => {
        if (pendingSubmissions.has(submissionKey)) {
          pendingSubmissions.delete(submissionKey);
          toast.error(
            t(
              'form.errors.timeout',
              'Registration timed out. Please try again.'
            ),
            {
              id: 'disabled-registration',
            }
          );
          setLoading(false);
          setFormErrors([
            t(
              'form.errors.timeout',
              'Registration timed out. Please try again.'
            ),
          ]);
        }
      }, 30000); // 30 second timeout

      // Prepare form data for submission
      const formDataToSend = buildSubmissionFormData(formData, capturedImage);

      try {
        // Send the registration request with timeout
        const response = (await Promise.race([
          registrationApi.registerUser(formDataToSend),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 25000)
          ),
        ])) as RegistrationResult;

        // Clear timeout
        clearTimeout(submissionTimeout);

        // Clear pending submission
        pendingSubmissions.delete(submissionKey);

        // Extract user ID from response
        let userId = '';

        if (response?.user_id || response?.user?.id) {
          userId = response.user_id || response.user?.id || '';
        } else if (response?.user?.face_id) {
          userId = response.user.face_id;
        } else {
          // Fallback to form data if response is incomplete
          userId = formData.national_id || formData.name;
        }

        // Show success toast
        toast.success(t('form.success.message', 'Registration successful!'), {
          id: 'disabled-registration',
        });

        // Update state for success animation
        setRegisteredUserId(userId);
        setSubmitSuccess(true);

        // Reset form after success animation
        setTimeout(() => {
          setFormData(initialFormData);
          setCapturedImage(null);
          setUseCamera(false);
          setCurrentSection(1);
          setSubmitSuccess(false);
          setRegisteredUserId(null);
          setFormErrors([]);
          setLoading(false);
          toast.dismiss();
        }, 2000);
      } catch (error) {
        // Clear timeout
        clearTimeout(submissionTimeout);

        // Clear pending submission
        pendingSubmissions.delete(submissionKey);

        // Handle specific error types
        if (error instanceof Error) {
          if (error.message === 'Request timeout') {
            toast.error(
              t(
                'form.errors.timeout',
                'Registration timed out. Please try again.'
              ),
              {
                id: 'disabled-registration',
              }
            );
            setFormErrors([
              t(
                'form.errors.timeout',
                'Registration timed out. Please try again.'
              ),
            ]);
          } else if (error.message.includes('network')) {
            toast.error(
              t(
                'form.errors.network',
                'Network error. Please check your connection.'
              ),
              {
                id: 'disabled-registration',
              }
            );
            setFormErrors([
              t(
                'form.errors.network',
                'Network error. Please check your connection.'
              ),
            ]);
          } else {
            console.error('Error submitting form:', error);
            toast.error(
              t(
                'form.errors.submission',
                'Error submitting form. Please try again.'
              ),
              {
                id: 'disabled-registration',
              }
            );
            setFormErrors([
              t(
                'form.errors.submission',
                'Error submitting form. Please try again.'
              ),
            ]);
          }
        } else {
          console.error('Unknown error submitting form:', error);
          toast.error(
            t(
              'form.errors.unknown',
              'An unexpected error occurred. Please try again.'
            ),
            {
              id: 'disabled-registration',
            }
          );
          setFormErrors([
            t(
              'form.errors.unknown',
              'An unexpected error occurred. Please try again.'
            ),
          ]);
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setFormErrors([
        t(
          'form.errors.validationError',
          'Error validating form. Please check your inputs.'
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Define section items for progress indicator
   * Each section has an ID and a name that is displayed in the UI
   */
  const sections = [
    { id: 1, name: t('sections.1', 'Basic Information') },
    { id: 2, name: t('sections.2', 'Contact Information') },
    { id: 3, name: t('sections.3', 'Reporter Information') },
    { id: 4, name: t('sections.4', 'Missing Information') },
    { id: 5, name: t('sections.5', 'Photo Capture') },
  ];

  /**
   * Component render
   */
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          to="/home"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium mb-6"
          aria-label={t('common.back', 'Back')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t('common.back', 'Back')}
        </Link>

        {/* Form Progress Indicator - Hide when showing success */}
        {!submitSuccess && (
          <div className="max-w-3xl mx-auto mt-6 mb-6">
            {/* Form title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 tracking-tight">
              {t('title', 'Register Disabled Person')}
            </h1>

            {/* Progress text */}
            <p className="text-white/80 text-center mb-8 text-lg">
              {t('progress.current', {
                current: currentSection,
                total: 6,
              })}
            </p>

            {/* Progress indicator */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50">
              <div className="flex items-center text-center justify-center gap-6">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex flex-col items-center relative"
                  >
                    {/* Section number circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentSection >= section.id
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {section.id}
                    </div>

                    {/* Section name */}
                    <span
                      className={`text-sm mt-2 ${
                        currentSection >= section.id
                          ? 'text-purple-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {t(`sections.${section.id}`, section.name)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Show success animation or form sections */}
          {submitSuccess ? (
            <div className="text-center">
              <SuccessAnimation
                title={t('registration.success', 'Registration Successful!')}
                message={t(
                  'registration.successDescription',
                  'User has been registered successfully.'
                )}
                id={registeredUserId}
                idLabel={t('registration.caseReferenceId', 'Registration ID:')}
              />

              {/* زر العودة للتسجيل الجديد */}
              <motion.button
                onClick={() => {
                  setFormData(initialFormData);
                  setCapturedImage(null);
                  setUseCamera(false);
                  setCurrentSection(1);
                  setSubmitSuccess(false);
                  setRegisteredUserId(null);
                  setFormErrors([]);
                  setLoading(false);
                  toast.dismiss();
                }}
                className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-purple-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                {t('form.success.newRegistration', 'Register Another Person')}
              </motion.button>
            </div>
          ) : (
            <motion.form
              onSubmit={handleFormSubmit}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="bg-gray-800/50 backdrop-blur-sm p-5 sm:p-6 lg:p-8 rounded-xl border border-gray-700/50 mb-10"
            >
              {/* Display validation errors if any */}
              <AnimatePresence>
                {formErrors.length > 0 && (
                  <motion.div
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6"
                    role="alert"
                    aria-live="assertive"
                  >
                    <h4 className="text-red-400 font-semibold mb-2">
                      {t(
                        'common.errorsFound',
                        'Please fix the following errors:'
                      )}
                    </h4>
                    <ul className="list-disc list-inside text-white/80 space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form sections - Only one is shown at a time */}
              <AnimatePresence mode="wait">
                {/* Section 1: Basic Information */}
                {currentSection === 1 ? (
                  <BasicInformationSection
                    formData={formData}
                    onChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 2: Contact Information */
                currentSection === 2 ? (
                  <ContactInformationSection
                    formData={formData}
                    onChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 3: Reporter Information */
                currentSection === 3 ? (
                  <ReporterInformationSection
                    formData={formData}
                    onChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 4: Missing Information */
                currentSection === 4 ? (
                  <MissingInformationSection
                    formData={formData}
                    onChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : (
                  /* Section 5: Photo Capture */
                  <PhotoCaptureSection
                    formData={formData}
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
    </div>
  );
}

/**
 * Export the AddDisabled component as the default export
 */
export default AddDisabled;
