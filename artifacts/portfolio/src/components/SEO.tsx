import { Helmet } from 'react-helmet-async';
import data from '../data.json';

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
}

export default function SEO({ title, description, name, type }: SEOProps) {
  const seoTitle = title || `${data.meta.name} - Portfolio`;
  const seoDescription = description || data.meta.tagline;
  const seoName = name || data.meta.name;
  const seoType = type || 'website';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name='description' content={seoDescription} />

      {/* OpenGraph tags */}
      <meta property="og:type" content={seoType} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={seoName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
    </Helmet>
  );
}
