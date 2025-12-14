import { ReactNode } from 'react';

interface FormLabelProps {
    children: ReactNode;
    htmlFor?: string;
    required?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export function FormLabel({ children, htmlFor, required, icon, className = '' }: FormLabelProps) {
    return (
        <label 
            htmlFor={htmlFor}
            className={`label-gaming flex items-center gap-2 mb-2 ${className}`}
        >
            {icon && <span className="text-primary-400">{icon}</span>}
            <span>{children}</span>
            {required && <span className="text-error-500">*</span>}
        </label>
    );
}
