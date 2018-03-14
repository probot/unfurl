const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')

async function unfurl (context, html) {
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

exports.unfurlIssueComment = async context => {
  // Get the rendered HTML of the comment from GitHub
  const comment = await context.github.issues.getComment(context.repo({
    id: context.payload.comment.id,
    headers: { accept: 'application/vnd.github.html+json' }
  }))

  return unfurl(context, comment.data.body_html)
}

exports.unfurlIssueBody = async context => {
  // Get the rendered HTML of the issue body from GitHub
  let issue = await context.github.issues.get(context.issue({
    headers: { accept: 'application/vnd.github.html+json' }
  }))

  return unfurl(context, issue.data.body_html)
}
