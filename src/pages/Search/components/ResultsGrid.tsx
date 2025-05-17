import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Card from '../../../components/Card';
import type { ApiUser } from '../types';

interface ResultsGridProps {
  displayedData: ApiUser[];
  gridItemVariants: Variants;
  NoResultsFound: React.FC;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  displayedData,
  gridItemVariants,
  NoResultsFound,
}) => {
  return (
    <>
      {displayedData.length > 0 ? (
        displayedData.map((user, index) => (
          <motion.div
            key={user.id}
            custom={{ isGrid: true, index }}
            variants={gridItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileTap="tap"
            layoutId={user.id}
          >
            <Card user={user} />
          </motion.div>
        ))
      ) : (
        <div className="col-span-full">
          <NoResultsFound />
        </div>
      )}
    </>
  );
};

export default ResultsGrid;
