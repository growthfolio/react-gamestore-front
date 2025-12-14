import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
}

export function FormButton({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    className = '',
    ...props
}: FormButtonProps) {
    const baseClasses = 'font-accent font-bold uppercase tracking-wide rounded-gaming transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses: Record<ButtonVariant, string> = {
        primary: 'bg-gradient-gaming text-white shadow-glow-md hover:shadow-glow-lg transform hover:scale-105',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-500 shadow-glow-purple',
        accent: 'bg-accent-500 text-neutral-900 shadow-glow-neon hover:bg-accent-400',
        outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white bg-transparent',
        ghost: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700',
        danger: 'bg-error-600 text-white hover:bg-error-500 shadow-glow-sm'
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base'
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonContent = () => {
        if (loading) {
            return (
                <>
                    <CircleNotch className="animate-spin" size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
                    {loadingText && <span>{loadingText}</span>}
                </>
            );
        }

        return (
            <>
                {icon && iconPosition === 'left' && icon}
                {children}
                {icon && iconPosition === 'right' && icon}
            </>
        );
    };

    return (
        <button
            className={`
                ${baseClasses}
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${widthClasses}
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {buttonContent()}
        </button>
    );
}
