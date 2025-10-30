
import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  defaultTitle: 'My E-commerce Store',
  description: 'Discover a wide range of products at My E-commerce Store. Shop electronics, apparel, home goods, and books.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://www.example.com/',
    siteName: 'My E-commerce Store',
    images: [
      {
        url: 'https://www.example.com/og-image.jpg',
        width: 800,
        height: 600,
        alt: 'My E-commerce Store',
      },
    ],
  },
  twitter: {
    handle: '@my_ecommerce',
    site: '@my_ecommerce',
    cardType: 'summary_large_image',
  },
};

export default config;
