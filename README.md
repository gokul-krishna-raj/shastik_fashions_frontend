## Lighthouse Checklist

To ensure optimal performance, accessibility, and SEO, regularly audit your application using Google Lighthouse. Here's a checklist of key areas to focus on:

### Performance
- [ ] **First Contentful Paint (FCP):** Aim for < 1.8s
- [ ] **Largest Contentful Paint (LCP):** Aim for < 2.5s
- [ ] **Speed Index:** Aim for < 3.4s
- [ ] **Cumulative Layout Shift (CLS):** Aim for < 0.1
- [ ] **Time to Interactive (TTI):** Aim for < 3.8s
- [ ] **Total Blocking Time (TBT):** Aim for < 200ms
- [ ] Optimize images (size, format, `next/image` usage).
- [ ] Eliminate render-blocking resources (CSS, JS).
- [ ] Minimize main-thread work.
- [ ] Reduce JavaScript execution time.
- [ ] Enable text compression.
- [ ] Preconnect to required origins (`_document.tsx`).

### Accessibility
- [ ] All images have `alt` attributes.
- [ ] Form elements have associated labels.
- [ ] Buttons and links have discernible text/aria-labels.
- [ ] Color contrast is sufficient.
- [ ] Page has a logical tab order.
- [ ] Headings are properly nested.
- [ ] ARIA attributes are used correctly for dynamic content and interactive elements.
- [ ] Skip-to-content link is present in the header.

### Best Practices
- [ ] Avoid deprecated APIs.
- [ ] Ensure HTTPS.
- [ ] Use `rel="noopener"` and `rel="noreferrer"` for external links.
- [ ] Avoid browser errors in the console.

### SEO
- [ ] Page has a `<title>` tag.
- [ ] Page has a meta description.
- [ ] Pages are crawlable by search engines.
- [ ] Canonical URLs are specified where appropriate.
- [ ] Structured data (JSON-LD) is implemented for products and other entities.
- [ ] `sitemap.xml` is generated and linked in `robots.txt`.
- [ ] `robots.txt` is correctly configured.