import { Helmet } from 'react-helmet-async';
import data from '../data.json';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://vishnurohithb.dev';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export default function SEO({ title, description, path = '/' }: SEOProps) {
  const seoTitle = title || `Vishnu Rohith B — Full-Stack Developer | Portfolio`;
  const seoDescription =
    description ||
    'Portfolio of Vishnu Rohith B, a full-stack developer based in Salem, Tamil Nadu, building scalable web applications, enterprise SaaS platforms, and AI-driven automation workflows.';
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta
        name="keywords"
        content="Vishnu Rohith B, Vishnu Rohith B portfolio, Vishnu Rohith B developer, full-stack developer, React developer, MERN stack"
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Vishnu Rohith B" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}
