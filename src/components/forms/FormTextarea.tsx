import React, { forwardRef } from 'react';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    labelIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
    label,
    error,
    labelIcon,
    fullWidth = true,
    className = '',
    required,
    id,
    rows = 4,
    ...props
}, ref) => {
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    
    const baseClasses = 'textarea-gaming transition-all duration-200';
    const errorClasses = error ? 'input-error' : '';
    const widthClasses = fullWidth ? 'w-full' : '';
    
    return (
        <div className={fullWidth ? 'w-full' : ''}>
            {label && (
                <FormLabel htmlFor={textareaId} required={required} icon={labelIcon}>
                    {label}
                </FormLabel>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                className={`${baseClasses} ${errorClasses} ${widthClasses} ${className}`}
                required={required}
                {...props}
            />
            <FormError message={error} />
        </div>
    );
});

FormTextarea.displayName = 'FormTextarea';
