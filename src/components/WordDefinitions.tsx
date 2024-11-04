import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WordDefinitionsProps {
  definitions: string[];
  variant?: 'default' | 'game-over';
}

export function WordDefinitions({ definitions, variant = 'default' }: WordDefinitionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < definitions.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  if (!definitions.length) return null;

  const bgClass = variant === 'game-over' 
    ? 'bg-red-50 dark:bg-red-500/10' 
    : 'bg-emerald-50 dark:bg-emerald-900/30';

  return (
    <div className={`relative rounded-lg ${bgClass} overflow-hidden`}>
      <div className="relative h-full min-h-[80px] px-4 py-3">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 px-4 py-3 flex items-center"
          >
            <p className={`text-sm ${
              variant === 'game-over' 
                ? 'text-red-600 dark:text-red-200/80' 
                : 'text-emerald-700 dark:text-emerald-100/80'
            }`}>
              {definitions[currentIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {definitions.length > 1 && (
        <>
          <div className="absolute left-0 top-0 bottom-0 flex items-center">
            <button
              onClick={() => paginate(-1)}
              disabled={currentIndex === 0}
              className={`p-2 m-1 rounded-full bg-white/80 dark:bg-black/20 shadow-sm ${
                currentIndex === 0 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-white dark:hover:bg-black/30'
              }`}
              aria-label="Previous definition"
            >
              <ChevronLeft className={`w-5 h-5 ${
                variant === 'game-over'
                  ? 'text-red-600 dark:text-red-200'
                  : 'text-emerald-700 dark:text-emerald-200'
              }`} />
            </button>
          </div>

          <div className="absolute right-0 top-0 bottom-0 flex items-center">
            <button
              onClick={() => paginate(1)}
              disabled={currentIndex === definitions.length - 1}
              className={`p-2 m-1 rounded-full bg-white/80 dark:bg-black/20 shadow-sm ${
                currentIndex === definitions.length - 1 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-white dark:hover:bg-black/30'
              }`}
              aria-label="Next definition"
            >
              <ChevronRight className={`w-5 h-5 ${
                variant === 'game-over'
                  ? 'text-red-600 dark:text-red-200'
                  : 'text-emerald-700 dark:text-emerald-200'
              }`} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 p-2">
            {definitions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  variant === 'game-over'
                    ? index === currentIndex
                      ? 'bg-red-500 dark:bg-red-400'
                      : 'bg-red-200 dark:bg-red-800'
                    : index === currentIndex
                      ? 'bg-emerald-500 dark:bg-emerald-400'
                      : 'bg-emerald-200 dark:bg-emerald-800'
                }`}
                aria-label={`Go to definition ${index + 1} of ${definitions.length}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
