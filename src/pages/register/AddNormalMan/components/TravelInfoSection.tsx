import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';

interface TravelInfoSectionProps {
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  prevSection: () => void;
  nextSection: () => void;
  t: (key: string, fallback: string) => string;
}

const TravelInfoSection: React.FC<TravelInfoSectionProps> = ({
  formData,
  handleInputChange,
  prevSection,
  nextSection,
  t,
}) => {
  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-3 sm:space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4">
        {t('registration.travelInfo', 'Travel Information')}
      </h3>
      <Input
        label={t('registration.travelDate', 'Travel Date')}
        name="travel_date"
        type="date"
        value={formData.travel_date}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.travelDestination', 'Travel Destination')}
        name="travel_destination"
        value={formData.travel_destination}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.arrivalAirport', 'Arrival Airport')}
        name="arrival_airport"
        value={formData.arrival_airport}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.arrivalDate', 'Arrival Date')}
        name="arrival_date"
        type="date"
        value={formData.arrival_date}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.flightNumber', 'Flight Number')}
        name="flight_number"
        value={formData.flight_number}
        onChange={handleInputChange}
      />
      <Input
        label={t('registration.returnDate', 'Return Date')}
        name="return_date"
        type="date"
        value={formData.return_date}
        onChange={handleInputChange}
      />
      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default TravelInfoSection;
