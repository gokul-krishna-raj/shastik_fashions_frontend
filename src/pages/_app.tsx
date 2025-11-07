import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config'; // Import the SEO config
import MainLayout from '@/layouts/MainLayout';
import { StoreProvider } from '@/components/providers/StoreProvider';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <MainLayout>
        <DefaultSeo {...SEO} /> {/* Apply the imported SEO config */}
        <Component {...pageProps} />
      </MainLayout>
    </StoreProvider>
  );
}

export default MyApp;