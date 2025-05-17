import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { useTranslationWithFallback } from '../../hooks/useTranslationWithFallback';

// Component imports
import UserProfileHeader from './components/UserProfileHeader';
import UserImageModal from './components/UserImageModal';
import VehicleInfoSection from './components/VehicleInfoSection';
import PersonalInfoSection from './components/PersonalInfoSection';
import TravelInfoSection from './components/TravelInfoSection';
import CaseInfoSection from './components/CaseInfoSection';
import IdentityVerificationSection from './components/IdentityVerificationSection';
import ChildInfoSection from './components/ChildInfoSection';
import CommonInfoSection from './components/CommonInfoSection';
import PhoneNumbersSection from './components/PhoneNumbersSection';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ActionsSection from './components/ActionsSection';
import BiometricVerificationSection from './components/BiometricVerificationSection';
import DocumentVerificationSection from './components/DocumentVerificationSection';
import DisabledInfoDisplay from './components/DisabledInfoDisplay';

// Types and utilities
import type { User } from './types/types';
import { formatDate, calculateAge, maskSensitiveInfo } from './utils/utils';

function Userdata() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isIdentityRevealed] = useState<boolean>(true);
  const [showEmptyFields] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const { t, isRTL } = useTranslationWithFallback();

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

  // Always check for vehicle information for all users
  const hasVehicleInfo =
    user.vehicle_model ||
    user.license_plate ||
    user.vehicle_color ||
    user.chassis_number ||
    user.vehicle_number ||
    user.license_expiration;

  // Helper function for masking sensitive information with isIdentityRevealed check
  const maskInfo = (value: string | null | undefined) => {
    return maskSensitiveInfo(value, isIdentityRevealed);
  };

  return (
    <div className="p-3 sm:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Back button */}
      <div className="mb-4 sm:mb-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 sm:px-6 py-2 bg-blue-600/30 text-white rounded-md hover:bg-blue-700/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 backdrop-blur-lg backdrop-opacity-60 transition-all duration-300 text-sm sm:text-base"
        >
          <FiArrowLeft className={`inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
      />

      {/* Image Modal */}
      <UserImageModal
        user={user}
        isChildRecord={isChildRecord}
        t={t}
        imageModalOpen={imageModalOpen}
        setImageModalOpen={setImageModalOpen}
      />

      {/* User details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left column - Main information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <PersonalInfoSection
            user={user}
            isRTL={isRTL}
            t={t}
            showEmptyFields={showEmptyFields}
            maskSensitiveInfo={maskInfo}
            formatDate={formatDate}
          />

          {/* Child Information Section */}
          {isChildRecord && (
            <ChildInfoSection
              user={user}
              isRTL={isRTL}
              t={t}
              maskSensitiveInfo={maskInfo}
              formatDate={formatDate}
              calculateAge={calculateAge}
              showEmptyFields={showEmptyFields}
            />
          )}

          {/* Disabled Person Information Section */}
          {isDisabledPerson && (
            <DisabledInfoDisplay
              user={user}
              isRTL={isRTL}
              t={t}
              maskSensitiveInfo={maskInfo}
              formatDate={formatDate}
            />
          )}

          {/* Adult Information Section (both man and woman) */}
          {isAdult && (
            <>
              {/* Vehicle Information (shown for all adults regardless of gender) */}
              <VehicleInfoSection user={user} isRTL={isRTL} t={t} />

              {/* Travel Information */}
              <TravelInfoSection
                user={user}
                isRTL={isRTL}
                t={t}
                formatDate={formatDate}
              />

              {/* Case Information */}
              <CaseInfoSection
                user={user}
                isRTL={isRTL}
                t={t}
                maskSensitiveInfo={maskInfo}
              />
            </>
          )}

          {/* Common Information Section */}
          <CommonInfoSection
            user={user}
            isRTL={isRTL}
            t={t}
            maskSensitiveInfo={maskInfo}
            formatDate={formatDate}
          />

          {/* Phone Numbers Section */}
          <PhoneNumbersSection
            user={user}
            isRTL={isRTL}
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
