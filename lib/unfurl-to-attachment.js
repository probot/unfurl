const got = require('got')
const metascraper = require('metascraper')
const get = require('get-value')

const getValue = (data, values) => {
  const prop = values.find(value => get(data, value))
  return get(data, prop)
}

module.exports = async function unfurlToAttachment (targetUrl) {
  const {body: html, url} = await got(targetUrl)
  const metadata = await metascraper({html, url})

  return {
    fallback: getValue(metadata, ['description']),
    author_name: getValue(metadata, ['author', 'publisher']),
    author_icon: getValue(metadata, ['logo', 'image']),
    title: getValue(metadata, ['title']),
    title_link: getValue(metadata, ['url']),
    text: getValue(metadata, ['description']),
    thumb_url: getValue(metadata, ['image', 'logo'])
  }
}
