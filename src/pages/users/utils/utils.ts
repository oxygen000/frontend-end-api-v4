/**
 * Format date for display
 * @param date Date string to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | null | undefined) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate age from date of birth
 * @param dateString Date of birth
 * @param yearsSuffix Text to append to the age value
 * @returns Age string
 */
export const calculateAge = (dateString: string, yearsSuffix = 'years old') => {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} ${yearsSuffix}`;
};

/**
 * Mask sensitive information based on reveal status
 * @param value The value to potentially mask
 * @param isIdentityRevealed Whether identity is revealed
 * @returns Original value or masked version
 */
export const maskSensitiveInfo = (
  value: string | null | undefined,
  isIdentityRevealed: boolean
) => {
  if (!value) return 'N/A';
  if (!isIdentityRevealed) {
    return '••••••••';
  }
  return value;
};
