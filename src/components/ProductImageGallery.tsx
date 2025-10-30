
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
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No Images Available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
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
              layout="fill"
              objectFit="contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex space-x-2 overflow-x-auto pb-2" role="group" aria-label="Product thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative w-24 h-24 flex-shrink-0 cursor-pointer border-2 ${mainImage === image ? 'border-primary' : 'border-transparent'
              } rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            onClick={() => setMainImage(image)}
            aria-label={`View image ${index + 1}`}
            aria-current={mainImage === image ? "true" : "false"}
          >
            <Image
              src={image}
              alt={`${altText} thumbnail ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
