/**
 * Formats an interest name for display by replacing underscores with spaces
 * and capitalizing each word properly
 */
export const formatInterestName = (interestName: string): string => {
  return interestName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats category name for display
 */
export const formatCategoryName = (categoryName: string): string => {
  return categoryName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};