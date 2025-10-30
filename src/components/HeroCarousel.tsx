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
      className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden" 
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
          <div className="absolute inset-0 bg-black bg-opacity-30 sm:bg-opacity-40 flex flex-col justify-center items-center text-white p-4 sm:p-6 md:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-4 drop-shadow-lg">
              {items[currentIndex].title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-6 px-4 max-w-2xl drop-shadow-lg">
              {items[currentIndex].description}
            </p>
            <a
              href={items[currentIndex].link}
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-2 px-4 sm:py-2.5 sm:px-6 md:py-3 md:px-8 rounded-full transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-sm sm:text-base md:text-lg shadow-lg"
              aria-label={`Shop now for ${items[currentIndex].title}`}
            >
              Shop Now
            </a>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicator dots */}
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-2 z-10" role="tablist">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              idx === currentIndex 
                ? 'bg-white w-6 sm:w-8' 
                : 'bg-white/50 hover:bg-white/75'
            } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
            aria-label={`Go to slide ${idx + 1}`}
            role="tab"
            aria-selected={idx === currentIndex}
          ></button>
        ))}
      </div>

      {/* Optional: Progress bar */}
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