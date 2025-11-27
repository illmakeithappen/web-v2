// IBM Carbon Design System Theme
// Color tokens, spacing, and typography based on Carbon Design System v11

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const carbonColors = {
  // Background colors
  background: '#f4f4f4',          // Page background
  ui01: '#ffffff',                 // Primary container background
  ui02: '#f4f4f4',                 // Secondary container background
  ui03: '#e0e0e0',                 // Subtle border, tertiary backgrounds
  ui04: '#8d8d8d',                 // Medium contrast border
  ui05: '#161616',                 // High contrast border

  // Interactive colors
  interactive01: '#0f62fe',        // Primary interactive color
  interactive02: '#393939',        // Secondary interactive color
  interactive03: '#0f62fe',        // Tertiary interactive color
  interactive04: '#0f62fe',        // Selected interactive color

  // Text colors
  text01: '#161616',               // Primary text
  text02: '#525252',               // Secondary text
  text03: '#8d8d8d',               // Placeholder text
  text04: '#ffffff',               // Text on interactive colors
  text05: '#6f6f6f',               // Disabled text
  textError: '#da1e28',            // Error text

  // Link colors
  link01: '#0f62fe',               // Primary links
  link02: '#0043ce',               // Secondary links, visited links

  // Icon colors
  icon01: '#161616',               // Primary icons
  icon02: '#525252',               // Secondary icons
  icon03: '#ffffff',               // Icons on interactive colors
  iconDisabled: '#c6c6c6',         // Disabled icons

  // Field colors
  field01: '#f4f4f4',              // Default input background
  field02: '#ffffff',              // Alternate input background
  fieldHover: '#e8e8e8',           // Input hover background

  // Border colors
  borderSubtle00: '#e0e0e0',       // Subtle borders
  borderSubtle01: '#c6c6c6',       // Subtle borders - selected
  borderStrong01: '#8d8d8d',       // Strong borders
  borderInteractive: '#0f62fe',    // Interactive borders
  borderDisabled: '#c6c6c6',       // Disabled borders

  // State colors
  hover: 'rgba(141, 141, 141, 0.12)',      // Hover overlay
  hoverPrimary: '#0050e6',                  // Primary button hover
  hoverSecondary: '#4c4c4c',                // Secondary hover
  hoverUI: '#e5e5e5',                       // UI hover
  active: 'rgba(141, 141, 141, 0.5)',      // Active overlay
  selected: 'rgba(15, 98, 254, 0.1)',      // Selected background
  selectedHover: 'rgba(15, 98, 254, 0.16)', // Selected hover
  focus: '#0f62fe',                         // Focus indicator

  // Semantic colors
  support01: '#da1e28',            // Error
  support02: '#24a148',            // Success
  support03: '#f1c21b',            // Warning
  support04: '#0043ce',            // Information

  // Layer colors (for depth)
  layer01: '#f4f4f4',              // Layer 1 background
  layer02: '#ffffff',              // Layer 2 background
  layer03: '#f4f4f4',              // Layer 3 background
  layerAccent01: '#e0e0e0',        // Accent layer

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',   // Modal overlay

  // Skeleton
  skeleton01: '#e5e5e5',           // Skeleton background
  skeleton02: '#c6c6c6',           // Skeleton shimmer
};

// ============================================================================
// SPACING SCALE (4px grid system)
// ============================================================================

export const carbonSpacing = {
  spacing01: '2px',    // 0.125rem
  spacing02: '4px',    // 0.25rem
  spacing03: '8px',    // 0.5rem
  spacing04: '12px',   // 0.75rem
  spacing05: '16px',   // 1rem
  spacing06: '24px',   // 1.5rem
  spacing07: '32px',   // 2rem
  spacing08: '40px',   // 2.5rem
  spacing09: '48px',   // 3rem
  spacing10: '64px',   // 4rem
  spacing11: '80px',   // 5rem
  spacing12: '96px',   // 6rem
  spacing13: '160px',  // 10rem
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const carbonTypography = {
  fontFamily: {
    sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    mono: "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace",
  },

  fontSize: {
    caption01: '12px',      // Small captions
    label01: '12px',        // Labels
    helperText01: '12px',   // Helper text
    bodyShort01: '14px',    // Short body text
    bodyLong01: '14px',     // Long body text
    bodyShort02: '16px',    // Short body text - larger
    bodyLong02: '16px',     // Long body text - larger
    code01: '12px',         // Code snippets
    code02: '14px',         // Code snippets - larger
    heading01: '14px',      // Smallest heading
    heading02: '16px',      // Small heading
    heading03: '20px',      // Medium heading
    heading04: '28px',      // Large heading
    heading05: '32px',      // XL heading
    heading06: '42px',      // 2XL heading
    heading07: '54px',      // 3XL heading
  },

  fontWeight: {
    light: 300,
    regular: 400,
    semibold: 600,
  },

  lineHeight: {
    caption01: '16px',
    label01: '16px',
    helperText01: '16px',
    bodyShort01: '18px',
    bodyLong01: '20px',
    bodyShort02: '22px',
    bodyLong02: '24px',
    code01: '16px',
    code02: '20px',
    heading01: '18px',
    heading02: '22px',
    heading03: '26px',
    heading04: '36px',
    heading05: '40px',
    heading06: '50px',
    heading07: '64px',
  },

  letterSpacing: {
    caption01: '0.32px',
    label01: '0.32px',
    helperText01: '0.32px',
    bodyShort01: '0.16px',
    bodyLong01: '0.16px',
    bodyShort02: '0',
    bodyLong02: '0',
    code01: '0.32px',
    code02: '0.32px',
    heading01: '0.16px',
    heading02: '0',
    heading03: '0',
    heading04: '0',
    heading05: '0',
    heading06: '0',
    heading07: '0',
  },
};

// ============================================================================
// LAYOUT
// ============================================================================

export const carbonLayout = {
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
  },

  borderWidth: {
    thin: '1px',
    thick: '2px',
  },

  iconSize: {
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },

  containerPadding: {
    sm: '16px',
    md: '24px',
    lg: '32px',
  },
};

// ============================================================================
// TRANSITIONS
// ============================================================================

export const carbonTransitions = {
  duration: {
    fast01: '70ms',
    fast02: '110ms',
    moderate01: '150ms',
    moderate02: '240ms',
    slow01: '400ms',
    slow02: '700ms',
  },

  easing: {
    standard: 'cubic-bezier(0.2, 0, 0.38, 0.9)',      // Standard productive motion
    entrance: 'cubic-bezier(0, 0, 0.38, 0.9)',        // Entrance (coming onto screen)
    exit: 'cubic-bezier(0.2, 0, 1, 0.9)',             // Exit (leaving screen)
    expressive: 'cubic-bezier(0.4, 0.14, 0.3, 1)',    // Expressive motion
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

export const carbonShadows = {
  shadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
};

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const carbonZIndex = {
  dropdown: 1000,
  modal: 2000,
  overlay: 3000,
  tooltip: 4000,
};

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const carbonComponents = {
  // Buttons
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '64px',
      '2xl': '80px',
    },
    padding: {
      sm: '0 15px',
      md: '0 63px',
      lg: '0 79px',
    },
  },

  // Data table
  dataTable: {
    rowHeight: {
      compact: '24px',
      short: '32px',
      normal: '48px',
      tall: '64px',
    },
    headerHeight: '48px',
  },

  // Input fields
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
  },

  // Tags
  tag: {
    height: {
      sm: '18px',
      md: '24px',
    },
  },
};

// ============================================================================
// THEME OBJECT (All tokens combined)
// ============================================================================

export const carbonTheme = {
  colors: carbonColors,
  spacing: carbonSpacing,
  typography: carbonTypography,
  layout: carbonLayout,
  transitions: carbonTransitions,
  shadows: carbonShadows,
  zIndex: carbonZIndex,
  components: carbonComponents,
};

export default carbonTheme;
