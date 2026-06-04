import { Helmet } from 'react-helmet-async'
import { siteMetadata } from '../../content/site/metadata'

function SEO({
  title = siteMetadata.defaultTitle,
  description = siteMetadata.defaultDescription,
  path = '/',
  image = siteMetadata.defaultImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
}) {
  const pageUrl = `${siteMetadata.baseUrl}${path}`
  const fullTitle =
    title === siteMetadata.defaultTitle
      ? title
      : `${title} | ${siteMetadata.author}`

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteMetadata.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={`${siteMetadata.baseUrl}${image}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteMetadata.baseUrl}${image}`} />
      <meta name="twitter:creator" content={siteMetadata.twitterHandle} />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </Helmet>
  )
}

export default SEO
