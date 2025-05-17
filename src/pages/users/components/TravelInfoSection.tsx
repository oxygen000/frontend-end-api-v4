import { motion } from 'framer-motion';
import { FiMap } from 'react-icons/fi';

// Define a minimal User type for the required fields
interface User {
  travel_date?: string | null;
  travel_destination?: string | null;
  arrival_airport?: string | null;
  arrival_date?: string | null;
  flight_number?: string | null;
  return_date?: string | null;
  form_type: string;
}

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
  const hasTravelInfo =
    user.travel_date ||
    user.travel_destination ||
    user.arrival_airport ||
    user.arrival_date ||
    user.flight_number ||
    user.return_date;

  if (!hasTravelInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-gradient-to-br ${user.form_type === 'woman' ? 'from-pink-500/20 to-pink-500/10' : 'from-blue-500/20 to-blue-500/10'} backdrop-blur-md rounded-xl p-4 sm:p-6 border ${user.form_type === 'woman' ? 'border-pink-500/30' : 'border-blue-500/30'} shadow-lg`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
        <FiMap
          className={`${isRTL ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'} ${user.form_type === 'woman' ? 'text-pink-400' : 'text-blue-400'}`}
          size={20}
        />
        {t('users.travelInfo', 'Travel Information')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.travelDate', 'Travel Date:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.travel_date)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.travelDestination', 'Travel Destination:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.travel_destination || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.arrivalAirport', 'Arrival Airport:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.arrival_airport || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.arrivalDate', 'Arrival Date:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.arrival_date)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.flightNumber', 'Flight Number:')}
          </span>
          <span className="text-white font-medium text-sm">
            {user.flight_number || t('users.notAvailable', 'N/A')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
          <span className="text-white/70 text-sm">
            {t('users.returnDate', 'Return Date:')}
          </span>
          <span className="text-white font-medium text-sm">
            {formatDate(user.return_date)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TravelInfoSection;
