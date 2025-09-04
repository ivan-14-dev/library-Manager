import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    border: none;
    outline: none;
    font-family: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .section {
    padding: 2rem 0;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    gap: 0.5rem;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--primary {
      background-color: #007bff;
      color: white;

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }
    }

    &--secondary {
      background-color: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background-color: #545b62;
      }
    }

    &--success {
      background-color: #28a745;
      color: white;

      &:hover:not(:disabled) {
        background-color: #1e7e34;
      }
    }

    &--danger {
      background-color: #dc3545;
      color: white;

      &:hover:not(:disabled) {
        background-color: #bd2130;
      }
    }

    &--outline {
      background-color: transparent;
      border: 2px solid currentColor;

      &-primary {
        color: #007bff;
        
        &:hover:not(:disabled) {
          background-color: #007bff;
          color: white;
        }
      }
    }

    &--sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    &--lg {
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }
  }

  .card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    &__header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    &__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
    }

    &__body {
      margin-bottom: 1rem;
    }

    &__footer {
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }
  }

  .grid {
    display: grid;
    gap: 1.5rem;

    &--2 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    &--3 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    &--4 {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  .form {
    &__group {
      margin-bottom: 1.5rem;
    }

    &__label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    &__control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 0.5rem;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #007bff;
      }

      &--error {
        border-color: #dc3545;
      }
    }

    &__error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    &::after {
      content: '';
      width: 2rem;
      height: 2rem;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .text {
    &--center { text-align: center; }
    &--left { text-align: left; }
    &--right { text-align: right; }
    &--muted { color: #6c757d; }
    &--success { color: #28a745; }
    &--danger { color: #dc3545; }
    &--warning { color: #ffc107; }
    &--info { color: #17a2b8; }
  }

  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 1rem; }
  .mt-4 { margin-top: 1.5rem; }
  .mt-5 { margin-top: 3rem; }

  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .mb-5 { margin-bottom: 3rem; }

  @media (max-width: 768px) {
    .container {
      padding: 0 0.5rem;
    }

    .grid {
      &--2, &--3, &--4 {
        grid-template-columns: 1fr;
      }
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
`;

export default GlobalStyles;