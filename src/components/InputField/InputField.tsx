import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email' | 'number';
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  showClearButton = false,
  showPasswordToggle = false,
  className = '',
  id,
  name,
  autoComplete,
  required = false,
}) => {
  const [inputType, setInputType] = useState(type);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const isPassword = type === 'password';
  const hasValue = value && value.length > 0;
  const showError = invalid && errorMessage;
  const showHelper = !showError && helperText;
  
  useEffect(() => {
    setInputType(type);
  }, [type]);

  const handleClear = () => {
    if (onChange && !disabled) {
      const event = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
      inputRef.current?.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  // Size classes
  const sizeClasses = {
    sm: {
      input: 'px-3 py-2 text-sm',
      label: 'text-sm',
      helper: 'text-xs',
      icon: 'w-4 h-4',
    },
    md: {
      input: 'px-4 py-3 text-base',
      label: 'text-sm',
      helper: 'text-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      input: 'px-5 py-4 text-lg',
      label: 'text-base',
      helper: 'text-base',
      icon: 'w-6 h-6',
    },
  };

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses = `
      w-full rounded-lg transition-all duration-200 ease-in-out
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text'}
      ${sizeClasses[size].input}
    `;

    if (variant === 'filled') {
      return `${baseClasses} 
        bg-gray-100 dark:bg-gray-800 border-2 border-transparent
        ${!disabled && isFocused ? 'bg-gray-50 dark:bg-gray-700 ring-2 ring-blue-500 ring-opacity-20' : ''}
        ${!disabled && !isFocused ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
        ${showError ? 'ring-2 ring-red-500 ring-opacity-20 bg-red-50 dark:bg-red-900/10' : ''}
      `;
    }
    
    if (variant === 'outlined') {
      return `${baseClasses}
        bg-white dark:bg-gray-900 border-2 
        ${showError ? 'border-red-500 ring-2 ring-red-500 ring-opacity-20' : 'border-gray-300 dark:border-gray-600'}
        ${!disabled && !showError && isFocused ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : ''}
        ${!disabled && !showError && !isFocused ? 'hover:border-gray-400 dark:hover:border-gray-500' : ''}
      `;
    }
    
    // Ghost variant
    return `${baseClasses}
      bg-transparent border-0 border-b-2 rounded-none
      ${showError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
      ${!disabled && !showError && isFocused ? 'border-blue-500' : ''}
      ${!disabled && !showError && !isFocused ? 'hover:border-gray-400 dark:hover:border-gray-500' : ''}
    `;
  };

  const textClasses = `
    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
    focus:outline-none disabled:text-gray-500 dark:disabled:text-gray-400
  `;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={`
            block font-medium mb-2 transition-colors duration-200
            ${sizeClasses[size].label}
            ${showError ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          autoComplete={autoComplete}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${getVariantClasses()}
            ${textClasses}
            ${(showClearButton || (isPassword && showPasswordToggle) || loading) ? 'pr-12' : ''}
            ${(showClearButton && (isPassword && showPasswordToggle)) ? 'pr-20' : ''}
          `}
          aria-invalid={invalid}
          aria-describedby={
            showError ? `${inputId}-error` : 
            showHelper ? `${inputId}-helper` : undefined
          }
        />

        {/* Right side icons */}
        {((showClearButton && hasValue) || (isPassword && showPasswordToggle) || loading) && (
          <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
            {/* Loading spinner */}
            {loading && (
              <Loader2 
                className={`${sizeClasses[size].icon} animate-spin text-gray-400`}
                aria-label="Loading"
              />
            )}
            
            {/* Clear button */}
            {!loading && showClearButton && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={`
                  ${sizeClasses[size].icon} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                  transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                  p-1 -m-1
                `}
                aria-label="Clear input"
              >
                <X className="w-full h-full" />
              </button>
            )}
            
            {/* Password toggle */}
            {!loading && isPassword && showPasswordToggle && !disabled && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`
                  ${sizeClasses[size].icon} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                  transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                  p-1 -m-1
                `}
                aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}
              >
                {inputType === 'password' ? (
                  <Eye className="w-full h-full" />
                ) : (
                  <EyeOff className="w-full h-full" />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Helper text or error message */}
      {(showHelper || showError) && (
        <div className={`mt-2 ${sizeClasses[size].helper}`}>
          {showError ? (
            <p 
              id={`${inputId}-error`}
              className="text-red-600 dark:text-red-400 flex items-center gap-1"
              role="alert"
            >
              <span className="inline-block w-1 h-1 bg-current rounded-full"></span>
              {errorMessage}
            </p>
          ) : (
            <p 
              id={`${inputId}-helper`}
              className="text-gray-600 dark:text-gray-400"
            >
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default InputField;