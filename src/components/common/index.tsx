/**
 * Common Components - Reusable UI elements
 */

'use client';

import React from 'react';

// Button Component
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: 'bg-pink-400 hover:bg-pink-500 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-black',
      danger: 'bg-red-500 hover:bg-red-600 text-white'
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          rounded-lg font-medium transition-colors
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? '...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Input Component
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-pink-400 focus:border-transparent
            outline-none transition-colors
            ${error ? 'border-red-500 bg-red-50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        hover:shadow-md transition-shadow
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700'
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-xs font-medium
        ${variantStyles[variant]}
      `}
    >
      {children}
    </span>
  );
};

// Loading Spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md'
}) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClass[size]} animate-spin`}>
      <div className="w-full h-full border-4 border-gray-200 border-t-pink-400 rounded-full"></div>
    </div>
  );
};

// Alert Component
interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div className={`p-4 rounded-lg border ${typeStyles[type]} flex justify-between items-start`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold opacity-50 hover:opacity-100 ml-4"
        >
          ×
        </button>
      )}
    </div>
  );
};

// Modal Component
interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold opacity-50 hover:opacity-100"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </Card>
    </div>
  );
};
