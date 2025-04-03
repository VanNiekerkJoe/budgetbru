
// Format a number as South African currency (ZAR)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format a date as a readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Get category icon based on category name
export const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'rent':
      return '🏠';
    case 'groceries':
      return '🛒';
    case 'transport':
      return '🚗';
    case 'entertainment':
      return '🎬';
    case 'utilities':
      return '💡';
    case 'education':
      return '📚';
    case 'clothing':
      return '👕';
    case 'health':
      return '💊';
    default:
      return '💸';
  }
};

// Get category color based on category name
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'rent':
      return 'bg-blue-500';
    case 'groceries':
      return 'bg-green-500';
    case 'transport':
      return 'bg-yellow-500';
    case 'entertainment':
      return 'bg-purple-500';
    case 'utilities':
      return 'bg-gray-500';
    case 'education':
      return 'bg-indigo-500';
    case 'clothing':
      return 'bg-pink-500';
    case 'health':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

// Generate random encouraging message
export const getEncouragingMessage = (): string => {
  const messages = [
    "You're doing great, bru!",
    "Keep saving, legend!",
    "Budget like a boss!",
    "That's how we do it in Jozi!",
    "Eish, you're getting better at this!",
    "Nice one, champion!",
    "Saving for those Rage vibes!",
    "Budget goals on track, boet!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};
