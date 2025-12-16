import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PacmanLoader } from './PacmanLoader';

interface LoadingOverlayProps {
    /** Controla a visibilidade do overlay */
    isVisible: boolean;
    /** Texto exibido abaixo do loader */
    text?: string;
    /** Subtexto opcional (ex: "Aguarde um momento...") */
    subtext?: string;
    /** Intensidade do blur do fundo */
    blur?: 'none' | 'sm' | 'md' | 'lg';
    /** Opacidade do fundo (0-100) */
    opacity?: number;
    /** Z-index do overlay */
    zIndex?: number;
    /** Tempo mínimo de exibição em ms (padrão: 800) */
    minDisplayTime?: number;
    /** Callback quando a animação de entrada termina */
    onEntered?: () => void;
    /** Callback quando a animação de saída termina */
    onExited?: () => void;
}

const blurMap = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
};

/**
 * Overlay fullscreen com loader Pacman
 * Ideal para loading de página ou dados críticos
 * 
 * @example
 * ```tsx
 * <LoadingOverlay 
 *   isVisible={isLoading} 
 *   text="Carregando produtos..." 
 * />
 * ```
 */
function LoadingOverlayComponent({
    isVisible,
    text = 'Carregando...',
    subtext,
    blur = 'sm',
    opacity = 80,
    zIndex = 50,
    minDisplayTime = 800,
    onEntered,
    onExited,
}: LoadingOverlayProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [canHide, setCanHide] = useState(true);
    const showTimeRef = useState<number>(0);

    useEffect(() => {
        if (isVisible) {
            showTimeRef[1](Date.now());
            setCanHide(false);
            setShouldRender(true);
            requestAnimationFrame(() => {
                setIsAnimating(true);
                onEntered?.();
            });
            
            // Garante tempo mínimo de exibição
            const timer = setTimeout(() => {
                setCanHide(true);
            }, minDisplayTime);
            
            return () => clearTimeout(timer);
        } else if (canHide) {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
                onExited?.();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, canHide, minDisplayTime, onEntered, onExited]);
    
    // Efeito separado para esconder quando canHide muda
    useEffect(() => {
        if (!isVisible && canHide && shouldRender) {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
                onExited?.();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [canHide, isVisible, shouldRender, onExited]);

    // Previne scroll do body quando overlay está visível
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVisible]);

    if (!shouldRender) return null;

    const overlayContent = (
        <div
            className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${blurMap[blur]} ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
                zIndex,
                backgroundColor: `rgba(10, 10, 10, ${opacity / 100})`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={text}
        >
            {/* Container central com efeito de glow */}
            <div className={`flex flex-col items-center gap-6 transition-transform duration-300 ${
                isAnimating ? 'scale-100' : 'scale-95'
            }`}>
                <PacmanLoader size="xl" />
                
                {/* Texto principal */}
                <div className="text-center">
                    <p className="text-neutral-100 font-gaming text-lg tracking-wide">
                        {text}
                    </p>
                    {subtext && (
                        <p className="text-neutral-500 text-sm mt-1">
                            {subtext}
                        </p>
                    )}
                </div>
            </div>

            {/* Efeito de glow no fundo */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(250, 204, 21, 0.05) 0%, transparent 50%)',
                }}
            />
        </div>
    );

    // Usa portal para renderizar no root do DOM
    return createPortal(overlayContent, document.body);
}

export const LoadingOverlay = memo(LoadingOverlayComponent);

// ============================================================================
// Loading Modal - Para ações específicas (importar, salvar, etc.)
// ============================================================================

interface LoadingModalProps {
    /** Controla a visibilidade do modal */
    isVisible: boolean;
    /** Título do modal */
    title?: string;
    /** Descrição da ação sendo executada */
    description?: string;
    /** Progresso (0-100) - opcional */
    progress?: number;
    /** Mostra contador de itens (ex: "3 de 10") */
    counter?: { current: number; total: number };
    /** Z-index do modal */
    zIndex?: number;
}

/**
 * Modal centralizado para ações do usuário
 * Ideal para importação em lote, salvamento, etc.
 * 
 * @example
 * ```tsx
 * <LoadingModal 
 *   isVisible={isImporting}
 *   title="Importando jogos"
 *   description="Aguarde enquanto importamos os jogos selecionados..."
 *   counter={{ current: 3, total: 10 }}
 * />
 * ```
 */
function LoadingModalComponent({
    isVisible,
    title = 'Processando...',
    description,
    progress,
    counter,
    zIndex = 50,
}: LoadingModalProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVisible]);

    if (!shouldRender) return null;

    const modalContent = (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
                zIndex,
                backgroundColor: 'rgba(10, 10, 10, 0.85)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Card do modal */}
            <div className={`bg-neutral-900 border border-neutral-700 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transition-transform duration-300 ${
                isAnimating ? 'scale-100' : 'scale-95'
            }`}>
                {/* Loader */}
                <div className="flex justify-center mb-6">
                    <PacmanLoader size="lg" />
                </div>

                {/* Título */}
                <h3 className="text-neutral-100 font-gaming text-xl text-center mb-2">
                    {title}
                </h3>

                {/* Descrição */}
                {description && (
                    <p className="text-neutral-400 text-sm text-center mb-4">
                        {description}
                    </p>
                )}

                {/* Contador */}
                {counter && (
                    <div className="text-center mb-4">
                        <span className="text-primary-400 font-accent text-2xl font-bold">
                            {counter.current}
                        </span>
                        <span className="text-neutral-500 font-accent text-lg mx-2">de</span>
                        <span className="text-neutral-300 font-accent text-2xl font-bold">
                            {counter.total}
                        </span>
                    </div>
                )}

                {/* Barra de progresso */}
                {progress !== undefined && (
                    <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export const LoadingModal = memo(LoadingModalComponent);

export default LoadingOverlay;
