import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../../components/Input';
import SectionButtons from '../../../../components/SectionButtons';
import type { FormData } from '../types/types';
import { sectionVariants } from '../../../../config/animations';

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
  handleToggleTravel: () => void;
}

const TravelInfoSection: React.FC<TravelInfoSectionProps> = ({
  formData,
  handleInputChange,
  prevSection,
  nextSection,
  t,
  handleToggleTravel,
}) => {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
        {t('registration.travelInfo', 'Travel Information')}
      </h3>

     {/* Travel Information Toggle */}
     <div className="flex items-center space-x-2 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
        <input
          type="checkbox"
          id="has_travel"
          checked={formData.has_travel}
          onChange={handleToggleTravel}
          className="h-4 w-4 sm:h-5 sm:w-5 accent-blue-500"
        />
        <label
          htmlFor="has_travel"
          className="text-sm sm:text-base cursor-pointer select-none"
        >
          {t('registration.hasTravelInfo', 'Has International Travel Plans')}
        </label>
      </div>

      {/* Only show travel fields if has_travel is true */}
      {formData.has_travel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-2"
        >
          <h4 className="text-sm sm:text-base font-medium text-blue-400 mt-4">
            {t('registration.travelDetails', 'Travel Details')}
          </h4>

          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.passportNumber', 'Passport Number')}
              name="passport_number"
              value={formData.passport_number || ''}
              onChange={handleInputChange}
            
            />

            <Input
              label={t(
                'registration.passportIssuingCountry',
                'Issuing Country'
              )}
              name="passport_issuing_country"
              value={formData.passport_issuing_country || ''}
              onChange={handleInputChange}
             
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.passportIssueDate', 'Issue Date')}
              name="passport_issue_date"
              type="date"
              value={formData.passport_issue_date || ''}
              onChange={handleInputChange}
            />

            <Input
              label={t('registration.passportExpiryDate', 'Expiry Date')}
              name="passport_expiry_date"
              type="date"
              value={formData.passport_expiry_date || ''}
              onChange={handleInputChange}
            />
          </div>

          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.departureCountry', 'Departure Country')}
              name="departure_country"
              value={formData.departure_country || ''}
              onChange={handleInputChange}
             
            />

            <Input
              label={t('registration.travelDestination', 'Destination')}
              name="travel_destination"
              value={formData.travel_destination || ''}
              onChange={handleInputChange}
              
            />
            <Input
              label={t('registration.departureAirline', 'Airline')}
              name="departure_airline"
              value={formData.departure_airline || ''}
              onChange={handleInputChange}
              placeholder={t(
                'registration.departureAirlinePlaceholder',
                'e.g. Emirates, Qatar Airways'
              )}
            />
            <Input
              label={t(
                'registration.departureFlightNumber',
                'Departure Flight Number'
              )}
              name="departure_flight_number"
              value={formData.departure_flight_number || ''}
              onChange={handleInputChange}
             
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.travelDate', 'Departure Date')}
              name="travel_date"
              type="date"
              value={formData.travel_date || ''}
              onChange={handleInputChange}
             
            />
            <Input
              label={t('registration.departureTime', 'Departure Time')}
              name="departure_time"
              type="time"
              value={formData.departure_time || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.departureAirport', 'Departure Airport')}
              name="departure_airport"
              value={formData.departure_airport || ''}
              onChange={handleInputChange}
             
            />

            <Input
              label={t('registration.arrivalAirport', 'Arrival Airport')}
              name="arrival_airport"
              value={formData.arrival_airport || ''}
              onChange={handleInputChange}
          
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.arrivalDate', 'Arrival Date')}
              name="arrival_date"
              type="date"
              value={formData.arrival_date || ''}
              onChange={handleInputChange}
             
            />

            <Input
              label={t('registration.returnDate', 'Return Date')}
              name="return_date"
              type="date"
              value={formData.return_date || ''}
              onChange={handleInputChange}
             
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.returnAirport', 'Return Airport')}
              name="return_airport"
              value={formData.return_airport || ''}
              onChange={handleInputChange}
              
            />

            <Input
              label={t(
                'registration.returnFlightNumber',
                'Return Flight Number'
              )}
              name="return_flight_number"
              value={formData.return_flight_number || ''}
              onChange={handleInputChange}
           
            />
          </div>

          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('registration.arrivalOrigin', 'Arrival Origin')}
              name="arrival_origin"
              value={formData.arrival_origin || ''}
              onChange={handleInputChange}
            />

            <Input
              label={t(
                'registration.arrivalDestination',
                'Arrival Destination'
              )}
              name="arrival_destination"
              value={formData.arrival_destination || ''}
              onChange={handleInputChange}

            />
            <Input
              label={t('registration.arrivalAirline', 'Arrival Airline')}
              name="arrival_airline"
              value={formData.arrival_airline || ''}
              onChange={handleInputChange}
              
            />
            <Input
              label={t(
                'registration.arrivalFlightNumber',
                'Arrival Flight Number'
              )}
              name="arrival_flight_number"
              value={formData.arrival_flight_number || ''}
              onChange={handleInputChange}

            />

            <Input
              label={t('registration.departureDate', 'Departure Date')}
              name="departure_date"
              type="date"
              value={formData.departure_date || ''}
              onChange={handleInputChange}
            />
            <Input
              label={t('registration.arrivalTime', 'Arrival Time')}
              name="arrival_time"
              type="time"
              value={formData.arrival_time || ''}
              onChange={handleInputChange}
            />
          </div>
        </motion.div>
      )}

      <SectionButtons onPrev={prevSection} onNext={nextSection} />
    </motion.div>
  );
};

export default TravelInfoSection;
