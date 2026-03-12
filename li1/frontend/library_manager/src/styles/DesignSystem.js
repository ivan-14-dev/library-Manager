/**
 * 🎨 AcHub Design System
 * Professional Minimalist White/Black Theme
 * 
 * Inspired by top tech companies (Amazon, Wix, Apple)
 * Clean, sophisticated, premium feel
 */

import { createGlobalStyle, keyframes, css } from 'styled-components';

// ============================================
// COLOR PALETTE - Premium Monochrome
// ============================================

export const colors = {
  // Primary: Black & White
  black: '#000000',
  white: '#ffffff',
  
  // Grays - Premium Scale
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic Colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Accent - Subtle for premium feel
  accent: {
    primary: '#000000',
    secondary: '#666666',
    subtle: '#f5f5f5',
    hover: '#fafafa',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    focus: '0 0 0 3px rgba(0, 0, 0, 0.1)',
  },
  
  // Transparency
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.03)',
};

// ============================================
// TYPOGRAPHY - Clean & Professional
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  
  // Font Sizes (rem based)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
};

// ============================================
// SPACING SYSTEM
// ============================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  full: '9999px',
};

// ============================================
// TRANSITIONS - Smooth & Professional
// ============================================

export const transitions = {
  // Timing functions
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  
  // Durations
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  
  // Common transition combinations
  default: 'all 0.25s ease-in-out',
  fast: 'all 0.15s ease-in-out',
  slow: 'all 0.35s ease-in-out',
};

// ============================================
// BREAKPOINTS - Responsive Design
// ============================================

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Media query helpers
export const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  minXs: `@media (min-width: ${breakpoints.xs})`,
  minSm: `@media (min-width: ${breakpoints.sm})`,
  minMd: `@media (min-width: ${breakpoints.md})`,
  minLg: `@media (min-width: ${breakpoints.lg})`,
  minXl: `@media (min-width: ${breakpoints.xl})`,
};

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============================================
// ANIMATIONS
// ============================================

// Fade In
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Fade In Up
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fade In Down
const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Scale In
const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Slide In Right
const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Pulse
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Shimmer (for loading states)
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const animations = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  slideInRight,
  pulse,
  shimmer,
};

// Animation helper CSS
export const animationCSS = {
  fadeIn: css`animation: ${fadeIn} 0.3s ease-out;`,
  fadeInUp: css`animation: ${fadeInUp} 0.4s ease-out;`,
  fadeInDown: css`animation: ${fadeInDown} 0.4s ease-out;`,
  scaleIn: css`animation: ${scaleIn} 0.3s ease-out;`,
  slideInRight: css`animation: ${slideInRight} 0.3s ease-out;`,
  pulse: css`animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`,
};

// ============================================
// SHARED COMPONENT STYLES
// ============================================

// Container
export const container = css`
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  
  ${media.lg} {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

// Flex utilities
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

// Screen reader only
export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// ============================================
// GLOBAL STYLES
// ============================================

export const GlobalStyles = createGlobalStyle`
  /* Reset & Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize.base};
    line-height: ${typography.lineHeight.normal};
    color: ${colors.black};
    background-color: ${colors.white};
    min-height: 100vh;
  }
  
  /* Typography Reset */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${typography.fontFamily.heading};
    font-weight: ${typography.fontWeight.semibold};
    line-height: ${typography.lineHeight.tight};
    color: ${colors.black};
  }
  
  h1 {
    font-size: ${typography.fontSize['4xl']};
    font-weight: ${typography.fontWeight.bold};
    letter-spacing: ${typography.letterSpacing.tight};
  }
  
  h2 {
    font-size: ${typography.fontSize['3xl']};
    letter-spacing: ${typography.letterSpacing.tight};
  }
  
  h3 {
    font-size: ${typography.fontSize['2xl']};
  }
  
  h4 {
    font-size: ${typography.fontSize.xl};
  }
  
  h5 {
    font-size: ${typography.fontSize.lg};
  }
  
  h6 {
    font-size: ${typography.fontSize.base};
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${colors.black};
    text-decoration: none;
    transition: ${transitions.fast};
    
    &:hover {
      opacity: 0.7;
    }
  }
  
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }
  
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  ul, ol {
    list-style: none;
  }
  
  /* Selection */
  ::selection {
    background-color: ${colors.black};
    color: ${colors.white};
  }
  
  /* Scrollbar - Minimal */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${colors.gray[100]};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${colors.gray[400]};
    border-radius: ${borderRadius.full};
    
    &:hover {
      background: ${colors.gray[500]};
    }
  }
  
  /* Focus styles */
  :focus-visible {
    outline: 2px solid ${colors.black};
    outline-offset: 2px;
  }
  
  /* Loading skeleton */
  .skeleton {
    background: linear-gradient(
      90deg,
      ${colors.gray[200]} 25%,
      ${colors.gray[100]} 50%,
      ${colors.gray[200]} 75%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
    border-radius: ${borderRadius.md};
  }
`;

// ============================================
// EXPORT ALL
// ============================================

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  transitions,
  breakpoints,
  media,
  zIndex,
  animations,
  animationCSS,
  GlobalStyles,
  container,
  flexCenter,
  flexBetween,
  flexColumn,
  srOnly,
};
