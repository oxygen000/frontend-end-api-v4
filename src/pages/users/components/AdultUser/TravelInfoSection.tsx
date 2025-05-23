import { motion } from 'framer-motion';
import { FiMap } from 'react-icons/fi';
import type { User } from '../../types/types';

interface TravelInfoSectionProps {
  user: User;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  formatDate: (date: string | null | undefined) => string;
}

const TravelInfoSection = ({
  user,
  isRTL,
  t,
  formatDate,
}: TravelInfoSectionProps) => {
  const hasTravelInfo = Boolean(
    user.travel_date ||
      user.travel_destination ||
      user.arrival_airport ||
      user.arrival_date ||
      user.flight_number ||
      user.return_date ||
      user.passport_number ||
      user.passport_issue_date ||
      user.passport_expiry_date ||
      user.departure_airport ||
      user.departure_country ||
      user.departure_destination ||
      user.departure_date ||
      user.departure_airline ||
      user.departure_flight_number ||
      user.destination ||
      user.arrival_origin ||
      user.arrival_destination ||
      user.arrival_airline ||
      user.arrival_flight_number
  );

  if (!hasTravelInfo) return null;

  // مكون فرعي لعرض صف معلومات مع تسمية وقيمة
  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value?: string | null;
  }) => (
    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
      <span className="text-white/70 text-sm">{label}</span>
      <span className="text-white font-medium text-sm">
        {value || t('users.notAvailable', 'N/A')}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-gradient-to-br ${
        user.form_type === 'woman'
          ? 'from-pink-500/20 to-pink-500/10'
          : 'from-blue-500/20 to-blue-500/10'
      } backdrop-blur-md rounded-xl p-4 sm:p-6 border ${
        user.form_type === 'woman' ? 'border-pink-500/30' : 'border-blue-500/30'
      } shadow-lg`}
    >
      {/* العنوان */}
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiMap
          className={`${isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'} ${
            user.form_type === 'woman' ? 'text-pink-400' : 'text-blue-400'
          }`}
          size={20}
        />
        {t('users.travelInfo', 'Travel Information')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <InfoRow
          label={t('registration.passportNumber', 'Passport Number:')}
          value={user.passport_number}
        />
        
       

        <InfoRow
          label={t('registration.departureCountry', 'Departure Country:')}
          value={user.departure_country}
        />
        <InfoRow
          label={t(
            'registration.departureDestination',
            'Departure Destination:'
          )}
          value={
            user.departure_destination ||
            user.destination ||
            user.travel_destination
          }
        />
        <InfoRow
          label={t('registration.departureAirport', 'Departure Airport:')}
          value={user.departure_airport}
        />
        <InfoRow
          label={t('registration.departureDate', 'Departure Date:')}
          value={formatDate(user.departure_date || user.travel_date)}
        />
        <InfoRow
          label={t('registration.departureTime', 'Departure Time:')}
          value={user.departure_time}
        />
        <InfoRow
          label={t('registration.departureAirline', 'Departure Airline:')}
          value={user.departure_airline}
        />
        <InfoRow
          label={t(
            'registration.departureFlightNumber',
            'Departure Flight Number:'
          )}
          value={user.departure_flight_number}
        />

        <InfoRow
          label={t('registration.arrivalOrigin', 'Arrival Origin:')}
          value={user.arrival_origin}
        />
        <InfoRow
          label={t('registration.arrivalDestination', 'Arrival Destination:')}
          value={user.arrival_destination}
        />
        <InfoRow
          label={t('registration.arrivalAirport', 'Arrival Airport:')}
          value={user.arrival_airport}
        />
        <InfoRow
          label={t('registration.arrivalDate', 'Arrival Date:')}
          value={formatDate(user.arrival_date)}
        />
        <InfoRow
          label={t('registration.arrivalTime', 'Arrival Time:')}
          value={user.arrival_time}
        />
        <InfoRow
          label={t('registration.arrivalAirline', 'Arrival Airline:')}
          value={user.arrival_airline}
        />
        <InfoRow
          label={t(
            'registration.arrivalFlightNumber',
            'Arrival Flight Number:'
          )}
          value={user.arrival_flight_number}
        />

        <InfoRow
          label={t('registration.returnAirport', 'Return Airport:')}
          value={user.return_airport}
        />
        <InfoRow
          label={t('registration.returnFlightNumber', 'Return Flight Number:')}
          value={user.return_flight_number}
        />
        <InfoRow
          label={t('registration.returnDate', 'Return Date:')}
          value={formatDate(user.return_date)}
        />

        <InfoRow
          label={t('registration.travelDate', 'Travel Date:')}
          value={formatDate(user.travel_date)}
        />
        <InfoRow
          label={t('registration.travelDestination', 'Travel Destination:')}
          value={user.travel_destination}
        />
      </div>
    </motion.div>
  );
};

export default TravelInfoSection;
