import React from 'react';
import { inputStyles } from '../../lib/theme';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  name,
  id,
}: InputProps) {
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  const combinedClasses = `${inputStyles} ${disabledStyles} ${className}`.trim();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={combinedClasses}
      name={name}
      id={id}
    />
  );
} 