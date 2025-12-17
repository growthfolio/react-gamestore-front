import { useState, useEffect, useRef, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PacmanLoader } from './PacmanLoader';

interface LoadingOverlayProps {
  /** Whether the overlay is loading */
  isLoading: boolean;
  /** Loader size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom loading message */
  message?: string;
  /** Custom color for the Pacman */
  color?: string;
  /** Whether to show the dots animation */
  showDots?: boolean;
  /** Children to render behind the overlay */
  children?: ReactNode;
  /** Whether the overlay covers the full screen or just its container */
  fullScreen?: boolean;
  /** Background blur intensity */
  blur?: 'none' | 'sm' | 'md' | 'lg';
  /** Delay before showing the loader (prevents flash for quick loads) */
  showDelay?: number;
  /** Minimum time the loader must be displayed once shown */
  minDisplayTime?: number;
}

const blurConfig = {
  none: '',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
};

export const LoadingOverlay = ({
  isLoading,
  size = 'lg',
  message = 'Carregando...',
  color = '#FFD700',
  showDots = true,
  children,
  fullScreen = true,
  blur = 'sm',
  showDelay = 300,
  minDisplayTime = 800,
}: LoadingOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const loadingStartRef = useRef<number | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending timers
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (isLoading) {
      // Delay before showing the loader
      showTimerRef.current = setTimeout(() => {
        setIsVisible(true);
        loadingStartRef.current = Date.now();
      }, showDelay);
    } else if (isVisible && loadingStartRef.current) {
      // Calculate remaining time to meet minimum display time
      const elapsed = Date.now() - loadingStartRef.current;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        loadingStartRef.current = null;
      }, remaining);
    } else {
      // Loading finished before showDelay elapsed
      setIsVisible(false);
      loadingStartRef.current = null;
    }

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isLoading, isVisible, showDelay, minDisplayTime]);

  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn' as const,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.1,
        duration: 0.2,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.15,
        ease: 'easeIn' as const,
      },
    },
  };

  const positionClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 z-10';

  return (
    <div className={fullScreen ? '' : 'relative'}>
      {children}
      
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="loading-overlay"
            className={`${positionClasses} flex items-center justify-center ${blurConfig[blur]}`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-black/40 backdrop-blur-md"
            >
              <PacmanLoader
                size={size}
                color={color}
                showDots={showDots}
              />
              
              {message && (
                <motion.p
                  className="text-white text-lg font-medium mt-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {message}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ========================================
// Inline Loader for smaller contexts
// ========================================

interface InlineLoaderProps {
  isLoading: boolean;
  size?: 'sm' | 'md';
  color?: string;
  showDelay?: number;
  minDisplayTime?: number;
}

export const InlineLoader = ({
  isLoading,
  size = 'sm',
  color = '#FFD700',
  showDelay = 150,
  minDisplayTime = 400,
}: InlineLoaderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const loadingStartRef = useRef<number | null>(null);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    if (isLoading) {
      showTimer = setTimeout(() => {
        setIsVisible(true);
        loadingStartRef.current = Date.now();
      }, showDelay);
    } else if (isVisible && loadingStartRef.current) {
      const elapsed = Date.now() - loadingStartRef.current;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      hideTimer = setTimeout(() => {
        setIsVisible(false);
        loadingStartRef.current = null;
      }, remaining);
    } else {
      setIsVisible(false);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading, isVisible, showDelay, minDisplayTime]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center justify-center"
        >
          <PacmanLoader size={size} color={color} showDots={false} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ========================================
// Loading Modal for batch operations
// ========================================

interface LoadingModalProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  counter?: { current: number; total: number };
  color?: string;
  showDelay?: number;
  minDisplayTime?: number;
}

export const LoadingModal = ({
  isVisible,
  title = 'Carregando...',
  description,
  counter,
  color = '#FFD700',
  showDelay = 0,
  minDisplayTime = 1000,
}: LoadingModalProps) => {
  const [shouldShow, setShouldShow] = useState(false);
  const showStartRef = useRef<number | null>(null);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    if (isVisible) {
      showTimer = setTimeout(() => {
        setShouldShow(true);
        showStartRef.current = Date.now();
      }, showDelay);
    } else if (shouldShow && showStartRef.current) {
      const elapsed = Date.now() - showStartRef.current;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      hideTimer = setTimeout(() => {
        setShouldShow(false);
        showStartRef.current = null;
      }, remaining);
    } else {
      setShouldShow(false);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isVisible, shouldShow, showDelay, minDisplayTime]);

  const progress = counter ? Math.round((counter.current / counter.total) * 100) : 0;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <div className="flex flex-col items-center gap-6">
              <PacmanLoader size="lg" color={color} showDots={true} />
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                {description && (
                  <p className="text-gray-400 text-sm">{description}</p>
                )}
              </div>

              {counter && (
                <div className="w-full space-y-2">
                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                  
                  {/* Counter text */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {counter.current} de {counter.total}
                    </span>
                    <span className="text-white font-medium">
                      {progress}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
