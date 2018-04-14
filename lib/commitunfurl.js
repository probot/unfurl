const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')
const {JSDOM} = require('jsdom')
module.exports = async function commitunfurl (context, html) {
  // Find all the old links
  const Oldlinks = []
  // Parse the HTML
  const frag = JSDOM.fragment(context.payload.changes.body.from)
  // Find all the links and save then
  frag.querySelectorAll('a').forEach(a => {
    Oldlinks.push((a.href).toLowerCase())
  })

  const links = getLinks(html)

  if (links.length === Oldlinks.length) {
    context.log('Matched links so cannot unfurl anythings')
  } else {
    if (links.length === 1) {
      context.log(links, 'Unfurling links')

      // Unfurl them into attachments
      const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

      context.log.trace(unfurls, 'Unfurled links')

      // Attaches unfurled links to the comment
      return attachments(context).add(unfurls)
    } else if (links.length > 1) { // this block runs for more than 1 link
      // this will remove old links
      for (let i = 0; i < Oldlinks.length; i++) {
        links.shift()
      }

      context.log(links, 'Unfurling links')

      // Unfurl them into attachments
      const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

      context.log.trace(unfurls, 'Unfurled links')

      // Attaches unfurled links to the comment
      return attachments(context).add(unfurls)
    }
  }
}
