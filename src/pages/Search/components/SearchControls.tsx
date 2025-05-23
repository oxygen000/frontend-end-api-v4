import React from 'react';
import { FaThLarge, FaList, FaFilter } from 'react-icons/fa';

interface SearchControlsProps {
  t: (key: string, fallback: string) => string;
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleFilters: () => void;
  toggleViewMode: () => void;
  showFilters: boolean;
  viewMode: 'grid' | 'row';
}

const SearchControls: React.FC<SearchControlsProps> = ({
  t,
  searchTerm,
  handleSearch,
  toggleFilters,
  toggleViewMode,
  showFilters,
  viewMode,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={t(
            'placeholder',
            'Search any registered user by name, ID, phone, department, or address'
          )}
          className="w-full p-3 pl-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-white/70"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleFilters}
          className={`p-3 rounded-lg transition-colors duration-200 ${showFilters ? 'bg-blue-600 text-white' : 'bg-white/20 text-white/70 hover:bg-white/30'}`}
          aria-label={t('toggleFilters', 'Toggle filters')}
        >
          <FaFilter />
        </button>
        <button
          onClick={toggleViewMode}
          className="p-3 bg-white/20 text-white/70 rounded-lg hover:bg-white/30 transition-colors duration-200"
          aria-label={
            viewMode === 'grid'
              ? t('switchToListView', 'Switch to list view')
              : t('switchToGridView', 'Switch to grid view')
          }
        >
          {viewMode === 'grid' ? <FaList /> : <FaThLarge />}
        </button>
      </div>
    </div>
  );
};

export default SearchControls;
