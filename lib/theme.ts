// Theme configuration for the restaurant template
// Customize these values to change the design across all pages

// Example color schemes for different restaurant styles:
// - Warm/Elegant: Gold, burgundy, cream
// - Modern/Minimal: Gray, white, black
// - Rustic/Cozy: Brown, orange, beige
// - Fresh/Organic: Green, white, natural tones

export const theme = {
  colors: {
    // Main brand colors - customize these for your restaurant
    primary: {
      50: '#e6f3f8',    // Light blue background
      100: '#cce6f4',    // Light blue accent (your background color)
      500: '#175676',    // Main brand color (your main color)
      600: '#124a63',    // Darker for hover states
      700: '#0f3d52',    // Even darker for active states
    },
    secondary: {
      50: '#f8fafc',     // Light neutral
      100: '#f1f5f9',    // Light gray
      500: '#64748b',    // Medium gray
      600: '#475569',    // Dark gray
    },
    // Accent colors for highlights and special elements
    accent: {
      50: '#e6f3f8',     // Light blue background
      100: '#cce6f4',    // Light blue accent (your background color)
      500: '#175676',    // Accent color (same as primary)
      600: '#124a63',    // Darker accent
    },
    // Success colors for positive actions
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
    },
    // Warning colors for alerts
    warning: {
      50: '#fef2f2',     // Light red background
      100: '#fee2e2',    // Light red accent
      500: '#d62839',    // Warning color (your warning color)
      600: '#b91c1c',    // Darker warning
    },
    // Background colors
    background: {
      light: '#ffffff',
      dark: '#0f172a',
      gray: '#f8fafc',
      warm: '#fef7ed',   // Warm background option
      blue: '#cce6f4',   // Your background/second accent color
    },
    // Text colors
    text: {
      primary: '#1e293b',    // Main text
      secondary: '#64748b',  // Secondary text
      light: '#ffffff',      // Light text on dark backgrounds
      warm: '#92400e',       // Warm text color
      brand: '#175676',      // Your brand color for text
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  }
};

// Common button styles
export const buttonStyles = {
  primary: `bg-${theme.colors.primary[500]} hover:bg-${theme.colors.primary[600]} text-white font-medium py-2 px-4 rounded-${theme.borderRadius.lg} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary[500]} focus:ring-offset-2`,
  secondary: `bg-${theme.colors.secondary[100]} hover:bg-${theme.colors.secondary[200]} text-${theme.colors.secondary[600]} font-medium py-2 px-4 rounded-${theme.borderRadius.lg} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${theme.colors.secondary[500]} focus:ring-offset-2`,
  outline: `border border-${theme.colors.primary[500]} text-${theme.colors.primary[500]} hover:bg-${theme.colors.primary[50]} font-medium py-2 px-4 rounded-${theme.borderRadius.lg} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary[500]} focus:ring-offset-2`,
  accent: `bg-${theme.colors.accent[500]} hover:bg-${theme.colors.accent[600]} text-white font-medium py-2 px-4 rounded-${theme.borderRadius.lg} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${theme.colors.accent[500]} focus:ring-offset-2`,
  warning: `bg-${theme.colors.warning[500]} hover:bg-${theme.colors.warning[600]} text-white font-medium py-2 px-4 rounded-${theme.borderRadius.lg} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${theme.colors.warning[500]} focus:ring-offset-2`,
  disabled: `bg-gray-300 text-gray-500 cursor-not-allowed font-medium py-2 px-4 rounded-${theme.borderRadius.lg}`,
};

// Common input styles
export const inputStyles = `w-full p-3 border border-gray-300 rounded-${theme.borderRadius.lg} focus:outline-none focus:ring-2 focus:ring-${theme.colors.primary[500]} focus:border-transparent transition-colors duration-200`;

// Common card styles
export const cardStyles = `bg-white rounded-${theme.borderRadius.xl} shadow-${theme.shadows.lg} p-6`;

// Common container styles
export const containerStyles = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`;

// Common section styles
export const sectionStyles = `py-${theme.spacing['2xl']}`;

// Example color schemes for different restaurant types:
export const colorSchemes = {
  // Warm & Elegant (Fine Dining)
  warmElegant: {
    primary: {
      50: '#fef7ed',
      100: '#fed7aa',
      500: '#f59e0b',    // Gold
      600: '#d97706',
    },
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#dc2626',    // Burgundy
      600: '#b91c1c',
    }
  },
  
  // Modern & Minimal (Contemporary)
  modernMinimal: {
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#475569',    // Slate gray
      600: '#334155',
    },
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',    // Red accent
      600: '#dc2626',
    }
  },
  
  // Rustic & Cozy (Farm-to-Table)
  rusticCozy: {
    primary: {
      50: '#fef7ed',
      100: '#fed7aa',
      500: '#d97706',    // Brown
      600: '#b45309',
    },
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',    // Orange
      600: '#d97706',
    }
  },
  
  // Fresh & Organic (Health-focused)
  freshOrganic: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',    // Green
      600: '#16a34a',
    },
    accent: {
      50: '#fef7ed',
      100: '#fed7aa',
      500: '#f59e0b',    // Warm accent
      600: '#d97706',
    }
  }
}; 