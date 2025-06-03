/**
 * AddDisabled Component
 *
 * This component handles the registration form for disabled persons.
 * It includes multiple form sections and manages form state and validation.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
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
import ReporterInformationSection from './components/GuardianInfoSection';
import MissingInformationSection from './components/DisappearanceDetailsSection';
import MedicalInformationSection from './components/MedicalInfoSection';
// Import utility functions
import { validateForm, buildSubmissionFormData } from './utils/formValidation';
import type { RegistrationResult } from '../../../services/api/types';
import PoliceReportSection from './components/PoliceReportSection';
import PhotoCaptureSection from './components/ImageSection';
import type { User } from '../../users/types/types';
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
  const location = useLocation();

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

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  // Debug initial form data
  console.log('🏁 AddDisabled component initialized');
  console.log('📋 Initial form data:', initialFormData);
  console.log('📍 Current location:', location);

  // Check if we're in edit mode and populate form data
  useEffect(() => {
    const state = location.state as {
      editMode?: boolean;
      editUserId?: string;
      userData?: User;
    } | null;

    console.log('🔍 AddDisabled useEffect - Location state:', state);

    // Try to get data from state or localStorage backup
    let userData: User | null = null;
    let editMode = false;
    let userId: string | null = null;

    if (state?.editMode && state?.userData) {
      userData = state.userData;
      editMode = state.editMode;
      userId = state.editUserId || state.userData.id || null;
      console.log('📊 Using location.state data');
    } else {
      // Try localStorage backup
      try {
        const backupData = localStorage.getItem('editDisabledData');
        if (backupData) {
          userData = JSON.parse(backupData);
          editMode = true;
          userId = userData?.id || null;
          console.log('💾 Using localStorage backup data');
        }
      } catch (error) {
        console.warn('⚠️ Failed to read localStorage backup:', error);
      }
    }

    if (editMode && userData) {
      console.group('📝 Disabled Form Edit Mode Initialization');
      console.log('✅ Edit mode detected');
      console.log('📊 Received user data:', userData);
      console.log('🆔 Edit user ID:', userId);

      setIsEditMode(true);
      setEditUserId(userId);
      const user = userData;

      // Debug medical_history specifically
      console.log('🏥 Medical history debug:');
      console.log('   - user.medical_history:', user.medical_history);
      console.log('   - user.medical_condition:', user.medical_condition);
      console.log(
        '   - Which will be used for medical_history:',
        user.medical_history || user.medical_condition || ''
      );

      // Map user data to disabled form data structure
      const mappedFormData: DisabledFormData = {
        ...initialFormData,
        // Basic information
        name: user.name || '',
        full_name: user.full_name || user.name || '',
        dob: user.dob || user.date_of_birth || '',
        gender: user.gender || '',
        national_id: user.national_id || '',
        address: user.address || '',
        nickname: user.nickname || '',
        age: user.age || '',

        // Contact information
        phone_number: user.phone_number || user.missing_person_phone || '',
        phone_company: user.phone_company || user.service_provider || '',
        second_phone_number: user.second_phone_number || '',

        // Disability-specific information
        disability_type: user.disability_type || '',
        disability_description: user.disability_description || '',
        medical_condition: user.medical_condition || user.medical_history || '',
        medical_history: user.medical_history || user.medical_condition || '',
        special_needs: user.special_needs || '',
        emergency_contact: user.emergency_contact || '',
        emergency_phone: user.emergency_phone || '',

        // Physical description
        distinctive_mark:
          user.distinctive_mark || user.physical_description || '',

        // Reporter/Guardian information
        reporter_name: user.reporter_name || user.guardian_name || '',
        reporter_phone: user.reporter_phone || user.guardian_phone || '',
        reporter_national_id:
          user.reporter_national_id || user.guardian_id || '',
        reporter_relationship:
          user.reporter_relationship || user.guardian_relationship || '',
        reporter_address: user.reporter_address || user.address || '',
        reporter_occupation: user.reporter_occupation || '',
        reporter_education: user.reporter_education || '',
        reporter_secondary_phone: user.reporter_secondary_phone || '',
        relationship:
          user.reporter_relationship || user.guardian_relationship || '',

        // Medical information
        treating_physician: user.treating_physician || '',
        physician_phone: user.physician_phone || '',

        // Missing person information
        missing_person_phone: user.missing_person_phone || '',
        missing_person_occupation: user.missing_person_occupation || '',
        missing_person_education: user.missing_person_education || '',

        // Disappearance details
        area_of_disappearance:
          user.area_of_disappearance || user.last_sighting || '',
        last_sighting: user.last_sighting || user.area_of_disappearance || '',
        clothes_description:
          user.clothes_description || user.last_clothes || '',
        disappearance_date:
          user.disappearance_date || user.last_seen_time || '',
        disappearance_time: user.disappearance_time || '',
        was_accompanied: user.was_accompanied || '',
        reason_for_location: user.reason_for_location || '',

        // Friends information
        first_friend: user.first_friend || '',
        second_friend: user.second_friend || '',
        first_friend_phone: user.first_friend_phone || '',
        second_friend_phone: user.second_friend_phone || '',

        // Police report information
        absence_report_number: user.absence_report_number || '',
        absence_report_date: user.absence_report_date || '',
        police_station: user.police_station || '',
        security_directorate: user.security_directorate || '',
        governorate: user.governorate || '',
        previous_disputes: user.previous_disputes || '',
        gone_missing_before: user.gone_missing_before || '',

        // Additional information
        additional_notes: user.additional_notes || '',

        // Form metadata
        form_type: 'disabled',
        image: null,
        useCamera: false,
      };

      console.log('🔧 Mapped form data:', mappedFormData);

      // Debug final medical_history value
      console.log(
        '🏥 Final medical_history in mapped data:',
        mappedFormData.medical_history
      );
      console.log(
        '🏥 Final medical_condition in mapped data:',
        mappedFormData.medical_condition
      );

      // Use a timeout to ensure the state update happens
      setTimeout(() => {
        setFormData(mappedFormData);
        console.log('✅ Form data state updated with timeout');

        // Clear localStorage backup after successful load
        try {
          localStorage.removeItem('editDisabledData');
          console.log('🗑️ Cleared localStorage backup');
        } catch (error) {
          console.warn('⚠️ Failed to clear localStorage:', error);
        }
      }, 0);

      // If user has an image, try to load it
      if (user.image_path) {
        console.log('🖼️ User has image:', user.image_path);
      }

      console.groupEnd();
    } else {
      console.log('📝 AddDisabled - New registration mode (no edit data)');
    }
  }, [location.state]);

  // Add another useEffect to monitor formData changes
  useEffect(() => {
    console.log('📊 DisabledFormData state changed:', formData);
    console.log('🔑 Key disabled formData values:', {
      full_name: formData.full_name,
      name: formData.name,
      dob: formData.dob,
      national_id: formData.national_id,
      gender: formData.gender,
      address: formData.address,
      disability_type: formData.disability_type,
      reporter_name: formData.reporter_name,
      medical_history: formData.medical_history,
      medical_condition: formData.medical_condition,
    });
  }, [formData]);

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

    console.log('🚀 Form submission started');
    console.log('   - Edit mode:', isEditMode);
    console.log('   - Edit user ID:', editUserId);
    console.log('   - Form data preview:', {
      full_name: formData.full_name,
      national_id: formData.national_id,
      disability_type: formData.disability_type,
    });

    try {
      // Validate all sections before submission
      const allSectionErrors = [];
      for (let section = 1; section <= 7; section++) {
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
      const submissionKey = `${formData.full_name}-${Date.now()}`;

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
      const formDataToSend = buildSubmissionFormData(
        formData,
        capturedImage,
        editUserId
      );

      try {
        // Send the registration request with timeout (including editUserId for updates)
        let response: RegistrationResult;

        if (isEditMode && editUserId) {
          // Update existing user
          console.log(
            '🔄 Updating existing disabled user with ID:',
            editUserId
          );
          response = (await Promise.race([
            registrationApi.updateUser(editUserId, formDataToSend),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), 25000)
            ),
          ])) as RegistrationResult;
        } else {
          // Create new user
          console.log('✨ Creating new disabled user registration');
          response = (await Promise.race([
            registrationApi.registerUser(formDataToSend),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), 25000)
            ),
          ])) as RegistrationResult;
        }

        // Clear timeout
        clearTimeout(submissionTimeout);

        // Clear pending submission
        pendingSubmissions.delete(submissionKey);

        console.log('✅ API call successful');
        console.log('   - Response:', response);
        console.log('   - Operation type:', isEditMode ? 'UPDATE' : 'CREATE');
        console.log('   - Expected user ID:', editUserId);
        console.log(
          '   - Response user ID:',
          response?.user_id || response?.user?.id
        );

        // Extract user ID from response
        let userId = '';

        if (isEditMode && editUserId) {
          // In edit mode, use the original editUserId
          userId = editUserId;
        } else if (response?.user_id || response?.user?.id) {
          userId = response.user_id || response.user?.id || '';
        } else if (response?.user?.face_id) {
          userId = response.user.face_id;
        } else {
          // Fallback to form data if response is incomplete
          userId = formData.national_id || formData.name;
        }

        // Show success toast
        toast.success(
          isEditMode
            ? t('form.success.updateMessage', 'Update successful!')
            : t('form.success.message', 'Registration successful!'),
          {
            id: 'disabled-registration',
          }
        );

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
    { id: 1, name: t('forms.child.sections.1', 'Basic') },
    { id: 2, name: t('forms.child.sections.2', 'Contact') },
    { id: 3, name: t('forms.child.sections.3', 'Guardian') },
    { id: 4, name: t('forms.child.sections.4', 'Medical') },
    { id: 5, name: t('forms.child.sections.5', 'Disappearance') },
    { id: 6, name: t('forms.child.sections.6', 'Police Report') },
    { id: 7, name: t('forms.child.sections.7', 'Photo') },
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
              {isEditMode
                ? t(
                    'forms.disabled.editTitle',
                    'Edit Disabled Person Information'
                  )
                : t('title', 'Register Disabled Person')}
            </h1>

            {/* Progress text */}
            <p className="text-white/80 text-center mb-8 text-lg">
              {' '}
              <span className="text-purple-400">({currentSection}/7)</span>
            </p>

            {/* Progress indicator */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 mb-8">
              <div className="flex items-center text-center justify-center gap-2 sm:gap-4 md:gap-6">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex flex-col items-center relative"
                  >
                    {/* Section number circle */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2
                      ${
                        currentSection === section.id
                          ? 'bg-purple-500 text-white ring-4 ring-purple-500/30'
                          : currentSection > section.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {currentSection > section.id ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        section.id
                      )}
                    </div>

                    {/* Section name */}
                    <span
                      className={`text-xs sm:text-sm hidden sm:block
                      ${
                        currentSection === section.id
                          ? 'text-purple-400 font-medium'
                          : currentSection > section.id
                            ? 'text-green-500'
                            : 'text-gray-500'
                      }`}
                    >
                      {section.name}
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
                title={
                  isEditMode
                    ? t('edit.success', 'Update Successful!')
                    : t('registration.success', 'Registration Successful!')
                }
                message={
                  isEditMode
                    ? t(
                        'edit.successDescription',
                        'Disabled person information has been updated successfully.'
                      )
                    : t(
                        'registration.successDescription',
                        'User has been registered successfully.'
                      )
                }
                id={registeredUserId}
                idLabel={t('registration.caseReferenceId', 'Registration ID:')}
              />

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
              className="w-full max-w-3xl mx-auto 
                        bg-gray-800/40 backdrop-blur-md
                        p-6 sm:p-8 
                        rounded-2xl 
                        shadow-[0_10px_40px_-5px_rgba(147,51,234,0.3)] 
                        text-white 
                        border border-gray-700/50"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Display validation errors if any */}
              <AnimatePresence>
                {formErrors.length > 0 && (
                  <motion.div
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-red-500/20 p-4 rounded-xl border border-red-500/30 mb-6"
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

              {/* Form sections - Only one is shown at a time */}
              <AnimatePresence mode="wait">
                {/* Section 1: Basic Information */}
                {currentSection === 1 ? (
                  <BasicInformationSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 2: Contact Information */
                currentSection === 2 ? (
                  <ContactInformationSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 3: Reporter Information */
                currentSection === 3 ? (
                  <ReporterInformationSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 4: Missing Information */
                currentSection === 4 ? (
                  <MedicalInformationSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    t={t}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 5: Missing Information */
                currentSection === 5 ? (
                  <MissingInformationSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 6: Missing Information */
                currentSection === 6 ? (
                  <PoliceReportSection
                    formData={formData}
                    t={t}
                    handleInputChange={handleInputChange}
                    onNext={nextSection}
                    onPrev={prevSection}
                  />
                ) : /* Section 7: Photo Capture */
                currentSection === 7 ? (
                  <PhotoCaptureSection
                    formData={formData}
                    useCamera={useCamera}
                    toggleCamera={handleToggleCamera}
                    capturedImage={capturedImage}
                    onImageCapture={handleImageCapture}
                    onFileSelect={handleFileSelect}
                    onPrev={prevSection}
                    onSubmit={handleFormSubmit}
                    loading={loading}
                  />
                ) : null}
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
