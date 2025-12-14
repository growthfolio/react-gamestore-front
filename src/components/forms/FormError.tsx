import { Warning } from '@phosphor-icons/react';

interface FormErrorProps {
    message?: string;
    className?: string;
}

export function FormError({ message, className = '' }: FormErrorProps) {
    if (!message) return null;
    
    return (
        <div className={`flex items-center gap-2 mt-1 text-error-500 body-sm ${className}`}>
            <Warning size={14} weight="fill" />
            <span>{message}</span>
        </div>
    );
}
