const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')

module.exports = async function unfurl (context, html, configMax) {
  // Find all the links
  const links = getLinks(html)

  // checks the number of links user want
  if (links.length > 0 && links.length <= configMax) {
    context.log(links, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')
    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  } else { // if not it pops out the extra links and don't unfurl it
    for (let i = links.length - 1; i >= configMax; i--) {
      links.pop()
    }

    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  }
}
