const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')
module.exports = async function commitunfurl (context, html, configMax) {
  // Find all the links
  const links = getLinks(html)
  // If only one link is this this block runs

  if (links.length === 1 && links.length <= configMax) {
    context.log(links, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  } else if (links.length > 1 && links.length <= configMax) { // this block runs for more than 1 link
    // this will remove old links
    for (let i = 0; i <= links.length - 1; i++) {
      links.shift()
    }

    context.log(links, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  } else if (links.length > configMax) {
    await context.github.issues.createComment(context.issue({body: 'Sorry you can only unfurl maximum of ' + configMax + ' url'}))
    context.log('exceeded')
  }
}
