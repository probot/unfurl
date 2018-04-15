const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')

module.exports = async function unfurl (context, html, configMax) {
  // Find all the links
  const links = getLinks(html)

  const newLinks = links.filter(function (item, position) {
    return links.indexOf(item) === position
  })
  // checks the number of links user want
  if (newLinks.length > 0 && newLinks.length <= configMax) {
    context.log(newLinks, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(newLinks.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')
    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  } else { // if not it pops out the extra links and don't unfurl it
    for (let i = newLinks.length - 1; i >= configMax; i--) {
      newLinks.pop()
    }

    const unfurls = await Promise.all(newLinks.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  }
}
