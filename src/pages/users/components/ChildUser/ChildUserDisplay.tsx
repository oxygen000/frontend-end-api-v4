import UserProfileHeader from '../UserProfileHeader';
import UserImageModal from '../UserImageModal';
import ActionsSection from '../ActionsSection';
import DeleteConfirmModal from '../DeleteConfirmModal';
import IdentityVerificationSection from '../IdentityVerificationSection';
import BiometricVerificationSection from '../BiometricVerificationSection';
import DocumentVerificationSection from '../DocumentVerificationSection';
import type { User } from '../../types/types';
import { formatDate, maskSensitiveInfo } from '../../utils/utils';
import { useState } from 'react';
import { SECTION_COLORS } from '../../types/types';

interface ChildUserDisplayProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  navigate: (to: string | number) => void;
  onDelete: () => void;
}

const ChildUserDisplay = ({
  user,
  isRTL,
  t,
  navigate,
  onDelete,
}: ChildUserDisplayProps) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isIdentityRevealed] = useState(true);

  const maskInfo = (value: string | null | undefined) =>
    maskSensitiveInfo(value, isIdentityRevealed);

  return (
    <div className="p-3 sm:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Go Back button */}
      <div className="mb-4 sm:mb-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 sm:px-6 py-2 bg-blue-600/30 text-white rounded-md hover:bg-blue-700/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 backdrop-blur-lg backdrop-opacity-60 transition-all duration-300 text-sm sm:text-base"
        >
          {/* You can use an icon here if desired */}
          {t('common.back', 'Back to Search')}
        </button>
      </div>
      <UserProfileHeader
        user={user}
        isChildRecord={true}
        isRTL={isRTL}
        t={t}
        setImageModalOpen={setImageModalOpen}
        imageModalOpen={imageModalOpen}
      />
      <UserImageModal
        user={user}
        isChildRecord={true}
        t={t}
        imageModalOpen={imageModalOpen}
        setImageModalOpen={setImageModalOpen}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* 1. REPORTER INFORMATION */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.child.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.child.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.child.icon}`}
              ></span>
              {t('forms.child.reporterInfo', "Reporter's Information")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('users.reporterName', 'Reporter Name:')}
                value={maskInfo(user.reporter_name)}
              />
              <InfoRow
                label={t('users.reporterRelationship ', 'Reporter Relationship :')}
                value={maskInfo(user.reporter_relationship )}
              />
              <InfoRow
                label={t('users.reporterNationalId', 'Reporter National ID:')}
                value={maskInfo(user.reporter_national_id)}
              />
              <InfoRow
                label={t('users.reporterAddress', 'Reporter Address:')}
                value={maskInfo(user.reporter_address)}
              />
              <InfoRow
                label={t('users.reporterPhone', 'Reporter Phone:')}
                value={maskInfo(user.reporter_phone)}
              />
              <InfoRow
                label={t('users.reporterOccupation', 'Reporter Occupation:')}
                value={[
                  maskInfo(user.reporter_occupation),
                  user.reporter_education,
                ]
                  .filter(Boolean)
                  .join('، ')}
              />
              <InfoRow
                label={t(
                  'users.absence_report_number',
                  'absence_report_number'
                )}
                value={maskInfo(user.absence_report_number)}
              />
              <InfoRow
                label={t('users.absence_report_date', 'absence_report_date')}
                value={maskInfo(user.absence_report_date)}
              />
              <InfoRow
                label={t('users.police_station', 'police_station')}
                value={maskInfo(user.police_station)}
              />
              <InfoRow
                label={t('users.security_directorate', 'security_directorate')}
                value={maskInfo(user.security_directorate)}
              />
              <InfoRow
                label={t('users.governorate', 'governorate')}
                value={maskInfo(user.governorate)}
              />

              <InfoRow
                label={t('users.reporterSecondaryPhone', 'Secondary Phone:')}
                value={maskInfo(user.reporter_secondary_phone)}
              />
              <InfoRow
                label={t(
                  'forms.child.relationshipToMissing',
                  'Relationship to Missing Child:'
                )}
                value={maskInfo(user.reporter_relationship)}
              />
              <InfoRow
                label={t('users.reporterOccupation', 'Reporter Occupation:')}
                value={maskInfo(user.reporter_occupation)}
              />
              <InfoRow
                label={t('users.reporterEducation', 'Reporter Education:')}
                value={maskInfo(user.reporter_education)}
              />
            </div>
          </div>

          {/* 2. MISSING PERSON INFORMATION */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.child.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.child.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.child.icon}`}
              ></span>
              {t(
                'forms.child.missingPersonInfo',
                "Missing Person's Information"
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('users.fullName', 'Full Name:')}
                value={maskInfo(user.full_name || user.name)}
              />
              
              <InfoRow
                label={t('users.nationalId', 'National ID:')}
                value={maskInfo(user.national_id)}
              />
              <InfoRow
                label={t('users.gender', 'Gender:')}
                value={maskInfo(user.gender)}
              />
              <InfoRow
                label={t('users.dateOfBirth', 'Date of Birth:')}
                value={formatDate(user.dob || user.date_of_birth)}
              />
              <InfoRow
                label={t('users.age', 'Age:')}
                value={maskInfo(user.age)}
              />
              <InfoRow
                label={t('users.distinctive_mark', 'Distinctive Marks:')}
                value={formatDate(user.distinctive_mark)}
              />
              <InfoRow
                label={t('users.missing_person_phone', 'Missing Person Phone')}
                value={maskInfo(user.missing_person_phone)}
              />
              <InfoRow
                label={t(
                  'users.missing_person_education',
                  'missing_person_education'
                )}
                value={`${maskInfo(user.missing_person_education)} ${user.missing_person_education}`}
              />

              <InfoRow
                label={t('users.clothes', 'Clothes Description:')}
                value={maskInfo(user.clothes_description)}
              />
              <InfoRow
                label={t('users.medicalCondition', 'Medical Condition:')}
                value={maskInfo(user.medical_condition)}
              />
            </div>
          </div>

          {/* 3. DISAPPEARANCE LOCATION & DETAILS */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.child.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.child.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.child.icon}`}
              ></span>
              {t('forms.child.disappearanceDetails', 'Disappearance Details')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('users.areaOfDisappearance', 'Area of Disappearance:')}
                value={maskInfo(user.area_of_disappearance)}
              />
              <InfoRow
                label={t('users.disappearanceDate', 'Disappearance Date:')}
                value={formatDate(user.disappearance_date)}
              />
              <InfoRow
                label={t('users.disappearanceTime', 'Disappearance Time:')}
                value={maskInfo(user.disappearance_time)}
              />
              <InfoRow
                label={t('users.lastSighting', 'Last Sighting:')}
                value={maskInfo(user.last_sighting)}
              />
              <InfoRow
                label={t(
                  'users.reasonForLocation',
                  'Reason for Being at Location:'
                )}
                value={maskInfo(user.reason_for_location)}
              />
              <InfoRow
                label={t('users.wasAccompanied', 'Was Accompanied:')}
                value={maskInfo(user.was_accompanied)}
              />
              <InfoRow
                label={t('users.governorate', 'Governorate:')}
                value={maskInfo(user.governorate)}
              />
              <InfoRow
                label={t('users.treating_physician', 'treating physician:')}
                value={maskInfo(user.treating_physician)}
              />
              <InfoRow
                label={t('users.physician_phone', 'Physician Phone:')}
                value={maskInfo(user.physician_phone)}
              />
              <InfoRow
                label={t('users.was_accompanied', 'was_accompanied:')}
                value={maskInfo(user.was_accompanied)}
              />
              <InfoRow
                label={t('users.reason_for_location', 'reason_for_location:')}
                value={maskInfo(user.reason_for_location)}
              />
            </div>
          </div>

          {/* 4. POLICE REPORT INFORMATION */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.child.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.child.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.child.icon}`}
              ></span>
              {t('forms.child.policeReport', 'Police Report Information')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('users.previous_disputes', 'previous_disputes:')}
                value={maskInfo(user.previous_disputes)}
              />
              <InfoRow
                label={t('users.medical_history', 'medical_history:')}
                value={maskInfo(user.medical_history)}
              />
              <InfoRow
                label={t('users.treating_physician', 'treating_physician:')}
                value={maskInfo(user.treating_physician)}
              />
              <InfoRow
                label={t('users.physician_phone', 'physician_phone:')}
                value={maskInfo(user.physician_phone)}
              />
              <InfoRow
                label={t('users.first_friend', 'first_friend:')}
                value={maskInfo(user.first_friend)}
              />
              <InfoRow
                label={t('users.first_friend_phone', 'first_friend_phone:')}
                value={maskInfo(user.first_friend_phone)}
              />
              <InfoRow
                label={t('users.second_friend', 'second_friend:')}
                value={maskInfo(user.second_friend)}
              />
              <InfoRow
                label={t('users.second_friend_phone', 'second_friend_phone:')}
                value={maskInfo(user.second_friend_phone)}
              />
              <InfoRow
                label={t('users.gone_missing_before', 'gone_missing_before:')}
                value={formatDate(user.gone_missing_before)}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <ActionsSection
            user={user}
            isRTL={isRTL}
            t={t}
            onDeleteClick={() => setShowDeleteConfirm(true)}
            navigate={navigate}
          />
          <DeleteConfirmModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={onDelete}
            t={t}
          />
          <IdentityVerificationSection
            user={user}
            isIdentityRevealed={isIdentityRevealed}
            isRTL={isRTL}
            t={t}
            hasVehicleInfo={false}
          />
          <BiometricVerificationSection
            user={user}
            isIdentityRevealed={isIdentityRevealed}
            isRTL={isRTL}
            t={t}
            formatDate={formatDate}
          />
          <DocumentVerificationSection
            user={user}
            isIdentityRevealed={isIdentityRevealed}
            isRTL={isRTL}
            t={t}
            hasVehicleInfo={false}
          />
        </div>
      </div>
    </div>
  );
};

// Helper for info rows
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
    <span className="text-white/70 text-sm">{label}</span>
    <span className="text-white font-medium text-sm">{value || '-'}</span>
  </div>
);

export default ChildUserDisplay;
