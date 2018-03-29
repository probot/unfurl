const unfurl = require('unfurl.js')
const urlParser = require('url-parse')

module.exports = async function unfurlToAttachment (url) {
  const data = await unfurl(url)
  const parsedUrl = new urlParser(url)
  let baseUrl

  if (data.other && data.other.icon) {
    const parseIconUrl = new urlParser(data.other.icon)
    if (!parseIconUrl.host && !parseIconUrl.protocol) baseUrl = parsedUrl.protocol + '//' + parsedUrl.host
    else if (!parseIconUrl.protocol) baseUrl = parsedUrl.protocol + '//'
  }

  const description = (data.ogp && data.ogp.ogDescription) || (data.other && data.other.description)
  const authorName = data.ogp && data.ogp.ogSiteName
  const authorIcon = (baseUrl || '') + (data.other && data.other.icon)
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
