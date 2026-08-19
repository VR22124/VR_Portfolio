import { Helmet } from 'react-helmet-async';
import meta from '../data/meta.json';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://vishnurohithb.dev';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export default function SEO({ title, description, path = '/' }: SEOProps) {
  const seoTitle = title || `${meta.name} | ${meta.role}`;
  const seoDescription = description || meta.tagline;
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
