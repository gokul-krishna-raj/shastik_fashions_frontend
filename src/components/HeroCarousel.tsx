import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CarouselItem {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  description: string;
  link: string;
}

const mockCarouselItems: CarouselItem[] = [
  {
    id: '1',
    imageUrl: 'https://d1c96i8uprz2te.cloudfront.net/1920x600/filters:quality(10)/banners/BL3Ot8CHgAtA33o2FrdOeJ9t0coCvZ2BmicBKVKi.jpg',
    altText: 'Promotional banner for new collection',
    title: 'Discover Our New Collection',
    description: 'Explore the latest trends and styles.',
    link: '/products',
  },
  {
    id: '2',
    imageUrl: 'https://d1c96i8uprz2te.cloudfront.net/1920x600/filters:quality(10)/banners/618mKj3yNFEMoOXM7pfX7LqOetHpIlnnqSbM2GHZ.jpg',
    altText: 'Limited time offer',
    title: 'Limited Time Offer',
    description: 'Don\'t miss out on our special discounts!',
    link: '/products',
  },
  {
    id: '3',
    imageUrl: 'https://d1c96i8uprz2te.cloudfront.net/1920x600/filters:quality(10)/banners/UZtBt4qc8Jc77w8fIxbVDrWLy1LOWDhQXJfFKQPl.jpg',
    altText: 'Seasonal sale',
    title: 'Seasonal Sale Event',
    description: 'Up to 50% off on selected items.',
    link: '/products',
  },
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const items = mockCarouselItems;
  const autoSlideInterval = 5000; // 5 seconds

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, autoSlideInterval);

      return () => clearInterval(interval);
    }
  }, [isPaused, handleNext, autoSlideInterval]);

  return (
    <div 
      className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[440px] overflow-hidden rounded-none" 
      role="region" 
      aria-label="Hero Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          role="group"
          aria-roledescription="slide"
          aria-label={`${currentIndex + 1} of ${items.length}`}
        >
          <Image
            src={items[currentIndex].imageUrl}
            alt={items[currentIndex].altText}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/55 sm:via-black/45 flex flex-col justify-center items-center text-white px-4 sm:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold uppercase tracking-[0.2em] mb-4 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-amber-300 animate-ping" />
              Curated Saree Edit
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-4 drop-shadow-xl leading-tight">
              {items[currentIndex].title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 px-4 max-w-3xl drop-shadow-lg text-rose-50">
              {items[currentIndex].description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={items[currentIndex].link}
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm sm:text-base"
                aria-label={`Shop now for ${items[currentIndex].title}`}
              >
                Shop the edit
              </a>
              <a
                href="/categories"
                className="bg-white/90 text-rose-700 font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl text-sm sm:text-base"
              >
                Browse categories
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicator dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 flex justify-center space-x-2 z-10" role="tablist">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 sm:h-2.5 rounded-full transition-all ${
              idx === currentIndex 
                ? 'bg-white/90 w-7 sm:w-9 shadow-md' 
                : 'bg-white/60 hover:bg-white/80 w-3 sm:w-3.5'
            } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
            aria-label={`Go to slide ${idx + 1}`}
            role="tab"
            aria-selected={idx === currentIndex}
          ></button>
        ))}
      </div>

      {!isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            key={currentIndex}
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoSlideInterval / 1000, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;