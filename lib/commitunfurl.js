const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')
const {JSDOM} = require('jsdom')
module.exports = async function commitunfurl (context, html, configMax) {
  // Find all the old links
  const Oldlinks = []
  // Parse the HTML
  const frag = JSDOM.fragment(context.payload.changes.body.from)
  // Find all the links and save then
  frag.querySelectorAll('a').forEach(a => {
    Oldlinks.push((a.href).toLowerCase())
  })

  const links = getLinks(html)

  const newLinks = links.filter(function (item, position) {
    return links.indexOf(item) === position
  })

  if (newLinks.length === Oldlinks.length) {
    context.log('Matched links so not unfurling again')
  } else {
    if (newLinks.length === 1 && newLinks.length <= configMax) {
      context.log(newLinks, 'Unfurling links')

      // Unfurl them into attachments
      const unfurls = await Promise.all(newLinks.map(link => unfurlToAttachment(link)))

      context.log.trace(unfurls, 'Unfurled links')

      // Attaches unfurled links to the comment
      return attachments(context).add(unfurls)
    } else if (newLinks.length > 1 && newLinks.length <= configMax) { // this block runs for more than 1 link
      // this will remove old links
      for (let i = 0; i < Oldlinks.length; i++) {
        newLinks.shift()
      }

      context.log(newLinks, 'Unfurling links')

      // Unfurl them into attachments
      const unfurls = await Promise.all(newLinks.map(link => unfurlToAttachment(link)))

      context.log.trace(unfurls, 'Unfurled links')

      // Attaches unfurled links to the comment
      return attachments(context).add(unfurls)
    } else if (newLinks.length > configMax) {
      context.log('exceeded')
    }
  }
}
