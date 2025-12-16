import { memo, useMemo } from 'react';

interface PacmanLoaderProps {
    /** Tamanho do loader em pixels */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Cor principal do Pacman (padrão: amarelo) */
    color?: string;
    /** Cor dos dots (padrão: ciano/accent) */
    dotColor?: string;
    /** Velocidade da animação em ms (padrão: 500) */
    speed?: number;
    /** Texto exibido abaixo do loader */
    text?: string;
    /** Classe CSS adicional */
    className?: string;
    /** Acessibilidade */
    ariaLabel?: string;
}

const sizeMap = {
    sm: { pacman: 24, dot: 6, gap: 12 },
    md: { pacman: 32, dot: 8, gap: 16 },
    lg: { pacman: 48, dot: 10, gap: 20 },
    xl: { pacman: 64, dot: 12, gap: 24 },
};

/**
 * Loader animado estilo Pacman
 * 
 * @example
 * ```tsx
 * <PacmanLoader size="md" text="Carregando..." />
 * ```
 */
function PacmanLoaderComponent({
    size = 'md',
    color = '#FACC15', // yellow-400
    dotColor = '#00FFFF', // accent/cyan
    speed = 400,
    text,
    className = '',
    ariaLabel = 'Carregando...',
}: PacmanLoaderProps) {
    const dimensions = sizeMap[size];
    
    // Memoiza os estilos de animação para evitar recriação
    const animationStyles = useMemo(() => ({
        animationDuration: `${speed}ms`,
    }), [speed]);

    return (
        <div 
            className={`flex flex-col items-center justify-center gap-4 ${className}`}
            role="status"
            aria-label={ariaLabel}
        >
            {/* Container do Pacman + Dots */}
            <div 
                className="relative flex items-center"
                style={{ height: dimensions.pacman, minWidth: dimensions.pacman * 4 }}
            >
                {/* Pacman */}
                <div 
                    className="relative z-10"
                    style={{ width: dimensions.pacman, height: dimensions.pacman }}
                >
                    {/* Parte superior (boca abrindo/fechando) */}
                    <div 
                        className="absolute inset-0 animate-pacman-top"
                        style={{
                            ...animationStyles,
                            background: color,
                            borderRadius: '50%',
                            clipPath: 'polygon(100% 50%, 50% 0%, 0% 0%, 0% 50%)',
                        }}
                    />
                    {/* Parte inferior (boca abrindo/fechando) */}
                    <div 
                        className="absolute inset-0 animate-pacman-bottom"
                        style={{
                            ...animationStyles,
                            background: color,
                            borderRadius: '50%',
                            clipPath: 'polygon(100% 50%, 50% 100%, 0% 100%, 0% 50%)',
                        }}
                    />
                    {/* Olho */}
                    <div 
                        className="absolute rounded-full bg-neutral-900"
                        style={{
                            width: dimensions.dot * 0.6,
                            height: dimensions.dot * 0.6,
                            top: '20%',
                            left: '45%',
                        }}
                    />
                </div>

                {/* Dots sendo comidos */}
                <div className="flex items-center" style={{ marginLeft: dimensions.gap / 2 }}>
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

            {/* Texto opcional */}
            {text && (
                <p className="text-neutral-400 font-gaming text-sm animate-pulse">
                    {text}
                </p>
            )}

            {/* Screen reader text */}
            <span className="sr-only">{ariaLabel}</span>
        </div>
    );
}

// Memo para evitar re-renders desnecessários
export const PacmanLoader = memo(PacmanLoaderComponent);

// Variante para uso em botões/inline
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
                className="absolute inset-0 animate-pacman-top"
                style={{
                    background: color,
                    borderRadius: '50%',
                    clipPath: 'polygon(100% 50%, 50% 0%, 0% 0%, 0% 50%)',
                    animationDuration: '300ms',
                }}
            />
            <div 
                className="absolute inset-0 animate-pacman-bottom"
                style={{
                    background: color,
                    borderRadius: '50%',
                    clipPath: 'polygon(100% 50%, 50% 100%, 0% 100%, 0% 50%)',
                    animationDuration: '300ms',
                }}
            />
        </div>
    );
}

export const PacmanSpinner = memo(PacmanSpinnerComponent);

export default PacmanLoader;
