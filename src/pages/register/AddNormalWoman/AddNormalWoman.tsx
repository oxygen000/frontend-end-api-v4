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

// Import types, utils, and components
import type { FormData } from './types/types';
import { validateForm } from './utils/FormValidation';
import { submitForm } from './utils/FormSubmission';
import { initialFormData } from './types/types';
import type { User } from '../../users/types/types';

// Import extracted components
import PersonalInfoSection from './components/PersonalInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import CriminalRecordSection from './components/CriminalRecordSection';
import TravelInfoSection from './components/TravelInfoSection';
import VehicleInfoSection from './components/VehicleInfoSection';
import ImageSection from './components/ImageSection';

const AddNormalWoman = () => {
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
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

  // Check if we're in edit mode and populate form data
  useEffect(() => {
    const state = location.state as {
      editMode?: boolean;
      editUserId?: string;
      userData?: User;
    } | null;

    if (state?.editMode && state?.userData) {
      setIsEditMode(true);
      const user = state.userData;

      // Map user data to form data structure
      const mappedFormData: FormData = {
        ...initialFormData,
        // Personal information
        name: user.name || '',
        full_name: user.full_name || user.name || '',
        nickname: user.nickname || '',
        national_id: user.national_id || '',
        dob: user.dob || user.date_of_birth || '',
        mothers_name: user.mothers_name || '',
        marital_status: user.marital_status || '',
        educational_qualification: user.educational_qualification || '',
        occupation: user.occupation || '',
        issuing_authority: user.issuing_authority || '',
        issue_date: user.issue_date || '',
        governorate: user.governorate || '',

        // Contact information
        address: user.address || '',
        phone_number: user.phone_number || '',
        phone_company: user.phone_company || user.service_provider || 'other',
        service_provider: user.service_provider || user.phone_company || '',
        second_phone_number: user.second_phone_number || '',
        landline_number: user.landline_number || '',

        // Criminal record information
        has_criminal_record: Boolean(user.has_criminal_record),
        record_number: user.record_number || '',
        case_details: user.case_details || '',
        police_station: user.police_station || '',
        case_number: user.case_number || '',
        dossier_number: user.dossier_number || '',
        judgment: user.judgment || '',
        charge: user.charge || '',
        sentence: user.sentence || '',
        accusation: user.accusation || '',
        court_governorate: user.court_governorate || '',

        // Vehicle information
        has_vehicle: Boolean(user.has_vehicle),
        has_motorcycle: Boolean(user.has_motorcycle),
        vehicle_number: user.vehicle_number || '',
        license_plate: user.license_plate || '',
        vehicle_model: user.vehicle_model || '',
        vehicle_color: user.vehicle_color || user.color || '',
        brand: user.brand || '',
        chassis_number: user.chassis_number || '',
        license_type: user.license_type || '',
        traffic_unit: user.traffic_unit || '',
        license_expiration: user.license_expiration || '',
        license_governorate: user.license_governorate || '',
        manufacture_year: user.manufacture_year || '',
        expiration_year: user.expiration_year || '',
        traffic_department: user.traffic_department || '',
        vehicle_type: user.vehicle_type || '',

        // Travel information
        has_travel: Boolean(user.travel_date || user.departure_date),
        passport_number: user.passport_number || '',
        passport_issue_date: user.passport_issue_date || '',
        passport_expiry_date: user.passport_expiry_date || '',
        travel_date: user.travel_date || user.departure_date || '',
        travel_destination: user.travel_destination || user.destination || '',
        departure_country: user.departure_country || '',
        departure_destination: user.departure_destination || '',
        departure_date: user.departure_date || user.travel_date || '',
        departure_time: user.departure_time || '',
        departure_airline: user.departure_airline || '',
        departure_flight_number: user.departure_flight_number || '',
        departure_airport: user.departure_airport || '',
        arrival_origin: user.arrival_origin || '',
        arrival_destination: user.arrival_destination || '',
        arrival_airline: user.arrival_airline || '',
        arrival_flight_number: user.arrival_flight_number || '',
        arrival_date: user.arrival_date || '',
        arrival_time: user.arrival_time || '',
        arrival_airport: user.arrival_airport || '',
        return_date: user.return_date || '',
        return_flight_number: user.return_flight_number || '',
        return_airport: user.return_airport || '',

        // Additional information
        additional_notes: user.additional_notes || '',

        form_type: 'woman',
      };

      setFormData(mappedFormData);

      // If user has an image, try to load it
      if (user.image_path) {
        console.log('User has image:', user.image_path);
      }
    }
  }, [location.state]);

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
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleToggleCriminalRecord = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      has_criminal_record: !prev.has_criminal_record,
    }));
  };

  const handleToggleVehicle = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      has_vehicle: !prev.has_vehicle,
    }));
  };

  const handleToggleTravel = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      has_travel: !prev.has_travel,
    }));
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

  // Toggle camera facing mode
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
      // Create a copy of formData
      const submissionData = { ...formData };

      // Ensure form_type is 'woman'
      submissionData.form_type = 'woman';

      // Explicitly set has_vehicle flag
      submissionData.has_vehicle = !!submissionData.has_vehicle;

      // Explicitly set has_travel flag
      submissionData.has_travel = !!submissionData.has_travel;

      // Explicitly set has_criminal_record flag
      submissionData.has_criminal_record = !!submissionData.has_criminal_record;

      // Log the final submission data
      console.log('Final submission data:', submissionData);

      // Get editUserId from location state if in edit mode
      const state = location.state as {
        editMode?: boolean;
        editUserId?: string;
        userData?: User;
      } | null;
      const editUserId = state?.editUserId;

      const result = await submitForm(
        submissionData,
        capturedImage,
        t,
        editUserId
      );

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

  const handleToggleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Permission granted
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream
      setFormData((prevData: FormData) => ({
        ...prevData,
        useCamera: !prevData.useCamera,
        image: undefined,
      }));
      setCapturedImage(null);
    } catch (error) {
      // Permission denied or error occurred
      console.error('Camera permission denied:', error);
      toast.error(
        t(
          'camera.permissionDenied',
          'Camera permission denied. Please enable it in your browser settings.'
        )
      );
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Define section items for progress indicator
  const sections = [
    { id: 1, name: t('forms.man.sections.personal', 'Personal') },
    { id: 2, name: t('forms.man.sections.contact', 'Contact') },
    { id: 3, name: t('forms.man.sections.criminal', 'Criminal') },
    { id: 4, name: t('forms.man.sections.travel', 'Travel') },
    { id: 5, name: t('forms.man.sections.vehicle', 'Vehicle') },
    { id: 6, name: t('forms.man.sections.photo', 'Photo') },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/home"
          className="inline-flex items-center text-pink-400 hover:text-pink-300 transition-colors font-medium mb-6"
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
                ? t('forms.woman.editTitle', 'Edit Female Information')
                : t('forms.woman.title', 'Female Registration')}
            </h1>
            <p className="text-white/80 text-center mb-8 text-lg">
              {' '}
              <span className="text-pink-400">({currentSection}/6)</span>
            </p>

            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 mb-8">
              <div className="flex items-center text-center justify-between">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2
                      ${
                        currentSection === section.id
                          ? 'bg-pink-500 text-white ring-4 ring-pink-500/30'
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
                          ? 'text-pink-400 font-medium'
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
                      'Woman information has been updated successfully.'
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
                        shadow-[0_10px_40px_-5px_rgba(236,72,153,0.3)] 
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
                  <PersonalInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 2 && (
                  <ContactInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 3 && (
                  <CriminalRecordSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleToggleCriminalRecord={handleToggleCriminalRecord}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                  />
                )}

                {currentSection === 4 && (
                  <TravelInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                    handleToggleTravel={handleToggleTravel}
                  />
                )}

                {currentSection === 5 && (
                  <VehicleInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevSection={prevSection}
                    nextSection={nextSection}
                    t={t}
                    handleToggleVehicle={handleToggleVehicle}
                  />
                )}

                {currentSection === 6 && (
                  <ImageSection
                    formData={formData}
                    capturedImage={capturedImage}
                    webcamRef={webcamRef}
                    facingMode={facingMode}
                    handleToggleCamera={handleToggleCamera}
                    handleFileChange={handleFileChange}
                    captureImage={captureImage}
                    toggleCameraFacingMode={toggleCameraFacingMode}
                    retakePhoto={retakePhoto}
                    handleFormSubmit={handleFormSubmit}
                    loading={loading}
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

export default AddNormalWoman;
