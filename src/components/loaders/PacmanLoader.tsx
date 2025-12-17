import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface PacmanLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  message?: string;
  showDots?: boolean;
}

const sizeConfig = {
  sm: {
    pacman: 32,
    dot: 6,
    gap: 12,
  },
  md: {
    pacman: 48,
    dot: 8,
    gap: 16,
  },
  lg: {
    pacman: 64,
    dot: 10,
    gap: 20,
  },
  xl: {
    pacman: 80,
    dot: 12,
    gap: 24,
  },
};

export const PacmanLoader = ({
  size = 'md',
  color = '#FFD700',
  message,
  showDots = true,
}: PacmanLoaderProps) => {
  const config = sizeConfig[size];
  const [dotIndex, setDotIndex] = useState(0);

  // Animate dots being eaten
  useEffect(() => {
    if (!showDots) return;
    
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % 4);
    }, 200);
    
    return () => clearInterval(interval);
  }, [showDots]);

  // Pacman mouth animation variants
  const topHalfVariants = {
    animate: {
      rotate: [0, -30, 0],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const bottomHalfVariants = {
    animate: {
      rotate: [0, 30, 0],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        {/* Pacman - using proper circle proportions */}
        <div 
          className="relative"
          style={{ 
            width: config.pacman, 
            height: config.pacman,
          }}
        >
          {/* Top half - semicircle */}
          <motion.div
            className="absolute top-0 left-0 w-full overflow-hidden"
            style={{ 
              height: config.pacman / 2,
              transformOrigin: 'center bottom',
            }}
            variants={topHalfVariants}
            animate="animate"
          >
            <div
              style={{
                width: config.pacman,
                height: config.pacman,
                backgroundColor: color,
                borderRadius: '50%',
              }}
            />
          </motion.div>

          {/* Bottom half - semicircle */}
          <motion.div
            className="absolute bottom-0 left-0 w-full overflow-hidden"
            style={{ 
              height: config.pacman / 2,
              transformOrigin: 'center top',
            }}
            variants={bottomHalfVariants}
            animate="animate"
          >
            <div
              style={{
                width: config.pacman,
                height: config.pacman,
                backgroundColor: color,
                borderRadius: '50%',
                marginTop: -(config.pacman / 2),
              }}
            />
          </motion.div>

          {/* Eye */}
          <div
            className="absolute bg-black rounded-full"
            style={{
              width: config.pacman * 0.12,
              height: config.pacman * 0.12,
              top: config.pacman * 0.18,
              left: config.pacman * 0.55,
            }}
          />
        </div>

        {/* Dots being eaten */}
        {showDots && (
          <div className="flex items-center" style={{ gap: config.gap }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width: config.dot,
                  height: config.dot,
                  backgroundColor: color,
                }}
                animate={{
                  opacity: i < dotIndex ? 0 : 1,
                  scale: i < dotIndex ? 0.5 : 1,
                }}
                transition={{
                  duration: 0.15,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Loading message */}
      {message && (
        <motion.p
          className="text-sm font-medium text-gray-600 dark:text-gray-300"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

// ============================================
// Custom Hook for managing loader with delays
// ============================================

interface UseLoaderOptions {
  /** Delay before showing the loader (prevents flash for quick loads) */
  showDelay?: number;
  /** Minimum time the loader must be displayed once shown */
  minDisplayTime?: number;
}

interface UseLoaderReturn {
  isVisible: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoader = (options: UseLoaderOptions = {}): UseLoaderReturn => {
  const { showDelay = 300, minDisplayTime = 500 } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showStartTime, setShowStartTime] = useState<number | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle show delay
  useEffect(() => {
    if (isLoading && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setShowStartTime(Date.now());
      }, showDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isVisible, showDelay]);

  // Handle minimum display time
  useEffect(() => {
    if (!isLoading && isVisible && showStartTime) {
      const elapsed = Date.now() - showStartTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowStartTime(null);
      }, remaining);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isVisible, showStartTime, minDisplayTime]);

  return { isVisible, startLoading, stopLoading };
};

export default PacmanLoader;
