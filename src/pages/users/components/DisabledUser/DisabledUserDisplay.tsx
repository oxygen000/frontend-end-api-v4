import UserProfileHeader from '../UserProfileHeader';
import UserImageModal from '../UserImageModal';
import ActionsSection from '../ActionsSection';
import DeleteConfirmModal from '../DeleteConfirmModal';
import IdentityVerificationSection from '../IdentityVerificationSection';
import BiometricVerificationSection from '../BiometricVerificationSection';
import DocumentVerificationSection from '../DocumentVerificationSection';
import type { User } from '../../types/types';
import { formatDate, calculateAge, maskSensitiveInfo } from '../../utils/utils';
import { useState } from 'react';
import { SECTION_COLORS } from '../../types/types';

interface DisabledUserDisplayProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  navigate: (to: string | number) => void;
  onDelete: () => void;
}

const DisabledUserDisplay = ({
  user,
  isRTL,
  t,
  navigate,
  onDelete,
}: DisabledUserDisplayProps) => {
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
        isChildRecord={false}
        isRTL={isRTL}
        t={t}
        setImageModalOpen={setImageModalOpen}
        imageModalOpen={imageModalOpen}
      />
      <UserImageModal
        user={user}
        isChildRecord={false}
        t={t}
        imageModalOpen={imageModalOpen}
        setImageModalOpen={setImageModalOpen}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Basic Information Section */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.disabled.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.disabled.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.disabled.icon}`}
              ></span>
              {t('sections.basic', 'Basic Information')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('basic.fullName', 'Full Name:')}
                value={maskInfo(user.name)}
              />
              <InfoRow
                label={t('basic.nationalId', 'National ID:')}
                value={maskInfo(user.national_id)}
              />
              <InfoRow
                label={t('basic.dateOfBirth', 'Date of Birth:')}
                value={formatDate(user.dob)}
              />
              <InfoRow
                label={t('basic.age', 'Age:')}
                value={
                  user.date_of_birth || user.dob
                    ? calculateAge(String(user.date_of_birth || user.dob))
                    : t('common.notAvailable', 'N/A')
                }
              />
              <InfoRow
                label={t('basic.gender', 'Gender:')}
                value={maskInfo(user.gender)}
              />
              <InfoRow
                label={t('basic.address', 'Address:')}
                value={maskInfo(user.address)}
              />
              <InfoRow
                label={t('basic.distinctive_mark', 'Distinctive Mark:')}
                value={maskInfo(user.distinctive_mark)}
              />
              <InfoRow
                label={t(
                  'basic.reporter_occupation',
                  'Missing Person Occupation:'
                )}
                value={maskInfo(user.missing_person_occupation)}
              />
              <InfoRow
                label={t(
                  'basic.reporter_education',
                  'Missing Person Education:'
                )}
                value={maskInfo(user.missing_person_education)}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.disabled.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.disabled.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.disabled.icon}`}
              ></span>
              {t('sections.contact', 'Contact Information')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('contact.phoneNumber', 'Phone Number:')}
                value={maskInfo(user.phone_number)}
              />
              <InfoRow
                label={t('contact.phoneCompany', 'Phone Company:')}
                value={maskInfo(user.phone_company)}
              />
              <InfoRow
                label={t('contact.secondPhoneNumber', 'Secondary Phone:')}
                value={maskInfo(user.second_phone_number)}
              />
              <InfoRow
                label={t('contact.first_friend', 'First Friend:')}
                value={maskInfo(user.first_friend)}
              />
              <InfoRow
                label={t('contact.second_friend', 'Second Friend:')}
                value={maskInfo(user.second_friend)}
              />
              <InfoRow
                label={t('contact.first_friend_phone', 'First Friend Phone:')}
                value={maskInfo(user.first_friend_phone)}
              />
              <InfoRow
                label={t('contact.second_friend_phone', 'Second Friend Phone:')}
                value={maskInfo(user.second_friend_phone)}
              />
            </div>
          </div>

          {/* Reporter Information Section */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.disabled.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.disabled.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.disabled.icon}`}
              ></span>
              {t('sections.reporter', 'Reporter Information')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('reporter.name', 'Reporter Name:')}
                value={maskInfo(user.guardian_name || user.reporter_name)}
              />
              <InfoRow
                label={t('reporter.relationship', 'Relationship:')}
                value={maskInfo(user.reporter_relationship)}
              />
              <InfoRow
                label={t('reporter.occupation', 'Reporter Occupation:')}
                value={maskInfo(user.reporter_occupation)}
              />
              <InfoRow
                label={t('reporter.education', 'Reporter Education:')}
                value={maskInfo(user.reporter_education)}
              />
              <InfoRow
                label={t(
                  'reporter.reporterNationalId',
                  'Reporter National ID:'
                )}
                value={maskInfo(user.reporter_national_id)}
              />
              <InfoRow
                label={t('reporter.phoneNumber', 'Reporter Phone:')}
                value={maskInfo(user.guardian_phone || user.reporter_phone)}
              />
              <InfoRow
                label={t('reporter.reporterSecondaryPhone', 'Secondary Phone:')}
                value={maskInfo(user.reporter_secondary_phone)}
              />
              <InfoRow
                label={t('reporter.address', 'Reporter Address:')}
                value={maskInfo(user.reporter_address)}
              />
              <InfoRow
                label={t(
                  'reporter.absenceReportNumber',
                  'Absence Report Number:'
                )}
                value={maskInfo(user.absence_report_number)}
              />
              <InfoRow
                label={t('reporter.absenceReportDate', 'Report Date:')}
                value={formatDate(user.absence_report_date)}
              />
              <InfoRow
                label={t('reporter.policeStation', 'Police Station:')}
                value={maskInfo(user.police_station)}
              />
              <InfoRow
                label={t(
                  'reporter.securityDirectorate',
                  'Security Directorate:'
                )}
                value={maskInfo(user.security_directorate)}
              />
            </div>
          </div>

          {/* Missing Information Section */}
          <div
            className={`bg-gradient-to-br ${SECTION_COLORS.disabled.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.disabled.border} shadow-lg`}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <span
                className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.disabled.icon}`}
              ></span>
              {t('sections.missing', 'Missing Information')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow
                label={t('missing.disappearanceDate', 'Date of Disappearance:')}
                value={formatDate(user.disappearance_date)}
              />
              <InfoRow
                label={t('missing.disappearanceTime', 'Time of Disappearance:')}
                value={maskInfo(user.disappearance_time)}
              />
              <InfoRow
                label={t(
                  'missing.areaOfDisappearance',
                  'Area of Disappearance:'
                )}
                value={maskInfo(user.area_of_disappearance)}
              />
              <InfoRow
                label={t('missing.lastSighting', 'Last Known Location:')}
                value={maskInfo(user.last_sighting)}
              />
              <InfoRow
                label={t('missing.clothesDescription', 'Clothes Description:')}
                value={maskInfo(user.clothes_description)}
              />
              <InfoRow
                label={t('missing.reasonForLocation', 'Reason for Location:')}
                value={maskInfo(user.reason_for_location)}
              />
              <InfoRow
                label={t('missing.lastSeenTime', 'Last Seen Time:')}
                value={maskInfo(user.last_seen_time)}
              />
              <InfoRow
                label={t('missing.wasAccompanied', 'Was Accompanied:')}
                value={maskInfo(user.was_accompanied)}
              />
              <InfoRow
                label={t('missing.previousDisputes', 'Previous Disputes:')}
                value={maskInfo(user.previous_disputes)}
              />
              <InfoRow
                label={t('missing.goneMissingBefore', 'Gone Missing Before:')}
                value={maskInfo(user.gone_missing_before)}
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
      {/* Recognition status for registered disabled individuals */}
      {user.is_recognized && (
        <div className="mb-4 flex items-center justify-center">
          <span className="inline-block bg-green-600/80 text-white px-4 py-2 rounded-full font-semibold text-base shadow-md">
            {t(
              'forms.disabled.recognized',
              'Recognized Registered Disabled Individual'
            )}
          </span>
        </div>
      )}
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

export default DisabledUserDisplay;
