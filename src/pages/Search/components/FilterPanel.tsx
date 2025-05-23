import React from 'react';
import { motion } from 'framer-motion';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface FilterPanelProps {
  t: (key: string, fallback: string) => string;
  showFilters: boolean;
  filters: {
    hasPhone: boolean;
    hasNationalId: boolean;
    category: string;
    formType: string;
  };
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: 'name' | 'created_at' | 'none') => void;
  FORM_TYPES: { value: string; label: string }[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  t,
  showFilters,
  filters,
  handleFilterChange,
  sortField,
  sortDirection,
  handleSort,
  FORM_TYPES,
}) => {
  if (!showFilters) return null;

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className="text-white/50" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="text-white" />
    ) : (
      <FaSortDown className="text-white" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 p-6 bg-white/10 backdrop-blur-md rounded-lg border border-white/20"
    >
      <h3 className="text-white font-semibold text-lg mb-5">
        {t('filterOptions', 'Filter Options')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Form Type Dropdown */}
        <div>
          <label htmlFor="formType" className="text-white block mb-1">
            {t('formType', 'Form Type')}
          </label>
          <select
            id="formType"
            name="formType"
            value={filters.formType}
            onChange={handleFilterChange}
            className="w-full p-2 bg-white/20 border border-white/30 rounded"
          >
            <option value="">{t('all', 'All')}</option>
            {FORM_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {t(`formTypes.${value}`, label)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Buttons */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="text-white block mb-2">
            {t('sortBy', 'Sort By')}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: t('sortFields.name', 'Name'),
                field: 'name',
              },
              {
                label: t('sortFields.date', 'Date'),
                field: 'created_at',
              },
            ].map(({ label, field }) => (
              <button
                key={field}
                onClick={() =>
                  handleSort(field as 'name' | 'created_at' | 'none')
                }
                className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                  sortField === field
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
              >
                {label} {getSortIcon(field)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
