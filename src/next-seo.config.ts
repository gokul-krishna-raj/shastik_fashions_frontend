
import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  defaultTitle: 'Shastik Fashions | Premium Sarees for Every Occasion',
  titleTemplate: '%s | Shastik Fashions',
  description: 'Shop beautiful Indian sarees online at Shastik Fashions. Explore silk, cotton, organza, and designer sarees with elegant weaves and patterns. Handpicked fabrics, authentic quality, and easy returns.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shastikfashions.com/',
    siteName: 'Shastik Fashions',
    images: [
      {
        url: process.env.NEXT_PUBLIC_OG_IMAGE_URL || '/Images/shastik_fahsion_logo_new.png',
        width: 1200,
        height: 630,
        alt: 'Shastik Fashions - Premium Indian Sarees',
      },
    ],
  },
  twitter: {
    handle: '@shastikfashions',
    site: '@shastikfashions',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#e11d48',
    },
    {
      name: 'keywords',
      content: 'sarees, indian sarees, silk sarees, cotton sarees, designer sarees, banarasi sarees, kanchipuram sarees, ethnic wear, traditional wear, online saree shopping',
    },
  ],
};

export default config;
