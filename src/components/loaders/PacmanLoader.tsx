import { memo, useMemo } from 'react';

interface PacmanLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    dotColor?: string;
    speed?: number;
    text?: string;
    className?: string;
    ariaLabel?: string;
}

const sizeMap = {
    sm: { pacman: 24, dot: 6, gap: 12 },
    md: { pacman: 36, dot: 8, gap: 14 },
    lg: { pacman: 48, dot: 10, gap: 16 },
    xl: { pacman: 64, dot: 12, gap: 20 },
};

function PacmanLoaderComponent({
    size = 'md',
    color = '#FACC15',
    dotColor = '#00FFFF',
    speed = 400,
    text,
    className = '',
    ariaLabel = 'Carregando...',
}: PacmanLoaderProps) {
    const dimensions = sizeMap[size];
    
    const animationStyles = useMemo(() => ({
        animationDuration: `${speed}ms`,
    }), [speed]);

    return (
        <div 
            className={`flex flex-col items-center justify-center gap-4 ${className}`}
            role="status"
            aria-label={ariaLabel}
        >
            <div 
                className="relative flex items-center"
                style={{ height: dimensions.pacman, minWidth: dimensions.pacman * 3.5 }}
            >
                {/* Pacman - círculo completo com boca */}
                <div 
                    className="relative z-10 flex-shrink-0"
                    style={{ width: dimensions.pacman, height: dimensions.pacman }}
                >
                    {/* Parte superior */}
                    <div 
                        className="absolute animate-pacman-top"
                        style={{
                            ...animationStyles,
                            width: dimensions.pacman,
                            height: dimensions.pacman / 2,
                            background: color,
                            borderTopLeftRadius: dimensions.pacman,
                            borderTopRightRadius: dimensions.pacman,
                            transformOrigin: 'center bottom',
                        }}
                    />
                    {/* Parte inferior */}
                    <div 
                        className="absolute animate-pacman-bottom"
                        style={{
                            ...animationStyles,
                            width: dimensions.pacman,
                            height: dimensions.pacman / 2,
                            top: dimensions.pacman / 2,
                            background: color,
                            borderBottomLeftRadius: dimensions.pacman,
                            borderBottomRightRadius: dimensions.pacman,
                            transformOrigin: 'center top',
                        }}
                    />
                    {/* Olho */}
                    <div 
                        className="absolute rounded-full bg-neutral-900 z-10"
                        style={{
                            width: dimensions.dot * 0.5,
                            height: dimensions.dot * 0.5,
                            top: dimensions.pacman * 0.2,
                            left: dimensions.pacman * 0.5,
                        }}
                    />
                </div>

                {/* Dots */}
                <div className="flex items-center" style={{ marginLeft: dimensions.gap }}>
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className="rounded-full animate-pacman-dot"
                            style={{
                                width: dimensions.dot,
                                height: dimensions.dot,
                                backgroundColor: dotColor,
                                marginLeft: index > 0 ? dimensions.gap : 0,
                                animationDelay: `${index * (speed / 4)}ms`,
                                animationDuration: `${speed}ms`,
                                boxShadow: `0 0 ${dimensions.dot}px ${dotColor}40`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {text && (
                <p className="text-neutral-400 font-gaming text-sm animate-pulse">
                    {text}
                </p>
            )}

            <span className="sr-only">{ariaLabel}</span>
        </div>
    );
}

export const PacmanLoader = memo(PacmanLoaderComponent);

interface PacmanSpinnerProps {
    size?: number;
    color?: string;
    className?: string;
}

function PacmanSpinnerComponent({ 
    size = 16, 
    color = '#FACC15',
    className = '' 
}: PacmanSpinnerProps) {
    return (
        <div 
            className={`relative ${className}`}
            style={{ width: size, height: size }}
            role="status"
            aria-label="Carregando"
        >
            <div 
                className="absolute animate-pacman-top"
                style={{
                    width: size,
                    height: size / 2,
                    background: color,
                    borderTopLeftRadius: size,
                    borderTopRightRadius: size,
                    transformOrigin: 'center bottom',
                    animationDuration: '300ms',
                }}
            />
            <div 
                className="absolute animate-pacman-bottom"
                style={{
                    width: size,
                    height: size / 2,
                    top: size / 2,
                    background: color,
                    borderBottomLeftRadius: size,
                    borderBottomRightRadius: size,
                    transformOrigin: 'center top',
                    animationDuration: '300ms',
                }}
            />
        </div>
    );
}

export const PacmanSpinner = memo(PacmanSpinnerComponent);

export default PacmanLoader;
