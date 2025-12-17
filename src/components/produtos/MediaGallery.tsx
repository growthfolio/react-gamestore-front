import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Play, X, CaretLeft, CaretRight, MagnifyingGlassPlus } from '@phosphor-icons/react';
import { ImagemMedia, VideoMedia, getBestImageUrl, getBestVideoThumb } from '../../models/produtos/Media';

// ==================== TIPOS ====================

type GalleryItem = 
  | { type: 'image'; data: ImagemMedia }
  | { type: 'video'; data: VideoMedia };

interface MediaGalleryProps {
  videos?: VideoMedia[];
  screenshots?: ImagemMedia[];
  artworks?: ImagemMedia[];
  fallbackImage?: ImagemMedia | null;
  productName: string;
  className?: string;
}

// ==================== SKELETON COMPONENT ====================

function ImageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-neutral-800 animate-pulse ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent skeleton-shimmer" />
    </div>
  );
}

// ==================== LAZY IMAGE COMPONENT ====================

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

function LazyImage({ src, alt, className = '', onLoad }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <ImageSkeleton className="absolute inset-0" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-600">
          🎮
        </div>
      )}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function MediaGallery({
  videos = [],
  screenshots = [],
  artworks = [],
  fallbackImage,
  productName,
  className = '',
}: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoMedia | null>(null);
  const [direction, setDirection] = useState(0);

  // Combina mídia em ordem: vídeos primeiro, depois screenshots, por fim artworks
  const galleryItems: GalleryItem[] = [
    ...videos.map(v => ({ type: 'video' as const, data: v })),
    ...screenshots.map(img => ({ type: 'image' as const, data: img })),
    ...artworks.map(img => ({ type: 'image' as const, data: img })),
  ];

  const currentItem = galleryItems[selectedIndex];
  const totalItems = galleryItems.length;
  const hasGallery = totalItems > 0;

  // ==================== NAVEGAÇÃO ====================

  const goToNext = useCallback(() => {
    if (totalItems <= 1) return;
    setDirection(1);
    setSelectedIndex(prev => (prev + 1) % totalItems);
  }, [totalItems]);

  const goToPrevious = useCallback(() => {
    if (totalItems <= 1) return;
    setDirection(-1);
    setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const goToIndex = useCallback((index: number) => {
    if (index === selectedIndex) return;
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  }, [selectedIndex]);

  // ==================== KEYBOARD NAVIGATION ====================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navegação na galeria principal
      if (!showVideoModal && !showLightbox) {
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrevious();
      }

      // Fechar modais com ESC
      if (e.key === 'Escape') {
        if (showVideoModal) setShowVideoModal(false);
        if (showLightbox) setShowLightbox(false);
      }

      // Navegação no lightbox
      if (showLightbox) {
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showVideoModal, showLightbox, goToNext, goToPrevious]);

  // ==================== PRELOAD NEXT IMAGE ====================

  useEffect(() => {
    if (totalItems <= 1) return;

    const nextIndex = (selectedIndex + 1) % totalItems;
    const nextItem = galleryItems[nextIndex];

    if (nextItem?.type === 'image') {
      const img = new Image();
      img.src = getBestImageUrl(nextItem.data, 'gallery') || '';
    }
  }, [selectedIndex, galleryItems, totalItems]);

  // ==================== SWIPE HANDLERS ====================

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

  // ==================== VIDEO HANDLERS ====================

  const handlePlayVideo = (video: VideoMedia) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleImageClick = () => {
    if (currentItem?.type === 'image') {
      setShowLightbox(true);
    }
  };

  // ==================== ANIMATION VARIANTS ====================

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // ==================== RENDER HELPERS ====================

  const renderMainContent = () => {
    if (!hasGallery) {
      // Fallback para capa
      if (fallbackImage) {
        return (
          <LazyImage
            src={getBestImageUrl(fallbackImage, 'gallery') || ''}
            alt={productName}
            className="w-full h-full"
          />
        );
      }
      return <div className="text-neutral-600 text-6xl">🎮</div>;
    }

    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={selectedIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          drag={totalItems > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {currentItem.type === 'video' ? (
            // Thumbnail do vídeo com botão de play
            <div 
              className="w-full h-full relative cursor-pointer group"
              onClick={() => handlePlayVideo(currentItem.data)}
            >
              <LazyImage
                src={getBestVideoThumb(currentItem.data, 'large') || ''}
                alt={`Vídeo: ${currentItem.data.titulo}`}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-500/90 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={32} weight="fill" className="text-white ml-1" />
                </motion.div>
              </div>
              <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded text-sm text-neutral-200">
                {currentItem.data.titulo || 'Trailer'}
              </span>
            </div>
          ) : (
            // Imagem normal (screenshot ou artwork)
            <div 
              className="w-full h-full relative group cursor-zoom-in"
              onClick={handleImageClick}
            >
              <LazyImage
                src={getBestImageUrl(currentItem.data, 'gallery') || ''}
                alt={productName}
                className="w-full h-full"
              />
              {/* Zoom indicator */}
              <div className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <MagnifyingGlassPlus size={20} className="text-white" />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // ==================== RENDER ====================

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Gallery */}
      <div className="card-gaming overflow-hidden aspect-video flex items-center justify-center relative">
        {renderMainContent()}

        {/* Navigation Arrows */}
        {totalItems > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-10"
              aria-label="Anterior"
            >
              <CaretLeft size={24} weight="bold" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-10"
              aria-label="Próximo"
            >
              <CaretRight size={24} weight="bold" />
            </button>
          </>
        )}

        {/* Position Indicator */}
        {totalItems > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-sm text-white z-10">
            {selectedIndex + 1} / {totalItems}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {totalItems > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700">
          {galleryItems.map((item, index) => (
            <motion.button
              key={`${item.type}-${item.data.id}`}
              onClick={() => goToIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-24 h-14 rounded-lg border-2 overflow-hidden transition-colors relative ${
                selectedIndex === index 
                  ? 'border-primary-500 ring-2 ring-primary-500/30' 
                  : 'border-neutral-700 hover:border-neutral-500'
              }`}
            >
              {item.type === 'video' ? (
                <>
                  <LazyImage
                    src={getBestVideoThumb(item.data, 'small') || ''}
                    alt={item.data.titulo}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play size={18} weight="fill" className="text-white" />
                  </div>
                </>
              ) : (
                <LazyImage
                  src={getBestImageUrl(item.data, 'thumb') || ''}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Dot Indicators (for small galleries) */}
      {totalItems > 1 && totalItems <= 8 && (
        <div className="flex justify-center gap-2">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedIndex === index 
                  ? 'bg-primary-500 w-4' 
                  : 'bg-neutral-600 hover:bg-neutral-500'
              }`}
              aria-label={`Ir para item ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 p-2 text-neutral-400 hover:text-white transition-colors z-10"
              >
                <X size={32} />
              </button>
              
              <iframe
                src={selectedVideo.urls?.embed || `https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.titulo || 'Trailer'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && currentItem?.type === 'image' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setShowLightbox(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors z-20"
            >
              <X size={32} />
            </button>

            {/* Navigation in lightbox */}
            {totalItems > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-20"
                  aria-label="Anterior"
                >
                  <CaretLeft size={32} weight="bold" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors z-20"
                  aria-label="Próximo"
                >
                  <CaretRight size={32} weight="bold" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getBestImageUrl(currentItem.data, 'hero') || ''}
                alt={productName}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 rounded-full text-white z-20">
              {selectedIndex + 1} / {totalItems}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
