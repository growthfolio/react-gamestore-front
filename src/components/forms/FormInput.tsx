import React, { forwardRef } from 'react';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    labelIcon?: React.ReactNode;
    variant?: 'default' | 'filled';
    fullWidth?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    label,
    error,
    icon,
    labelIcon,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    variant = 'default',
    fullWidth = true,
    className = '',
    required,
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    
    const baseClasses = 'input-gaming transition-all duration-200';
    const errorClasses = error ? 'input-error' : '';
    const widthClasses = fullWidth ? 'w-full' : '';
    const iconPaddingClasses = icon ? 'pl-11' : '';
    
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <FormLabel htmlFor={inputId} required={required} icon={labelIcon}>
                    {label}
                </FormLabel>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`${baseClasses} ${errorClasses} ${widthClasses} ${iconPaddingClasses} ${className}`}
                    required={required}
                    {...props}
                />
            </div>
            <FormError message={error} />
        </div>
    );
});

FormInput.displayName = 'FormInput';
