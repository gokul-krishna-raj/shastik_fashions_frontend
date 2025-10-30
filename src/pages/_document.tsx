import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/Images/shastik_fahsion_favicon.png" />
        {/* Preconnect to improve loading speed for critical resources */}
        <link rel="preconnect" href="https://via.placeholder.com" />
        <link rel="preconnect" href="http://localhost:5000" />
        {/* Add other critical origins as needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
