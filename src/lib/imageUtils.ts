
// src/lib/imageUtils.ts

interface ResponsiveImageOptions {
  src: string;
  widths: number[];
  sizes: string;
  alt: string;
  quality?: number;
}

/**
 * Generates srcSet and sizes attributes for responsive images.
 * Also suggests WebP format if supported by the image optimization service.
 *
 * @param {string} src - The base URL of the image.
 * @param {number[]} widths - An array of desired image widths.
 * @param {string} sizes - The sizes attribute string (e.g., "(max-width: 768px) 100vw, 50vw").
 * @param {number} [quality=75] - The quality of the image (0-100).
 * @returns {{ srcSet: string; sizes: string; type: string }}
 */
export const getResponsiveImageProps = ({
  src,
  widths,
  sizes,
  quality = 75,
}: ResponsiveImageOptions) => {
  const generateSrc = (width: number, format: string = 'auto') => {
    // This is a placeholder. In a real application, you would use your image optimization service's API
    // to generate URLs with specific widths and formats (e.g., Cloudinary, Imgix, Next.js Image Optimization loader).
    // For Next.js default image optimization, you don't typically construct srcSet manually;
    // the <Image> component handles it based on `sizes` and `quality` props.
    // However, if you were using a custom loader or external service, it might look like this:
    // return `https://your-image-service.com/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}&fm=${format}`;
    
    // For demonstration, we'll just use the original src for different widths, 
    // but in a real scenario, these would be different optimized URLs.
    return `${src}?w=${width}&q=${quality}`;
  };

  const srcSet = widths
    .map((width) => `${generateSrc(width, 'auto')} ${width}w`)
    .join(', ');

  const webpSrcSet = widths
    .map((width) => `${generateSrc(width, 'webp')} ${width}w`)
    .join(', ');

  return {
    srcSet,
    webpSrcSet,
    sizes,
  };
};

/*
Example Usage in a component:

import Image from 'next/image';
import { getResponsiveImageProps } from '@/lib/imageUtils';

const MyComponent = () => {
  const imageUrl = 'https://example.com/my-image.jpg';
  const imageAlt = 'A descriptive alt text';

  const responsiveProps = getResponsiveImageProps({
    src: imageUrl,
    widths: [320, 640, 768, 1024, 1280],
    sizes: "(max-width: 768px) 100vw, 50vw",
    quality: 80,
  });

  return (
    <picture>
      <source srcSet={responsiveProps.webpSrcSet} type="image/webp" />
      <source srcSet={responsiveProps.srcSet} type="image/jpeg" />
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={1280} // Base width for Image component
        height={720} // Base height for Image component
        sizes={responsiveProps.sizes}
        // Next.js Image component automatically handles srcSet and WebP for optimized images
        // when `sizes` prop is provided and `unoptimized` is false in next.config.js.
        // The helper function above is more for custom image loaders or <picture> element usage.
      />
    </picture>
  );
};
*/
