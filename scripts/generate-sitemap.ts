import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.example.com';

// Mock data for products and categories
const mockProductSlugs = Array.from({ length: 10 }, (_, i) => `product-${i + 1}`);
const mockCategorySlugs = ['electronics', 'apparel', 'home-goods', 'books'];

async function generateSitemap() {
  const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static pages
  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/products',
    '/cart',
    '/wishlist',
    '/checkout',
    '/auth/login',
    '/auth/register',
  ];

  staticPages.forEach((staticPath) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}${staticPath}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `    <changefreq>monthly</changefreq>\n`;
    sitemap += `    <priority>0.7</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Add dynamic product pages
  mockProductSlugs.forEach((slug) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}/products/${slug}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.9</priority>\n`;
    sitemap += `  </url>\n`;
  });

  // Add dynamic category pages (if applicable, currently handled by products page with filters)
  // For now, we'll just add a generic category page if it existed as a separate route
  mockCategorySlugs.forEach((slug) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}/products?category=${slug}</loc>\n`;
    sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>0.8</priority>\n`;
    sitemap += `  </url>\n`;
  });

  sitemap += `</urlset>\n`;

  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('sitemap.xml generated successfully!');
}

generateSitemap();
