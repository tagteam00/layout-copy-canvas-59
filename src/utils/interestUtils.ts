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
 * Formats category name for display with emojis
 */
export const formatCategoryName = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    'creative_performing_arts': '🎨 Creative & Performing Arts',
    'tech_gaming_innovation': '💻 Tech, Gaming & Innovation',
    'lifestyle_mind_wellness': '🌿 Lifestyle, Mind & Wellness',
    'culinary_food': '🍳 Culinary & Food',
    'knowledge_exploration': '📚 Knowledge & Exploration',
    'sports_fitness': '🏋️ Sports & Fitness',
    'social_entertainment': '🎭 Social & Entertainment'
  };
  
  return categoryMap[categoryName] || categoryName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};