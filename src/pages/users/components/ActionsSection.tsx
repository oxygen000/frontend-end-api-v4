import { motion } from 'framer-motion';
import { FiActivity, FiFileText, FiTrash2 } from 'react-icons/fi';
import type { TranslationFunction } from '../types/types';
import type { User } from '../types/types';

interface ActionsSectionProps {
  user: User;
  isRTL: boolean;
  t: TranslationFunction;
  onDeleteClick: () => void;
  navigate: (
    path: string,
    options?: {
      state?: { editMode: boolean; editUserId: string; userData: User };
    }
  ) => void;
}

function ActionsSection({
  user,
  isRTL,
  t,
  onDeleteClick,
  navigate,
}: ActionsSectionProps) {
  // Determine the correct edit path based on form type
  const getEditPath = () => {
    if (user.form_type === 'child') {
      return `/register/child`;
    } else if (user.form_type === 'disabled') {
      return `/register/disabled`;
    } else if (user.form_type === 'woman') {
      return `/register/woman`;
    } else {
      // For all other adult types (man, adult)
      return `/register/man`;
    }
  };

  // Handle edit navigation with user data
  const handleEdit = () => {
    const editPath = getEditPath();

    // Enhanced data preparation based on form type
    let preparedUserData;

    if (user.form_type === 'child') {
      // Child-specific data preparation
      preparedUserData = {
        ...user,
        // CRITICAL: Ensure the user ID is always present for edit mode
        id: user.id,

        // Ensure critical fields are properly mapped for child form
        full_name: user.full_name || user.name || '',
        name: user.name || user.full_name || '',
        date_of_birth: user.date_of_birth || user.dob || '',
        dob: user.dob || user.date_of_birth || '',

        // Contact and basic info
        address: user.address || user.reporter_address || '',

        // Guardian/Reporter mapping with comprehensive fallbacks
        guardian_name: user.guardian_name || user.reporter_name || '',
        guardian_phone: user.guardian_phone || user.reporter_phone || '',
        guardian_id: user.guardian_id || user.reporter_national_id || '',
        guardian_relationship:
          user.guardian_relationship || user.reporter_relationship || '',

        // Reverse mapping for reporter fields (critical for child forms)
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

        // Disappearance details with comprehensive mapping
        area_of_disappearance:
          user.area_of_disappearance || user.last_sighting || '',
        last_sighting: user.last_sighting || user.area_of_disappearance || '',

        // Time/Date fields
        disappearance_date:
          user.disappearance_date || user.last_seen_time || '',
        last_seen_time: user.last_seen_time || user.disappearance_date || '',
        disappearance_time: user.disappearance_time || '',

        // Clothes and appearance
        clothes_description:
          user.clothes_description || user.last_clothes || '',
        last_clothes: user.last_clothes || user.clothes_description || '',
        physical_description: user.physical_description || '',
        distinctive_mark: user.distinctive_mark || '',

        // Medical information
        medical_history: user.medical_history || '',
        medical_condition: user.medical_condition || '',
        treating_physician: user.treating_physician || '',
        physician_phone: user.physician_phone || '',

        // Friends information
        first_friend: user.first_friend || '',
        first_friend_phone: user.first_friend_phone || '',
        second_friend: user.second_friend || '',
        second_friend_phone: user.second_friend_phone || '',

        // Missing person details
        phone_number: user.phone_number || user.missing_person_phone || '',
        missing_person_occupation: user.missing_person_occupation || '',
        missing_person_education: user.missing_person_education || '',

        // Police and legal information
        absence_report_number: user.absence_report_number || '',
        absence_report_date: user.absence_report_date || '',
        police_station: user.police_station || '',
        security_directorate: user.security_directorate || '',
        governorate: user.governorate || '',
        previous_disputes: user.previous_disputes || '',
        gone_missing_before: user.gone_missing_before || '',

        // Additional fields
        was_accompanied: user.was_accompanied || '',
        reason_for_location: user.reason_for_location || '',
        additional_notes: user.additional_notes || '',
        phone_company: user.phone_company || '',

        // Form type
        form_type: 'child',
      };
    } else if (user.form_type === 'disabled') {
      // Disabled-specific data preparation
      preparedUserData = {
        ...user,
        // CRITICAL: Ensure the user ID is always present for edit mode
        id: user.id,

        // Basic information with proper mapping
        full_name: user.full_name || user.name || '',
        name: user.name || user.full_name || '',
        date_of_birth: user.date_of_birth || user.dob || '',
        dob: user.dob || user.date_of_birth || '',

        // Contact information
        address: user.address || user.reporter_address || '',
        phone_number: user.phone_number || user.missing_person_phone || '',
        phone_company: user.phone_company || user.service_provider || '',
        second_phone_number: user.second_phone_number || '',

        // Disability-specific information
        disability_type: user.disability_type || '',
        disability_description: user.disability_description || '',
        medical_history: user.medical_history || '',
        special_needs: user.special_needs || '',
        emergency_contact: user.emergency_contact || '',
        emergency_phone: user.emergency_phone || '',

        // Reporter/Guardian information for disabled persons
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

        // Medical information
        treating_physician: user.treating_physician || '',
        physician_phone: user.physician_phone || '',

        // Physical description
        distinctive_mark:
          user.distinctive_mark || user.physical_description || '',
        physical_description:
          user.physical_description || user.distinctive_mark || '',

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

        // Missing person details
        missing_person_phone: user.missing_person_phone || '',
        missing_person_occupation: user.missing_person_occupation || '',
        missing_person_education: user.missing_person_education || '',

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

        // Form type
        form_type: 'disabled',
      };

      // Store original image path if exists for edit mode
      if (user.image_path) {
        console.log('🖼️ User has existing image:', user.image_path);
        // Add originalImagePath to the prepared data
        (
          preparedUserData as User & { originalImagePath?: string }
        ).originalImagePath = user.image_path;
      }
    } else if (user.form_type === 'woman') {
      // Woman-specific data preparation
      preparedUserData = {
        ...user,
        // CRITICAL: Ensure the user ID is always present for edit mode
        id: user.id,

        // Basic personal information
        full_name: user.full_name || user.name || '',
        name: user.name || user.full_name || '',
        nickname: user.nickname || '',
        date_of_birth: user.date_of_birth || user.dob || '',
        dob: user.dob || user.date_of_birth || '',
        mothers_name: user.mothers_name || '',
        marital_status: user.marital_status || '',
        educational_qualification: user.educational_qualification || '',
        occupation: user.occupation || '',
        national_id: user.national_id || '',
        issuing_authority: user.issuing_authority || '',
        issue_date: user.issue_date || '',
        governorate: user.governorate || '',

        // Contact information
        address: user.address || '',
        phone_number: user.phone_number || '',
        phone_company: user.phone_company || '',
        service_provider: user.service_provider || '',
        second_phone_number: user.second_phone_number || '',
        landline_number: user.landline_number || '',

        // Criminal record information
        has_criminal_record: Boolean(user.has_criminal_record),
        case_details: user.case_details || '',
        police_station: user.police_station || '',
        case_number: user.case_number || '',
        judgment: user.judgment || '',
        record_number: user.record_number || '',
        dossier_number: user.dossier_number || '',
        charge: user.charge || '',
        sentence: user.sentence || '',
        accusation: user.accusation || '',
        court_governorate: user.court_governorate || '',

        // Travel information
        has_travel: Boolean(
          user.travel_date || user.departure_date || user.passport_number
        ),
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

        // Vehicle information
        has_vehicle: Boolean(
          user.has_vehicle || user.vehicle_number || user.license_plate
        ),
        vehicle_number: user.vehicle_number || '',
        license_plate: user.license_plate || '',
        license_type: user.license_type || '',
        traffic_unit: user.traffic_unit || '',
        license_expiration: user.license_expiration || '',
        chassis_number: user.chassis_number || '',
        license_governorate: user.license_governorate || '',
        brand: user.brand || '',
        vehicle_color: user.vehicle_color || user.color || '',
        vehicle_model: user.vehicle_model || '',
        manufacture_year: user.manufacture_year || '',
        expiration_year: user.expiration_year || '',
        traffic_department: user.traffic_department || '',
        vehicle_type: user.vehicle_type || '',

        // Additional information
        additional_notes: user.additional_notes || '',

        form_type: 'woman',
      } as unknown as User;
    } else {
      // Default mapping for other form types (men, adults)
      preparedUserData = {
        ...user,
        // CRITICAL: Ensure the user ID is always present for edit mode
        id: user.id,

        // Basic personal information
        full_name: user.full_name || user.name || '',
        name: user.name || user.full_name || '',
        nickname: user.nickname || '',
        date_of_birth: user.date_of_birth || user.dob || '',
        dob: user.dob || user.date_of_birth || '',
        mothers_name: user.mothers_name || '',
        marital_status: user.marital_status || '',
        educational_qualification: user.educational_qualification || '',
        occupation: user.occupation || '',
        national_id: user.national_id || '',
        issuing_authority: user.issuing_authority || '',
        issue_date: user.issue_date || '',
        governorate: user.governorate || '',

        // Contact information
        address: user.address || '',
        phone_number: user.phone_number || '',
        phone_company: user.phone_company || '',
        service_provider: user.service_provider || '',
        second_phone_number: user.second_phone_number || '',
        landline_number: user.landline_number || '',

        // Criminal record information
        has_criminal_record: Boolean(user.has_criminal_record),
        case_details: user.case_details || '',
        police_station: user.police_station || '',
        case_number: user.case_number || '',
        judgment: user.judgment || '',
        record_number: user.record_number || '',
        dossier_number: user.dossier_number || '',
        charge: user.charge || '',
        sentence: user.sentence || '',
        accusation: user.accusation || '',
        court_governorate: user.court_governorate || '',

        // Travel information
        has_travel: Boolean(
          user.travel_date || user.departure_date || user.passport_number
        ),
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

        // Vehicle information
        has_vehicle: Boolean(
          user.has_vehicle || user.vehicle_number || user.license_plate
        ),
        vehicle_number: user.vehicle_number || '',
        license_plate: user.license_plate || '',
        license_type: user.license_type || '',
        traffic_unit: user.traffic_unit || '',
        license_expiration: user.license_expiration || '',
        chassis_number: user.chassis_number || '',
        license_governorate: user.license_governorate || '',
        brand: user.brand || '',
        vehicle_color: user.vehicle_color || user.color || '',
        vehicle_model: user.vehicle_model || '',
        manufacture_year: user.manufacture_year || '',
        expiration_year: user.expiration_year || '',
        traffic_department: user.traffic_department || '',
        vehicle_type: user.vehicle_type || '',

        // Additional information
        additional_notes: user.additional_notes || '',

        form_type: 'man',
      } as unknown as User;
    }

    // Pass user data through navigation state
    navigate(editPath, {
      state: {
        editMode: true,
        editUserId: user.id,
        userData: preparedUserData,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiActivity
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} text-white`}
          size={20}
        />
        {t('users.actions', 'Actions')}
      </h2>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleEdit}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600/70 to-green-700/70 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center text-sm sm:text-base"
        >
          <FiFileText className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('users.editInformation', 'Edit Information')}
        </button>

        <button
          onClick={onDeleteClick}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600/70 to-red-700/70 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center text-sm sm:text-base"
        >
          <FiTrash2 className={`${isRTL ? 'ml-2' : 'mr-2'}`} />{' '}
          {t('common.delete', 'Delete Record')}
        </button>
      </div>
    </motion.div>
  );
}

export default ActionsSection;
