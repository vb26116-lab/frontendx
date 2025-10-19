'use client';
import React, { ReactNode, forwardRef, useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={`peer pl-3 pr-3 py-3 border border-blue-300 w-full outline-none rounded transition-all focus:border-blue-500`}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => setIsFocused(!!e.target.value)}
          placeholder=" "
          {...props}
        />
        <label
          className={`absolute left-3 text-gray-500 transition-all duration-200 
            ${isFocused ? 'text-xs -top-2 bg-white px-1 text-blue-600' : 'top-3 text-sm text-blue-400'}
          `}
        >
          {placeholder}
        </label>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;

