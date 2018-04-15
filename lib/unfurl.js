const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')

module.exports = async function unfurl (context, html) {
  // Find all the links
  const links = getLinks(html)

  const newLinks = links.filter(function (item, position) {
    return links.indexOf(item) === position
  })

  if (newLinks.length > 0) {
    context.log(newLinks, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(newLinks.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  }
}
