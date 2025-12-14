import React, { forwardRef } from 'react';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

interface FormSelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    labelIcon?: React.ReactNode;
    options: FormSelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
    label,
    error,
    labelIcon,
    options,
    placeholder,
    fullWidth = true,
    className = '',
    required,
    id,
    ...props
}, ref) => {
    const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    
    const baseClasses = 'select-gaming transition-all duration-200';
    const errorClasses = error ? 'input-error' : '';
    const widthClasses = fullWidth ? 'w-full' : '';
    
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <FormLabel htmlFor={selectId} required={required} icon={labelIcon}>
                    {label}
                </FormLabel>
            )}
            <select
                ref={ref}
                id={selectId}
                className={`${baseClasses} ${errorClasses} ${widthClasses} ${className}`}
                required={required}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option 
                        key={option.value} 
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <FormError message={error} />
        </div>
    );
});

FormSelect.displayName = 'FormSelect';
