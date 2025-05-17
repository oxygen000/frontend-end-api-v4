import { useMemo } from 'react';

export const useGetAnimationVariants = () => {
  const gridItemVariants = useMemo(
    () => ({
      hidden: ({ isGrid }: { isGrid: boolean; index?: number }) => ({
        opacity: 0,
        rotateX: isGrid ? -10 : 0,
        translateY: isGrid ? -50 : 0,
        translateX: isGrid ? 0 : -50,
        filter: 'blur(10px)',
        scale: 0.8,
      }),
      visible: {
        opacity: 1,
        rotateX: 0,
        translateY: 0,
        translateX: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
          type: 'spring',
          damping: 20,
          stiffness: 200,
          duration: 0.4,
        },
      },
      exit: ({ isGrid }: { isGrid: boolean; index?: number }) => ({
        opacity: 0,
        rotateX: isGrid ? 10 : 0,
        translateY: isGrid ? 50 : 0,
        translateX: isGrid ? 0 : 50,
        filter: 'blur(10px)',
        scale: 0.8,
        transition: {
          duration: 0.3,
          ease: 'easeInOut',
        },
      }),
      hover: {
        scale: 1.05,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        transition: {
          duration: 0.2,
        },
      },
      tap: {
        scale: 0.98,
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        transition: {
          duration: 0.1,
        },
      },
    }),
    []
  );

  const containerVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.07,
          delayChildren: 0.1,
          when: 'beforeChildren',
          ease: 'easeOut',
        },
      },
      exit: {
        opacity: 0,
        filter: 'blur(10px)',
        transition: {
          staggerChildren: 0.05,
          staggerDirection: -1,
          when: 'afterChildren',
          ease: 'easeIn',
          duration: 0.4,
        },
      },
    }),
    []
  );

  const modalVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: 0.8,
        rotateY: -10,
        filter: 'blur(10px)',
      },
      visible: {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 300,
          duration: 0.5,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        rotateY: 10,
        filter: 'blur(10px)',
        transition: {
          duration: 0.3,
          ease: 'easeInOut',
        },
      },
    }),
    []
  );

  const backdropVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.3, delay: 0.1 },
      },
    }),
    []
  );

  return {
    gridItemVariants,
    containerVariants,
    modalVariants,
    backdropVariants,
  };
};

export default useGetAnimationVariants;
