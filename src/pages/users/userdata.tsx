import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslationWithFallback } from '../../hooks/useTranslationWithFallback';

// Component imports
import UserProfileHeader from './components/UserProfileHeader';
import UserImageModal from './components/UserImageModal';
import VehicleInfoSection from './components/AdultUser/VehicleInfoSection';
import DataAdultUser from './components/AdultUser/DataAdultUser';
import TravelInfoSection from './components/AdultUser/TravelInfoSection';
import CaseInfoSection from './components/AdultUser/CaseInfoSection';
import IdentityVerificationSection from './components/IdentityVerificationSection';
import PhoneNumbersSection from './components/PhoneNumbersSection';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ActionsSection from './components/ActionsSection';
import BiometricVerificationSection from './components/BiometricVerificationSection';
import DocumentVerificationSection from './components/DocumentVerificationSection';
import ChildUserDisplay from './components/ChildUser/ChildUserDisplay';
import DisabledUserDisplay from './components/DisabledUser/DisabledUserDisplay';

// Types and utilities
import type { User } from './types/types';
import { formatDate, maskSensitiveInfo } from './utils/utils';

function Userdata() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isIdentityRevealed] = useState<boolean>(true);
  const [showEmptyFields] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [modalDefaultView, setModalDefaultView] = useState<'user' | 'searched'>(
    'user'
  );
  const { t, isRTL } = useTranslationWithFallback();

  // استخراج معلومات البحث من navigation state
  const searchData = location.state as {
    searchedImage?: string;
    searchedPersonName?: string;
    isFromSearch?: boolean;
    searchConfidence?: number;
  } | null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://backend-fast-api-ai.fly.dev/api/users/${id}`
        );

        if (response.data && response.data.status === 'success') {
          setUser(response.data.user);
        } else {
          setError('Failed to load user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);

        // Check if it's a 404 error and provide a more specific message
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError(
            `User ID ${id} was not found in the database. This could happen if the registration was not completed successfully.`
          );
        } else {
          setError(
            'An error occurred while fetching user data. Please try again later.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://backend-fast-api-ai.fly.dev/api/users/${id}`
      );

      if (response.data && response.data.status === 'success') {
        navigate('/search');
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('An error occurred while deleting the user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100/20 backdrop-blur-md border border-red-400/30 text-red-700 px-4 py-3 rounded">
          <p>{error || t('users.notFound', 'User not found')}</p>
          <button
            onClick={() => navigate('/search')}
            className="mt-2 bg-blue-600/70 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          >
            {t('common.back', 'Back to Search')}
          </button>
        </div>
      </div>
    );
  }

  // Check if user is a child record
  const isChildRecord = user.form_type === 'child';

  // Check if user is a disabled person
  const isDisabledPerson = user.form_type === 'disabled';

  // Check if user is an adult (man or woman)
  const isAdult =
    user.form_type === 'adult' ||
    user.form_type === 'man' ||
    user.form_type === 'woman';

  if (isChildRecord) {
    return (
      <ChildUserDisplay
        user={user}
        isRTL={isRTL}
        t={t}
        navigate={(to) => {
          console.log('🔗 userdata.tsx: Navigation called with:', to);

          if (typeof to === 'number') {
            // Navigate by delta (back/forward)
            navigate(to);
          } else if (typeof to === 'string') {
            // Navigate to path
            navigate(to);
          } else if (typeof to === 'object' && to.path) {
            // Navigate with state (for edit mode)
            console.log('🔗 Navigation with state:', to.state);
            navigate(to.path, { state: to.state });
          }
        }}
        onDelete={handleDelete}
        searchedPersonImage={searchData?.searchedImage}
        isSearching={searchData?.isFromSearch}
        searchedPersonName={searchData?.searchedPersonName}
      />
    );
  }
  if (isDisabledPerson) {
    return (
      <DisabledUserDisplay
        user={user}
        isRTL={isRTL}
        t={t}
        navigate={(to) => {
          console.log(
            '🔗 userdata.tsx: Navigation called for disabled user with:',
            to
          );

          if (typeof to === 'number') {
            // Navigate by delta (back/forward)
            navigate(to);
          } else if (typeof to === 'string') {
            // Navigate to path
            navigate(to);
          } else if (typeof to === 'object' && to.path) {
            // Navigate with state (for edit mode)
            console.log('🔗 Navigation with state:', to.state);
            navigate(to.path, { state: to.state });
          }
        }}
        onDelete={handleDelete}
        searchedPersonImage={searchData?.searchedImage}
        isSearching={searchData?.isFromSearch}
        searchedPersonName={searchData?.searchedPersonName}
      />
    );
  }

  // Always check for vehicle information for all users - only consider ACTUAL values
  const hasVehicleInfo = Boolean(
    // Legacy fields
    (user.vehicle_model && user.vehicle_model.trim()) ||
      (user.license_plate && user.license_plate.trim()) ||
      (user.vehicle_color && user.vehicle_color.trim()) ||
      (user.chassis_number && user.chassis_number.trim()) ||
      (user.vehicle_number && user.vehicle_number.trim()) ||
      (user.license_expiration && user.license_expiration.trim()) ||
      // New fields
      user.has_vehicle === 1 ||
      user.has_motorcycle === 1 ||
      (user.color && user.color.trim()) ||
      (user.license_expiration_date && user.license_expiration_date.trim()) ||
      (user.manufacture_year && user.manufacture_year.trim()) ||
      (user.traffic_department && user.traffic_department.trim()) ||
      (user.brand && user.brand.trim()) ||
      (user.license_type && user.license_type.trim()) ||
      (user.traffic_unit && user.traffic_unit.trim()) ||
      // Also check for nested vehicle_info if it exists
      (user.vehicle_info &&
        Object.values(user.vehicle_info).some((value) =>
          Boolean(value && String(value).trim())
        )) ||
      // Penalty fields
      (user.vehicle_penalty && user.vehicle_penalty.trim()) ||
      (user.penalty_amount && user.penalty_amount.trim()) ||
      (user.penalty_date && user.penalty_date.trim()) ||
      (user.penalty_location && user.penalty_location.trim()) ||
      (user.penalty_info &&
        Object.values(user.penalty_info).some((v) => v && String(v).trim()))
  );

  // Check for travel information - only consider ACTUAL values
  const hasTravelInfo = Boolean(
    // Legacy fields
    (user.travel_date && user.travel_date.trim()) ||
      (user.travel_destination && user.travel_destination.trim()) ||
      (user.arrival_airport && user.arrival_airport.trim()) ||
      (user.arrival_date && user.arrival_date.trim()) ||
      (user.flight_number && user.flight_number.trim()) ||
      (user.return_date && user.return_date.trim()) ||
      // New fields
      (user.passport_number && user.passport_number.trim()) ||
      (user.departure_airport && user.departure_airport.trim()) ||
      (user.departure_country && user.departure_country.trim()) ||
      (user.departure_destination && user.departure_destination.trim()) ||
      (user.departure_date && user.departure_date.trim()) ||
      (user.departure_time && user.departure_time.trim()) ||
      (user.departure_airline && user.departure_airline.trim()) ||
      (user.departure_flight_number && user.departure_flight_number.trim()) ||
      (user.destination && user.destination.trim()) ||
      (user.departure_datetime && user.departure_datetime.trim()) ||
      (user.arrival_origin && user.arrival_origin.trim()) ||
      (user.arrival_destination && user.arrival_destination.trim()) ||
      (user.arrival_airline && user.arrival_airline.trim()) ||
      (user.arrival_flight_number && user.arrival_flight_number.trim()) ||
      (user.arrival_time && user.arrival_time.trim()) ||
      (user.arrival_datetime && user.arrival_datetime.trim()) ||
      (user.return_airport && user.return_airport.trim()) ||
      (user.return_flight_number && user.return_flight_number.trim())
  );

  // Helper function for masking sensitive information with isIdentityRevealed check
  const maskInfo = (value: string | null | undefined) => {
    return maskSensitiveInfo(value, isIdentityRevealed);
  };

  const hasCaseInfo = Boolean(
    user.record_number ||
      user.court_governorate ||
      user.case_number ||
      user.dossier_number ||
      user.charge ||
      user.judgment ||
      user.sentence
  );
  return (
    <div className="p-3 sm:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <div className="mb-4 sm:mb-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 sm:px-6 py-2 bg-blue-600/30 text-white rounded-md hover:bg-blue-700/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 backdrop-blur-lg backdrop-opacity-60 transition-all duration-300 text-sm sm:text-base"
        >
          {t('common.back', 'Back to Search')}
        </button>
      </div>

      {/* User profile header */}
      <UserProfileHeader
        user={user}
        isChildRecord={isChildRecord}
        isRTL={isRTL}
        t={t}
        setImageModalOpen={setImageModalOpen}
        imageModalOpen={imageModalOpen}
        searchedPersonImage={searchData?.searchedImage}
        isSearching={searchData?.isFromSearch}
        searchedPersonName={searchData?.searchedPersonName}
        setModalDefaultView={setModalDefaultView}
      />

      {/* Image Modal */}
      <UserImageModal
        user={user}
        isChildRecord={isChildRecord}
        t={t}
        imageModalOpen={imageModalOpen}
        setImageModalOpen={setImageModalOpen}
        searchedPersonImage={searchData?.searchedImage}
        isSearching={searchData?.isFromSearch}
        searchedPersonName={searchData?.searchedPersonName}
        defaultView={modalDefaultView}
        isRTL={isRTL}
      />

      {/* User details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left column - Main information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Personal Information */}

          {/* Adult Information Section (both man and woman) */}
          {isAdult && (
            <>
              <DataAdultUser
                user={user}
                t={t}
                showEmptyFields={showEmptyFields}
                maskSensitiveInfo={maskInfo}
                formatDate={formatDate}
              />

              {/* Case Information */}
              {hasCaseInfo && (
                <CaseInfoSection
                  user={user}
                  t={t}
                  maskSensitiveInfo={maskInfo}
                />
              )}
              {/* Vehicle Information - only show when vehicle data exists */}
              {hasVehicleInfo && <VehicleInfoSection user={user} t={t} />}

              {/* Travel Information - only show when travel data exists */}
              {hasTravelInfo && (
                <TravelInfoSection user={user} t={t} formatDate={formatDate} />
              )}
            </>
          )}

          {/* Phone Numbers Section */}
          <PhoneNumbersSection
            user={user}
            t={t}
            maskSensitiveInfo={maskInfo}
            formatDate={formatDate}
          />
        </div>

        {/* Right column - Actions and Identity Verification */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Actions */}
          <ActionsSection
            user={user}
            isRTL={isRTL}
            t={t}
            onDeleteClick={() => setShowDeleteConfirm(true)}
            navigate={navigate}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            t={t}
          />

          {/* Identity Verification */}
          <IdentityVerificationSection
            user={user}
            isIdentityRevealed={isIdentityRevealed}
            isRTL={isRTL}
            t={t}
            hasVehicleInfo={Boolean(hasVehicleInfo)}
          />

          {/* Biometric Verification */}
          <BiometricVerificationSection
            user={user}
            isIdentityRevealed={isIdentityRevealed}
            isRTL={isRTL}
            t={t}
            formatDate={formatDate}
          />

          {/* Document Verification */}
          <DocumentVerificationSection
            user={user}
            isIdentityRevealed={isIdentityRevealed}
            isRTL={isRTL}
            t={t}
            hasVehicleInfo={Boolean(hasVehicleInfo)}
          />
        </div>
      </div>
    </div>
  );
}

export default Userdata;
