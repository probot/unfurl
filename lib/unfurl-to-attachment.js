const unfurl = require('unfurl.js')

module.exports = async function unfurlToAttachment (url) {
  const data = await unfurl(url)

  return {
    fallback: data.ogp.ogDescription,
    author_name: data.ogp.ogSiteName,
    author_icon: data.other.icon,
    title: data.ogp.ogTitle,
    title_link: data.ogp.ogUrl,
    text: data.ogp.ogDescription,
    thumb_url: data.ogp.ogImage[0].url
  }
}
