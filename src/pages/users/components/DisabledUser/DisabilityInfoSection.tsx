import React from 'react';
import { FiInfo } from 'react-icons/fi';
import type { User } from '../../types/types';

interface DisabilityInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  maskSensitiveInfo: (value: string | null | undefined) => string;
  formatDate: (dateString: string | null | undefined) => string;
  showEmptyFields: boolean;
}

const DisabilityInfoSection: React.FC<DisabilityInfoSectionProps> = ({
  user,
  isRTL,
  t,
  maskSensitiveInfo,
  showEmptyFields,
}) => {
  // Check if there's any disability information to display
  const hasDisabilityInfo = Boolean(
    user.disability_type ||
      user.disability_description ||
      user.medical_condition ||
      user.special_needs ||
      user.emergency_contact ||
      user.emergency_phone ||
      user.treating_physician ||
      user.physician_phone
  );

  if (!hasDisabilityInfo && !showEmptyFields) {
    return null;
  }

  return (
    <div className="bg-purple-900/20 backdrop-blur-lg backdrop-opacity-60 rounded-xl p-4 sm:p-6 shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
        <FiInfo className={`${isRTL ? 'ml-2' : 'mr-2'} text-purple-400`} />
        {t('users.disabilityInfo', 'Disability Information')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Disability Type */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.disabilityType', 'Disability Type')}
          </h3>
          <p className="text-white">
            {user.disability_type || t('common.notAvailable', 'N/A')}
          </p>
        </div>

        {/* Disability Description */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.disabilityDescription', 'Disability Description')}
          </h3>
          <p className="text-white">
            {user.disability_description || t('common.notAvailable', 'N/A')}
          </p>
        </div>
      </div>

      {/* Medical Information */}
      <h3 className="text-md font-semibold text-purple-300 mt-4 mb-2">
        {t('users.medicalInformation', 'Medical Information')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medical Condition */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.medicalCondition', 'Medical Condition')}
          </h3>
          <p className="text-white">
            {user.medical_condition || t('common.notAvailable', 'N/A')}
          </p>
        </div>

        {/* Special Needs */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.specialNeeds', 'Special Needs')}
          </h3>
          <p className="text-white">
            {user.special_needs || t('common.notAvailable', 'N/A')}
          </p>
        </div>

        {/* Treating Physician */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.treatingPhysician', 'Treating Physician')}
          </h3>
          <p className="text-white">
            {user.treating_physician || t('common.notAvailable', 'N/A')}
          </p>
        </div>

        {/* Physician Phone */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.physicianPhone', 'Physician Phone')}
          </h3>
          <p className="text-white">
            {maskSensitiveInfo(user.physician_phone) ||
              t('common.notAvailable', 'N/A')}
          </p>
        </div>
      </div>

      {/* Emergency Contact Information */}
      <h3 className="text-md font-semibold text-purple-300 mt-4 mb-2">
        {t('users.emergencyContactInfo', 'Emergency Contact Information')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.emergencyContact', 'Emergency Contact')}
          </h3>
          <p className="text-white">
            {user.emergency_contact || t('common.notAvailable', 'N/A')}
          </p>
        </div>

        {/* Emergency Phone */}
        <div>
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.emergencyPhone', 'Emergency Phone')}
          </h3>
          <p className="text-white">
            {maskSensitiveInfo(user.emergency_phone) ||
              t('common.notAvailable', 'N/A')}
          </p>
        </div>
      </div>

      {/* Friend Information */}
      {(user.first_friend || user.second_friend || showEmptyFields) && (
        <>
          <h3 className="text-md font-semibold text-purple-300 mt-4 mb-2">
            {t('users.friendInformation', 'Friend Information')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Friend */}
            <div>
              <h3 className="text-sm text-purple-300 font-medium">
                {t('users.firstFriend', 'First Friend')}
              </h3>
              <p className="text-white">
                {user.first_friend || t('common.notAvailable', 'N/A')}
              </p>
            </div>

            {/* First Friend Phone */}
            <div>
              <h3 className="text-sm text-purple-300 font-medium">
                {t('users.firstFriendPhone', 'First Friend Phone')}
              </h3>
              <p className="text-white">
                {maskSensitiveInfo(user.first_friend_phone) ||
                  t('common.notAvailable', 'N/A')}
              </p>
            </div>

            {/* Second Friend */}
            <div>
              <h3 className="text-sm text-purple-300 font-medium">
                {t('users.secondFriend', 'Second Friend')}
              </h3>
              <p className="text-white">
                {user.second_friend || t('common.notAvailable', 'N/A')}
              </p>
            </div>

            {/* Second Friend Phone */}
            <div>
              <h3 className="text-sm text-purple-300 font-medium">
                {t('users.secondFriendPhone', 'Second Friend Phone')}
              </h3>
              <p className="text-white">
                {maskSensitiveInfo(user.second_friend_phone) ||
                  t('common.notAvailable', 'N/A')}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Additional Notes */}
      {user.additional_notes && (
        <div className="mt-4">
          <h3 className="text-sm text-purple-300 font-medium">
            {t('users.additionalNotes', 'Additional Notes')}
          </h3>
          <p className="text-white whitespace-pre-wrap">
            {user.additional_notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default DisabilityInfoSection;
