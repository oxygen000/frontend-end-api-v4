import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
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
import BasicInfoSection from './components/BasicInfoSection';
import ContactInformationSection from './components/ContactInformationSection';
import GuardianInfoSection from './components/GuardianInfoSection';
import MedicalInfoSection from './components/MedicalInfoSection';
import DisappearanceDetailsSection from './components/DisappearanceDetailsSection';
import PoliceReportSection from './components/PoliceReportSection';
import ImageSection from './components/ImageSection';

// Import types and utils
import type { FormData } from './types/types';
import { initialFormData } from './types/types';
import { validateForm } from './utils/FormValidation';
import { submitForm } from './utils/FormSubmission';
import type { User } from '../../users/types/types';

const AddNormalChild = () => {
  const location = useLocation();
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
  const [isEditMode, setIsEditMode] = useState(false);

  // Debug initial form data
  console.log('🏁 AddNormalChild component initialized');
  console.log('📋 Initial form data:', initialFormData);
  console.log('📍 Current location:', location);

  // Check if we're in edit mode and populate form data
  useEffect(() => {
    const state = location.state as {
      editMode?: boolean;
      editUserId?: string;
      userData?: User;
    } | null;

    console.log('🔍 AddNormalChild useEffect - Location state:', state);

    // Try to get data from state or localStorage backup
    let userData: User | null = null;
    let editMode = false;

    if (state?.editMode && state?.userData) {
      userData = state.userData;
      editMode = state.editMode;
      console.log('📊 Using location.state data');
    } else {
      // Try localStorage backup
      try {
        const backupData = localStorage.getItem('editChildData');
        if (backupData) {
          userData = JSON.parse(backupData);
          editMode = true;
          console.log('💾 Using localStorage backup data');
        }
      } catch (error) {
        console.warn('⚠️ Failed to read localStorage backup:', error);
      }
    }

    if (editMode && userData) {
      console.group('📝 Child Form Edit Mode Initialization');
      console.log('✅ Edit mode detected');
      console.log('📊 Received user data:', userData);

      setIsEditMode(true);
      const user = userData;

      // Map user data to child form data structure
      const mappedFormData: FormData = {
        ...initialFormData,
        // Basic information
        name: user.name || '',
        full_name: user.full_name || user.name || '',
        national_id: user.national_id || '',
        dob: user.dob || user.date_of_birth || '',
        age: user.age || '',
        gender: user.gender || '',

        // Contact information
        address: user.address || '',

        // Guardian information (mapped from reporter fields)
        guardian_name: user.guardian_name || user.reporter_name || '',
        guardian_phone: user.guardian_phone || user.reporter_phone || '',
        guardian_id: user.guardian_id || user.reporter_national_id || '',
        relationship:
          user.guardian_relationship || user.reporter_relationship || '',
        phone_company: ['Orange', 'Etisalat', 'Vodafone', 'WE', ''].includes(
          user.phone_company || ''
        )
          ? (user.phone_company as
              | 'Orange'
              | 'Etisalat'
              | 'Vodafone'
              | 'WE'
              | '')
          : '',

        // Reporter fields (backend schema)
        reporter_name: user.guardian_name || user.reporter_name || '',
        reporter_phone: user.guardian_phone || user.reporter_phone || '',
        reporter_national_id:
          user.guardian_id || user.reporter_national_id || '',
        reporter_address: user.address || user.reporter_address || '',
        reporter_occupation: user.reporter_occupation || '',
        reporter_education: user.reporter_education || '',
        reporter_relationship:
          user.guardian_relationship || user.reporter_relationship || '',
        reporter_secondary_phone: user.reporter_secondary_phone || '',

        // Physical and medical information
        physical_description: user.physical_description || '',
        distinctive_mark: user.distinctive_mark || '',
        medical_condition: user.medical_history || user.medical_condition || '',
        medical_history: user.medical_history || user.medical_condition || '',
        treating_physician: user.treating_physician || '',
        physician_phone: user.physician_phone || '',

        // Disappearance details
        last_seen_location:
          user.area_of_disappearance || user.last_sighting || '',
        last_seen_time: user.last_seen_time || user.disappearance_date || '',
        last_seen_clothes: user.last_clothes || user.clothes_description || '',
        area_of_disappearance:
          user.area_of_disappearance || user.last_sighting || '',
        clothes_description:
          user.last_clothes || user.clothes_description || '',
        disappearance_date:
          user.disappearance_date || user.last_seen_time || '',
        disappearance_time: user.disappearance_time || '',
        was_accompanied: user.was_accompanied || '',
        reason_for_location: user.reason_for_location || '',
        last_sighting: user.last_sighting || user.area_of_disappearance || '',

        // Missing person information
        missing_person_phone: user.missing_person_phone || '',
        missing_person_occupation: user.missing_person_occupation || '',
        missing_person_education: user.missing_person_education || '',

        // Friends information
        first_friend: user.first_friend || '',
        first_friend_phone: user.first_friend_phone || '',
        second_friend: user.second_friend || '',
        second_friend_phone: user.second_friend_phone || '',

        // Police report
        absence_report_number: user.absence_report_number || '',
        absence_report_date: user.absence_report_date || '',
        police_station: user.police_station || '',
        security_directorate: user.security_directorate || '',
        governorate: user.governorate || '',
        previous_disputes: user.previous_disputes || '',
        gone_missing_before: user.gone_missing_before || '',

        // Additional information
        additional_notes: user.additional_notes || '',

        form_type: 'child',
      };

      console.log('🔧 Mapped form data:', mappedFormData);

      // Use a timeout to ensure the state update happens
      setTimeout(() => {
        setFormData(mappedFormData);
        console.log('✅ Form data state updated with timeout');

        // Clear localStorage backup after successful load
        try {
          localStorage.removeItem('editChildData');
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
      console.log('📝 AddNormalChild - New registration mode (no edit data)');
    }
  }, [location.state]);

  // Add another useEffect to monitor formData changes
  useEffect(() => {
    console.log('📊 FormData state changed:', formData);
    console.log('🔑 Key formData values:', {
      full_name: formData.full_name,
      name: formData.name,
      dob: formData.dob,
      national_id: formData.national_id,
      gender: formData.gender,
      address: formData.address,
      guardian_name: formData.guardian_name,
      reporter_name: formData.reporter_name,
    });
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev: FormData) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof FormData] as unknown as {
            [key: string]: string | number | boolean | null | File;
          }),
          [field]: value,
        },
      }));
    } else {
      // Special handling for name/full_name field to ensure both are in sync
      if (name === 'name') {
        setFormData((prev: FormData) => ({
          ...prev,
          [name]: value,
          full_name: value, // Always keep full_name in sync with name
        }));
      } else if (name === 'full_name') {
        setFormData((prev: FormData) => ({
          ...prev,
          [name]: value,
          name: value, // Always keep name in sync with full_name
        }));
      } else {
        setFormData((prev: FormData) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const validateAndProceed = () => {
    const errors = validateForm(formData, currentSection, capturedImage);
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
      setFormData((prev: FormData) => ({
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

    // CRITICAL: Ensure full_name is set before submission
    if (!formData.full_name && formData.name) {
      setFormData((prev) => ({
        ...prev,
        full_name: formData.name,
      }));
      console.log(
        'Setting full_name from name before submission:',
        formData.name
      );
    }

    setLoading(true);

    try {
      // Get editUserId from location state if in edit mode
      const state = location.state as {
        editMode?: boolean;
        editUserId?: string;
        userData?: User;
      } | null;

      // Get editUserId from multiple sources for reliability - IMPROVED LOGIC
      let editUserId = state?.editUserId;

      // If not found in state, try userData.id
      if (!editUserId && state?.userData?.id) {
        editUserId = state.userData.id;
        console.log('Got editUserId from userData.id:', editUserId);
      }

      // Also try to get from localStorage backup as last resort
      if (!editUserId && isEditMode) {
        try {
          const backupData = localStorage.getItem('editChildData');
          if (backupData) {
            const userData = JSON.parse(backupData);
            editUserId = userData.id;
            console.log('Got editUserId from localStorage backup:', editUserId);
          }
        } catch (error) {
          console.warn('Failed to get editUserId from localStorage:', error);
        }
      }

      // CRITICAL: If we're in edit mode but don't have editUserId, show error
      if (isEditMode && !editUserId) {
        toast.error(
          'تعذر العثور على معرف المستخدم للتحديث. يرجى المحاولة مرة أخرى.'
        );
        console.error('Edit mode detected but no editUserId found!');
        return;
      }

      console.log('Child form submission details:', {
        isEditMode,
        editUserId,
        hasUserData: !!state?.userData,
        formName: formData.name,
        locationState: state,
      });

      // ENHANCED: Clear any existing localStorage data to prevent conflicts
      if (editUserId) {
        try {
          localStorage.removeItem('editChildData');
          console.log('Cleared localStorage to prevent conflicts');
        } catch (error) {
          console.warn('Failed to clear localStorage:', error);
        }
      }

      const result = await submitForm(formData, capturedImage, t, editUserId);

      if (result.success) {
        setSubmitSuccess(true);
        setRegisteredUserId(result.userId || null);

        // Reset form data after animation plays
        setTimeout(() => {
          setFormData(initialFormData);
          setCapturedImage(null);
          setCurrentSection(1);
          setSubmitSuccess(false);
          // Also reset edit mode
          setIsEditMode(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCamera = () => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      useCamera: !prevData.useCamera,
      image: null,
    }));
    setCapturedImage(null);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Define section items for progress indicator
  const sections = [
    { id: 1, name: t('forms.child.sections.1', 'Basic') },
    { id: 2, name: t('forms.child.sections.2', 'Contact') },
    { id: 3, name: t('forms.child.sections.3', 'Guardian') },
    { id: 4, name: t('forms.child.sections.5', 'Medical') },
    { id: 5, name: t('forms.child.sections.4', 'Disappearance') },
    { id: 6, name: t('forms.child.sections.6', 'Police Report') },
    { id: 7, name: t('forms.child.sections.7', 'Photo') },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/home"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-medium mb-6"
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
          <div className="max-w-3xl mx-auto mt-6 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 tracking-tight">
              {isEditMode
                ? t('forms.child.editTitle', 'Edit Child Information')
                : t('title', 'Child Registration')}
            </h1>
            <p className="text-white/80 text-center mb-8 text-lg">
              {' '}
              <span className="text-cyan-400">({currentSection}/7)</span>
            </p>

            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 mb-8">
              <div className="flex items-center text-center justify-center gap-2 sm:gap-4 md:gap-6">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2
                      ${
                        currentSection === section.id
                          ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30'
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
                    <span
                      className={`text-xs sm:text-sm hidden sm:block
                      ${
                        currentSection === section.id
                          ? 'text-cyan-400 font-medium'
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
          {submitSuccess ? (
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
                      'Child information has been updated successfully.'
                    )
                  : t(
                      'registration.successDescription',
                      'User has been registered successfully.'
                    )
              }
              id={registeredUserId}
              idLabel={t('registration.caseReferenceId', 'Registration ID:')}
            />
          ) : (
            <motion.form
              onSubmit={handleFormSubmit}
              className="w-full max-w-3xl mx-auto 
                        bg-gray-800/40 backdrop-blur-md
                        p-6 sm:p-8 
                        rounded-2xl 
                        shadow-[0_10px_40px_-5px_rgba(20,184,166,0.3)] 
                        text-white 
                        border border-gray-700/50"
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

              {/* Sections */}
              <AnimatePresence mode="wait">
                {currentSection === 1 && (
                  <BasicInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 2 && (
                  <ContactInformationSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 3 && (
                  <GuardianInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 4 && (
                  <MedicalInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 5 && (
                  <DisappearanceDetailsSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 6 && (
                  <PoliceReportSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 7 && (
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
    </div>
  );
};

export default AddNormalChild;
