const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')

module.exports = async function unfurl (context, html) {
  // Find all the links
  const links = getLinks(html)

  if (links.length > 0) {
    context.log(links, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  }
}
