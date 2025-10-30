
import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  defaultTitle: 'Shastik Fashions | Premium Sarees for Every Occasion',
  description: 'Shop beautiful Indian sarees online at Shastik Fashions. Explore silk, cotton, organza, and designer sarees with elegant weaves and patterns.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://www.example.com/',
    siteName: 'Shastik Fashions',
    images: [
      {
        url: 'https://www.example.com/og-image.jpg',
        width: 800,
        height: 600,
        alt: 'Shastik Fashions',
      },
    ],
  },
  twitter: {
    handle: '@shastikfashions',
    site: '@shastikfashions',
    cardType: 'summary_large_image',
  },
};

export default config;
