/**
 * 🎨 AcHub Global Styles
 * Professional White/Black Theme
 */

import { createGlobalStyle } from 'styled-components';
import { colors, typography, spacing, borderRadius, transitions } from './DesignSystem';

const GlobalStyles = createGlobalStyle`
  /* Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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

  /* Typography */
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

  p {
    margin-bottom: ${spacing[4]};
    line-height: ${typography.lineHeight.relaxed};
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: ${transitions.fast};
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
    background: none;
  }

  input, textarea, select {
    border: none;
    outline: none;
    font-family: inherit;
    font-size: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Selection */
  ::selection {
    background-color: ${colors.black};
    color: ${colors.white};
  }

  /* Focus styles */
  :focus-visible {
    outline: 2px solid ${colors.black};
    outline-offset: 2px;
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
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.gray[500]};
  }

  /* Utility Classes */
  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${spacing[6]};
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 ${spacing[4]};
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Animation Classes */
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out forwards;
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
`;

export default GlobalStyles;
