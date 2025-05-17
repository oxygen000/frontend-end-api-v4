import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslationWithFallback } from '../../hooks/useTranslationWithFallback';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'react-hot-toast';

// Import types
import type { ApiUser, SortField, SortDirection, FilterState } from './types';

// Import custom hooks
import useImageUrl from './hooks/useImageUrl';
import useGetAnimationVariants from './hooks/useGetAnimationVariants';

// Import components
import SearchHeader from './components/SearchHeader';
import SearchControls from './components/SearchControls';
import FilterPanel from './components/FilterPanel';
import ResultsCount from './components/ResultsCount';
import ResultsGrid from './components/ResultsGrid';
import ResultsList from './components/ResultsList';
import UserModal from './components/UserModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import NoResultsFound from './components/NoResultsFound';
import LoadMoreTrigger from './components/LoadMoreTrigger';

const API_URL = 'https://backend-fast-api-ai.fly.dev/api/users';

// Define a smaller initial page size to improve first render time
const PAGE_SIZE = 20;

// Form types for the dropdown
const FORM_TYPES = [
  { value: '', label: 'All Form Types' },
  { value: 'child', label: 'Child' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'employee', label: 'Employee' },
  { value: 'student', label: 'Student' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const Search: React.FC = () => {
  const { t } = useTranslationWithFallback();
  const [data, setData] = useState<ApiUser[]>([]);
  const [filteredData, setFilteredData] = useState<ApiUser[]>([]);
  const [displayedData, setDisplayedData] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<FilterState>({
    hasPhone: false,
    hasNationalId: false,
    category: '',
    formType: '',
  });
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Custom hooks
  const getImageUrl = useImageUrl();
  const {
    gridItemVariants,
    containerVariants,
    modalVariants,
    backdropVariants,
  } = useGetAnimationVariants();

  const fetchData = useCallback(async (retryCount = 0, maxRetries = 3) => {
    try {
      setLoading(true);
      setError(null);

      // Always fetch fresh data first for best UX
      try {
        await fetchFromAPI(retryCount, maxRetries);
        return;
      } catch (error) {
        console.error('Error fetching fresh data:', error);

        // Fall back to cached data if API fails
        const cachedData = sessionStorage.getItem('searchData');
        if (cachedData) {
          console.log('Using cached data as fallback');
          const parsedData = JSON.parse(cachedData);
          setData(parsedData);
          setFilteredData(parsedData);
          setLoading(false);
        } else {
          // No cache, propagate the error
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load users. Please try again later.');
      setData([]);
      setFilteredData([]);
      setLoading(false);
    }
  }, []);

  // Separate function to fetch from API
  const fetchFromAPI = async (retryCount = 0, maxRetries = 3) => {
    try {
      // Add bypassCache parameter to force fresh data when explicitly refreshing
      const forceBypassCache = retryCount === 0; // Only bypass cache on initial fetch

      const response = await axios.get(API_URL, {
        params: {
          bypassCache: forceBypassCache, // This will add a timestamp parameter in the interceptor
          limit: 100, // Request a good batch size initially
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        setFilteredData(response.data);
        // Cache the response for future use
        sessionStorage.setItem('searchData', JSON.stringify(response.data));
        setLoading(false);
      } else if (
        response.data &&
        response.data.users &&
        Array.isArray(response.data.users)
      ) {
        setData(response.data.users);
        setFilteredData(response.data.users);
        // Include timestamp in cached data to track freshness
        const dataWithTimestamp = {
          users: response.data.users,
          timestamp: new Date().getTime(),
          pagination: response.data.pagination,
        };
        // Cache the response for future use
        sessionStorage.setItem('searchData', JSON.stringify(dataWithTimestamp));
        setLoading(false);
      } else {
        setError('Invalid response format from server');
        setData([]);
        setFilteredData([]);
        setLoading(false);
      }
    } catch (error) {
      // If retries are available, try again
      if (retryCount < maxRetries) {
        console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
        const delay = (retryCount + 1) * 1000; // Exponential backoff
        await new Promise((r) => setTimeout(r, delay));
        return fetchFromAPI(retryCount + 1, maxRetries);
      }
      throw error; // Let the caller handle it
    }
  };

  useEffect(() => {
    fetchData(0, 3);
  }, [fetchData]);

  // Listen for data-updated events to refresh automatically
  useEffect(() => {
    // Function to handle the data-updated event
    const handleDataUpdated = () => {
      console.log('Data update detected, refreshing search results...');

      // Clear the cached data to ensure we get fresh data
      sessionStorage.removeItem('searchData');

      // Show a loading toast without being intrusive
      const refreshToast = toast.loading(
        t('search.refreshing', 'Refreshing data...'),
        { duration: 2000 } // Short toast that auto-dismisses
      );

      // Fetch fresh data with minimal retries to be fast
      fetchData(0, 1)
        .then(() => {
          toast.success(
            t('search.refreshSuccess', 'Data refreshed successfully'),
            { id: refreshToast, duration: 1000 }
          );
        })
        .catch((error) => {
          console.error('Auto-refresh failed:', error);
          // Don't show error toast to avoid UI clutter
          toast.dismiss(refreshToast);
        });
    };

    // Add event listener
    window.addEventListener('data-updated', handleDataUpdated);

    // Clean up
    return () => {
      window.removeEventListener('data-updated', handleDataUpdated);
    };
  }, [fetchData, t]);

  // Optimized filter function
  const applyFilters = useCallback(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    const term = debouncedSearchTerm.toLowerCase();

    // Use optimized filtering with early returns for better performance
    const filtered = data.filter((user) => {
      // Quick check for empty term to skip unnecessary processing
      if (term === '') {
        // Only check filters if search term is empty
        return (
          (!filters.hasPhone ||
            (!!user.phone_number && user.phone_number.trim() !== '')) &&
          (!filters.hasNationalId ||
            (!!user.national_id && user.national_id.trim() !== '') ||
            (!!user.employee_id && user.employee_id.trim() !== '')) &&
          (!filters.category || user.category === filters.category) &&
          (!filters.formType || user.form_type === filters.formType)
        );
      }

      // Searchable fields in a single array for cleaner code
      const searchableFields = [
        user.name,
        user.phone_number,
        user.national_id,
        user.employee_id,
        user.address,
        user.department,
        user.nickname,
        user.form_type,
      ];

      // Check if any searchable field contains the search term
      const matchesSearch = searchableFields.some(
        (field) => field && field.toLowerCase().includes(term)
      );

      if (!matchesSearch) return false;

      // If search term matches, check filters
      return (
        (!filters.hasPhone ||
          (!!user.phone_number && user.phone_number.trim() !== '')) &&
        (!filters.hasNationalId ||
          (!!user.national_id && user.national_id.trim() !== '') ||
          (!!user.employee_id && user.employee_id.trim() !== '')) &&
        (!filters.category || user.category === filters.category) &&
        (!filters.formType || user.form_type === filters.formType)
      );
    });

    // Apply sorting - only if needed
    if (sortField !== 'none') {
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case 'name': {
            comparison = a.name.localeCompare(b.name);
            break;
          }
          case 'created_at': {
            const dateA = new Date(a.created_at || '').getTime();
            const dateB = new Date(b.created_at || '').getTime();
            comparison = dateA - dateB;
            break;
          }
          default:
            comparison = 0;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredData(filtered);
    // Reset pagination when filters change
    setPage(1);
    setHasMore(filtered.length > PAGE_SIZE);
    setDisplayedData(filtered.slice(0, PAGE_SIZE));
  }, [data, debouncedSearchTerm, filters, sortField, sortDirection]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      applyFilters();
    }
  }, [
    data,
    debouncedSearchTerm,
    filters,
    sortField,
    sortDirection,
    applyFilters,
  ]);

  // Handle pagination
  const loadMoreItems = useCallback(() => {
    if (!hasMore) return;

    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const endIndex = nextPage * PAGE_SIZE;

    if (startIndex >= filteredData.length) {
      setHasMore(false);
      return;
    }

    const nextItems = filteredData.slice(startIndex, endIndex);
    setDisplayedData((prev) => [...prev, ...nextItems]);
    setPage(nextPage);
    setHasMore(endIndex < filteredData.length);
  }, [page, filteredData, hasMore]);

  useEffect(() => {
    // Implement intersection observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreItems();
        }
      },
      { threshold: 0.5 }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [hasMore, loading, loadMoreItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleViewMode = () => {
    setViewMode((current) => (current === 'grid' ? 'row' : 'grid'));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setFilters((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    // Set refreshing status
    setRefreshing(true);

    // Clear the cached data to ensure we get fresh data
    sessionStorage.removeItem('searchData');

    // Reset pagination
    setPage(1);
    setHasMore(true);

    // Show a loading toast
    const refreshToast = toast.loading(
      t('search.refreshing', 'Refreshing data...')
    );

    // Fetch fresh data
    fetchData(0, 2)
      .then(() => {
        // Clear refreshing status when done successfully
        toast.success(
          t('search.refreshSuccess', 'Data refreshed successfully'),
          {
            id: refreshToast,
          }
        );
      })
      .catch((error) => {
        // Show error toast
        toast.error(t('search.refreshError', 'Failed to refresh data'), {
          id: refreshToast,
        });
        console.error('Refresh failed:', error);
      })
      .finally(() => {
        // Clear refreshing status when done
        setRefreshing(false);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Custom NoResultsFound component instance with translation
  const NoResultsFoundComponent = () => <NoResultsFound t={t} />;

  // Show loading spinner when loading initial data
  if (loading && filteredData.length === 0) {
    return <LoadingSpinner />;
  }

  // Show error display when there's an error
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        t={t}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {t('search.title', 'Search')}
        </h1>
        <p className="text-white/70">
          {t('search.subtitle', 'Search and filter registered users')}
        </p>
      </div>

      {/* Search & Controls */}
      <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg border border-white/20 mb-6">
        <SearchHeader
          t={t}
          handleRefresh={handleRefresh}
          refreshing={refreshing}
        />

        <SearchControls
          t={t}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          toggleFilters={toggleFilters}
          toggleViewMode={toggleViewMode}
          showFilters={showFilters}
          viewMode={viewMode}
        />

        <FilterPanel
          t={t}
          showFilters={showFilters}
          filters={filters}
          handleFilterChange={handleFilterChange}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          FORM_TYPES={FORM_TYPES}
        />

        {/* Results count */}
        <div className="mb-4 text-white/70 flex justify-between items-center">
          <ResultsCount count={filteredData.length} t={t} />
        </div>

        {/* Display filtered data with improved animations */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ResultsGrid
                displayedData={displayedData}
                gridItemVariants={gridItemVariants}
                NoResultsFound={NoResultsFoundComponent}
              />

              <LoadMoreTrigger hasMore={hasMore} loading={loading} />
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <ResultsList
                displayedData={displayedData}
                getImageUrl={getImageUrl}
                gridItemVariants={gridItemVariants}
                NoResultsFound={NoResultsFoundComponent}
              />

              <LoadMoreTrigger hasMore={hasMore} loading={loading} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        <UserModal
          showModal={showModal}
          selectedUser={selectedUser}
          closeModal={closeModal}
          getImageUrl={getImageUrl}
          modalVariants={modalVariants}
          backdropVariants={backdropVariants}
        />
      </AnimatePresence>
    </div>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(Search);
