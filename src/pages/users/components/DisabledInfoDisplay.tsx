import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import type { TranslationFunction } from '../types/types';
import type { User } from '../types/types';
import { SECTION_COLORS } from '../types/types';

interface DisabledInfoDisplayProps {
  user: User;
  isRTL: boolean;
  t: TranslationFunction;
  maskSensitiveInfo: (value: string | null | undefined) => string;
  formatDate: (date: string | null | undefined) => string;
}

function DisabledInfoDisplay({
  user,
  isRTL,
  t,
  maskSensitiveInfo,
  formatDate,
}: DisabledInfoDisplayProps) {
  return (
    <>
      {/* Reporter's Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`bg-gradient-to-br ${SECTION_COLORS.disabled.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.disabled.border} shadow-lg`}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
          <FiUser
            className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.disabled.icon}`}
            size={20}
          />
          {t('forms.disabled.reporterInfo', "Reporter's Information")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.reporterName', "Reporter's Name:")}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.guardian_name)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.reporterNationalId', 'National ID:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.guardian_id)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.reporterAddress', 'Address:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.address)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.reporterPhone', 'Phone Number:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.guardian_phone)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.reporterAltPhone', 'Additional Phone Number:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.second_phone_number || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t(
                'forms.disabled.relationshipToMissing',
                'Relationship to Missing Person:'
              )}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.category || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Missing Person's Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`bg-gradient-to-br ${SECTION_COLORS.disabled.gradient} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${SECTION_COLORS.disabled.border} shadow-lg mt-4 sm:mt-6`}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
          <FiUser
            className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${SECTION_COLORS.disabled.icon}`}
            size={20}
          />
          {t(
            'forms.disabled.missingPersonInfo',
            "Missing Person's Information"
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.missingPersonName', 'Name:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.name)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.age', 'Age:')}
            </span>
            <span className="text-white font-medium text-sm">
              {formatDate(user.dob || user.date_of_birth)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.nationalId', 'National ID (if available):')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.national_id || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.phoneNumber', 'Phone Number:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.phone_number || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t(
                'forms.disabled.disappearanceLocation',
                'Place of Disappearance:'
              )}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.area_of_disappearance || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t(
                'forms.disabled.dateOfDisappearance',
                'Date of Disappearance:'
              )}
            </span>
            <span className="text-white font-medium text-sm">
              {formatDate(user.last_seen_time) ||
                t('users.notAvailable', 'N/A')}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.lastSeenLocation', 'Last Seen Location:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.area_of_disappearance || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.distinguishingMark', 'Distinguishing Mark:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.physical_description || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.clothes', 'Clothing Description:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.last_clothes || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.previousDisputes', 'Previous Disputes:')}
            </span>
            <span className="text-white font-medium text-sm" dir="auto">
              {(() => {
                // Check for additional notes directly on user
                const userAsAny = user as unknown as Record<string, unknown>;

                if (
                  typeof userAsAny.additional_notes === 'string' &&
                  userAsAny.additional_notes.trim() !== ''
                ) {
                  return maskSensitiveInfo(
                    userAsAny.additional_notes as string
                  );
                }

                // Try parsing JSON from different fields
                const tryParseJson = (
                  value: unknown
                ): Record<string, unknown> | null => {
                  if (!value) return null;

                  // If it's already an object, use it directly
                  if (typeof value === 'object' && value !== null) {
                    return value as Record<string, unknown>;
                  }

                  // If it's a string that might be JSON, try to parse it
                  if (typeof value === 'string') {
                    try {
                      if (value.trim().startsWith('{')) {
                        return JSON.parse(value) as Record<string, unknown>;
                      }
                    } catch (e) {
                      console.log(`Failed to parse JSON: ${e}`);
                    }
                  }

                  return null;
                };

                // Try various fields that might contain our data
                const jsonData =
                  tryParseJson(userAsAny.additional_data) ||
                  tryParseJson(userAsAny.disabled_data) ||
                  tryParseJson(userAsAny.user_data);

                if (jsonData) {
                  // Look for specific fields first
                  if (
                    typeof jsonData.additional_notes === 'string' &&
                    jsonData.additional_notes !== ''
                  ) {
                    return maskSensitiveInfo(jsonData.additional_notes);
                  }

                  // If no specific field with value, display non-empty fields
                  const fieldsToDisplay = [
                    'disability_description',
                    'special_needs',
                    'medical_condition',
                    'additional_notes',
                  ];

                  for (const field of fieldsToDisplay) {
                    const value = jsonData[field];
                    if (typeof value === 'string' && value !== '') {
                      return maskSensitiveInfo(value);
                    }
                  }

                  // If no important fields found, return N/A
                  return t('users.notAvailable', 'N/A');
                }

                // If all else fails, show additional_data directly or N/A
                const additional_data = userAsAny.additional_data;
                return additional_data
                  ? maskSensitiveInfo(
                      // If it's a string and looks like JSON, show it formatted
                      typeof additional_data === 'string' &&
                        additional_data.startsWith('{')
                        ? t('users.jsonData', 'See details in JSON data')
                        : String(additional_data)
                    )
                  : t('users.notAvailable', 'N/A');
              })()}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.medicalHistory', 'Medical History:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(
                user.medical_condition || t('users.notAvailable', 'N/A')
              )}
            </span>
          </div>
        </div>

        {/* Disability-specific information */}
        <h3 className="text-base sm:text-lg font-semibold text-white mt-4 mb-3">
          {t('forms.disabled.disabilityInfo', 'Disability Information')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.disabilityType', 'Disability Type:')}
            </span>
            <span className="text-white font-medium text-sm">
              {user.disability_type &&
                t(
                  user.disability_type,
                  maskSensitiveInfo(user.disability_type)
                )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.disabilityDetails', 'Disability Description:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.disability_description)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.specialNeeds', 'Special Needs:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.special_needs)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('forms.disabled.emergencyContact', 'Emergency Contact:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.emergency_contact)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
            <span className="text-white/70 text-sm">
              {t('users.emergencyPhone', 'Emergency Phone:')}
            </span>
            <span className="text-white font-medium text-sm">
              {maskSensitiveInfo(user.emergency_phone)}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default DisabledInfoDisplay;
