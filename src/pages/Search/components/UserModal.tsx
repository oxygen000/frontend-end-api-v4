import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  FaTimes,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaUserTag,
  FaCar,
  FaCalendar,
  FaBarcode,
} from 'react-icons/fa';
import type { ApiUser } from '../types';

interface UserModalProps {
  showModal: boolean;
  selectedUser: ApiUser | null;
  closeModal: () => void;
  getImageUrl: (
    imagePath: string | null | undefined,
    userName: string
  ) => string;
  modalVariants: Variants;
  backdropVariants: Variants;
}

const UserModal: React.FC<UserModalProps> = ({
  showModal,
  selectedUser,
  closeModal,
  getImageUrl,
  modalVariants,
  backdropVariants,
}) => {
  if (!showModal || !selectedUser) return null;

  // Helper function to get vehicle info from different possible sources
  const getVehicleInfo = () => {
    if (selectedUser.vehicle_info) {
      // New structured format
      return selectedUser.vehicle_info;
    } else if (
      selectedUser.vehicle_model ||
      selectedUser.license_plate ||
      selectedUser.vehicle_number ||
      selectedUser.chassis_number
    ) {
      // Old flat format - convert to structure
      return {
        vehicle_model: selectedUser.vehicle_model,
        vehicle_color: selectedUser.color,
        license_plate: selectedUser.license_plate,
        license_expiration: selectedUser.license_expiration_date,
        manufacture_year: selectedUser.manufacture_year,
        chassis_number: selectedUser.chassis_number,
        vehicle_number: selectedUser.vehicle_number,
        traffic_department: selectedUser.traffic_department,
      };
    }
    return null;
  };

  // Get vehicle information
  const vehicleInfo = getVehicleInfo();
  const hasVehicleInfo =
    vehicleInfo &&
    Object.values(vehicleInfo).some(
      (value) => value !== undefined && value !== null && value !== ''
    );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <motion.div
        variants={modalVariants}
        className="bg-white/20 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-white">User Details</h2>
          <motion.button
            onClick={closeModal}
            className="text-white/70 hover:text-white transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes size={24} />
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/30">
              {selectedUser.image_url || selectedUser.image_path ? (
                <img
                  src={getImageUrl(
                    selectedUser.image_path || selectedUser.image_url,
                    selectedUser.name
                  )}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {selectedUser.name}
              </h3>
              {selectedUser.category && (
                <p className="text-white/70">{selectedUser.category}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedUser.phone_number && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-white/70" />
                  <span className="text-white">
                    {selectedUser.phone_number}
                  </span>
                </div>
              )}

              {(selectedUser.national_id || selectedUser.employee_id) && (
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-white/70" />
                  <span className="text-white">
                    {selectedUser.national_id || selectedUser.employee_id}
                  </span>
                </div>
              )}

              {selectedUser.address && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white/70" />
                  <span className="text-white">{selectedUser.address}</span>
                </div>
              )}

              {selectedUser.dob && (
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-white/70" />
                  <span className="text-white">{selectedUser.dob}</span>
                </div>
              )}

              {selectedUser.department && (
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-white/70" />
                  <span className="text-white">{selectedUser.department}</span>
                </div>
              )}

              {selectedUser.form_type && (
                <div className="flex items-center gap-2">
                  <FaUserTag className="text-white/70" />
                  <span className="text-white">{selectedUser.form_type}</span>
                </div>
              )}
            </div>

            {/* Display vehicle information if available */}
            {hasVehicleInfo && (
              <div className="mt-6">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <FaCar className="mr-2" /> Vehicle Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white/10 p-3 rounded-lg">
                  {vehicleInfo?.vehicle_model && (
                    <div className="flex items-center gap-2">
                      <FaCar className="text-white/70" />
                      <span className="text-white">
                        {vehicleInfo.vehicle_model}
                        {vehicleInfo.vehicle_color &&
                          ` - ${vehicleInfo.vehicle_color}`}
                      </span>
                    </div>
                  )}

                  {vehicleInfo?.manufacture_year && (
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-white/70" />
                      <span className="text-white">
                        {vehicleInfo.manufacture_year}
                      </span>
                    </div>
                  )}

                  {vehicleInfo?.license_plate && (
                    <div className="flex items-center gap-2">
                      <FaIdCard className="text-white/70" />
                      <span className="text-white">
                        {vehicleInfo.license_plate}
                      </span>
                    </div>
                  )}

                  {vehicleInfo?.chassis_number && (
                    <div className="flex items-center gap-2">
                      <FaBarcode className="text-white/70" />
                      <span className="text-white">
                        {vehicleInfo.chassis_number}
                      </span>
                    </div>
                  )}

                  {vehicleInfo?.vehicle_number && (
                    <div className="flex items-center gap-2">
                      <FaBarcode className="text-white/70" />
                      <span className="text-white">
                        {vehicleInfo.vehicle_number}
                      </span>
                    </div>
                  )}

                  {vehicleInfo?.license_expiration && (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-white/70" />
                      <span className="text-white">
                        License expires: {vehicleInfo.license_expiration}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserModal;
 