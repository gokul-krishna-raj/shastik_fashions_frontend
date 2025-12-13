
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  images: string[];
  altText: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  altText,
}) => {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-rose-50 border border-rose-100 flex items-center justify-center rounded-2xl">
        <span className="text-rose-300">No Images Available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full h-[320px] sm:h-[420px] bg-rose-50 border border-rose-100 rounded-2xl overflow-hidden mb-4 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={mainImage}
              alt={altText}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-1" role="group" aria-label="Product thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 cursor-pointer border-2 ${
              mainImage === image ? 'border-rose-500 ring-2 ring-rose-200' : 'border-transparent'
            } rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 transition-all`}
            onClick={() => setMainImage(image)}
            aria-label={`View image ${index + 1}`}
            aria-current={mainImage === image ? 'true' : 'false'}
          >
            <Image
              src={image}
              alt={`${altText} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
