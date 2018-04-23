const unfurl = require('unfurl.js')
const UrlParser = require('url')
const { URL } = require('url')

module.exports = async function unfurlToAttachment (url) {
  const data = await unfurl(url)
  const parsedUrl = UrlParser.parse(url)
  let baseUrl, authorIcon

  if (data.other && data.other.icon) {
    const parseIconUrl = UrlParser.parse(data.other.icon)
    if (!parseIconUrl.protocol && !parseIconUrl.host) {
      baseUrl = parsedUrl.protocol + '//' + parsedUrl.host
    } else if (!parseIconUrl.protocol && parseIconUrl.host) {
      baseUrl = parsedUrl.protocol + '//'
    }
    authorIcon = new URL(data.other.icon, baseUrl).href
  }

  const description =
    (data.ogp && data.ogp.ogDescription) ||
    (data.other && data.other.description)
  const authorName = data.ogp && data.ogp.ogSiteName
  const title =
    (data.ogp && data.ogp.ogTitle) ||
    (data.other && data.other.title && data.other.title.trim())
  const titleLink = (data.ogp && data.ogp.ogUrl) || url
  const thumbUrl =
    (data.ogp &&
      data.ogp.ogImage &&
      data.ogp.ogImage[0] &&
      data.ogp.ogImage[0].url) ||
    (data.other && data.other.shortcutIcon)

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
