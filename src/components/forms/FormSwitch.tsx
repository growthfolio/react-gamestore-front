import React from 'react';

interface FormSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    activeColor?: 'primary' | 'accent' | 'success';
    className?: string;
}

export function FormSwitch({
    checked,
    onChange,
    label,
    description,
    icon,
    disabled = false,
    size = 'md',
    activeColor = 'primary',
    className = ''
}: FormSwitchProps) {
    const sizeClasses = {
        sm: { track: 'h-5 w-9', thumb: 'h-3 w-3', translate: 'translate-x-4' },
        md: { track: 'h-6 w-11', thumb: 'h-4 w-4', translate: 'translate-x-5' },
        lg: { track: 'h-8 w-14', thumb: 'h-6 w-6', translate: 'translate-x-7' }
    };

    const colorClasses = {
        primary: checked ? 'bg-primary-500' : 'bg-neutral-700',
        accent: checked ? 'bg-accent-500' : 'bg-neutral-700',
        success: checked ? 'bg-success-500' : 'bg-neutral-700'
    };

    const iconColorClasses = {
        primary: checked ? 'text-primary-400' : 'text-neutral-500',
        accent: checked ? 'text-accent-400' : 'text-neutral-500',
        success: checked ? 'text-success-500' : 'text-neutral-500'
    };

    const { track, thumb, translate } = sizeClasses[size];

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3">
                {icon && (
                    <span className={`transition-colors ${iconColorClasses[activeColor]}`}>
                        {icon}
                    </span>
                )}
                {(label || description) && (
                    <div>
                        {label && (
                            <p className="text-neutral-100 font-gaming font-medium">
                                {label}
                            </p>
                        )}
                        {description && (
                            <p className="text-neutral-500 body-sm">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`
                    relative inline-flex items-center rounded-full transition-colors duration-200
                    ${track}
                    ${colorClasses[activeColor]}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50
                `}
            >
                <span
                    className={`
                        inline-block rounded-full bg-white shadow-lg transition-transform duration-200
                        ${thumb}
                        ${checked ? translate : 'translate-x-1'}
                    `}
                />
            </button>
        </div>
    );
}
