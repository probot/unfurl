const unfurl = require('unfurl.js')

module.exports = async function unfurlToAttachment (url) {
  const data = await unfurl(url)

  const description = (data.ogp && data.ogp.ogDescription) || (data.other && data.other.description)
  const authorName = data.ogp && data.ogp.ogSiteName
  const authorIcon = data.other && data.other.icon
  const title = (data.ogp && data.ogp.ogTitle) || (data.other && data.other.title && data.other.title.trim())
  const titleLink = (data.ogp && data.ogp.ogUrl) || url
  const thumbUrl = (data.ogp && data.ogp.ogImage && data.ogp.ogImage[0] && data.ogp.ogImage[0].url) || (data.other && data.other.shortcutIcon)

  return {
    fallback: description,
    author_name: authorName,
    author_icon: authorIcon,
    title: title,
    title_link: titleLink,
    text: description,
    thumb_url: thumbUrl
  }
}
