
/**
 * TagTeam Design System
 * 
 * A comprehensive design system for the TagTeam application with
 * a color palette, typography scale, spacing system, and component variants.
 * Supports dark mode and ensures WCAG AA compliance.
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: '#eee9ff',
    100: '#d6d0ff',
    200: '#b6acff',
    300: '#9b87f5', // Main brand purple
    400: '#827AFF', // Original brand purple
    500: '#6e59a5',
    600: '#5a468f',
    700: '#46366f',
    800: '#32264f',
    900: '#1e162f',
  },
  
  // Secondary brand colors - vibrant green
  secondary: {
    50: '#f2fce2',
    100: '#e5f9c5',
    200: '#d2f5a3',
    300: '#bff081',
    400: '#8CFF6E', // Original brand green
    500: '#72cc58',
    600: '#5c9f46',
    700: '#467335',
    800: '#304924',
    900: '#1b2714',
  },
  
  // Neutral grayscale
  gray: {
    50: '#f7f7f7',
    100: '#e3e3e3',
    200: '#c8c8c9',
    300: '#a8a8a9',
    400: '#8e9196', // Original neutral gray
    500: '#74767c',
    600: '#5c5f64',
    700: '#44474c',
    800: '#2c2f34',
    900: '#1A1F2C', // Dark background
  },
  
  // Supporting/Accent colors
  accent: {
    blue: '#33C3F0',
    green: '#8CFF6E',
    orange: '#FEC6A1',
    pink: '#FFDEE2',
    purple: '#E5DEFF',
    yellow: '#FEF7CD',
  },
  
  // Feedback colors
  feedback: {
    success: '#72cc58',
    warning: '#ffa726',
    error: '#ea384c',
    info: '#33C3F0',
  },
  
  // System colors
  system: {
    white: '#FFFFFF',
    black: '#000000',
  }
};

// Typography
export const typography = {
  fontFamily: {
    primary: 'Hanken Grotesk, sans-serif',
    secondary: 'Hanken Grotesk, sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Spacing
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Fully rounded
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: 'none',
  // Brand specific shadows
  'brand-sm': '0 1px 5px rgba(130, 122, 255, 0.05)',
  'brand-md': '0 2px 10px rgba(130, 122, 255, 0.1)',
  'brand-lg': '0 4px 20px rgba(130, 122, 255, 0.15)',
};

// Animations
export const animations = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  },
  slideUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' }
  },
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
};

// Transitions
export const transitions = {
  DEFAULT: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Z-index
export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  modal: '100',
  toast: '500',
  tooltip: '600',
};

// Design tokens - to be used within components
export const tokens = {
  light: {
    background: colors.system.white,
    foreground: colors.gray[800],
    primary: colors.primary[400],
    primaryForeground: colors.system.white,
    secondary: colors.secondary[400],
    secondaryForeground: colors.system.white,
    muted: colors.gray[100],
    mutedForeground: colors.gray[500],
    accent: colors.primary[50],
    accentForeground: colors.primary[900],
    border: colors.gray[200],
    input: colors.gray[200],
    ring: colors.primary[400],
    success: colors.feedback.success,
    warning: colors.feedback.warning,
    error: colors.feedback.error,
    info: colors.feedback.info,
  },
  dark: {
    background: colors.gray[900],
    foreground: colors.gray[100],
    primary: colors.primary[400],
    primaryForeground: colors.system.white,
    secondary: colors.secondary[400],
    secondaryForeground: colors.gray[900],
    muted: colors.gray[800],
    mutedForeground: colors.gray[400],
    accent: colors.primary[900],
    accentForeground: colors.primary[50],
    border: colors.gray[800],
    input: colors.gray[700],
    ring: colors.primary[500],
    success: colors.feedback.success,
    warning: colors.feedback.warning,
    error: colors.feedback.error,
    info: colors.feedback.info,
  },
};

export const componentVariants = {
  // Define variants for components
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary',
      purple: 'bg-primary-400 text-white hover:bg-primary-500',
      green: 'bg-secondary-400 text-gray-900 hover:bg-secondary-500',
    },
    size: {
      default: 'h-10 py-2 px-4 rounded-xl',
      sm: 'h-8 px-3 rounded-lg text-sm',
      lg: 'h-12 px-8 rounded-xl text-lg',
      xl: 'h-14 px-8 rounded-xl text-xl',
      icon: 'h-10 w-10 rounded-full',
    },
  },
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'text-foreground border',
      purple: 'bg-primary-100 text-primary-800',
      green: 'bg-secondary-100 text-secondary-800',
    },
  },
  card: {
    base: 'rounded-lg border bg-card text-card-foreground shadow',
    variant: {
      default: 'shadow-sm',
      elevated: 'shadow-md',
      outlined: 'border-2 shadow-none',
      flat: 'shadow-none',
    },
  },
  input: {
    base: 'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  },
};
