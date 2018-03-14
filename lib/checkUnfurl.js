const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')

exports.unfurlIssueComment = async context => {
  // Get the rendered HTML of the comment from GitHub
  const comment = await context.github.issues.getComment(context.repo({
    id: context.payload.comment.id,
    headers: { accept: 'application/vnd.github.html+json' }
  }))

  // Find all the links
  const links = getLinks(comment.data.body_html)

  if (links.length > 0) {
    context.log(links, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  }
}

exports.unfurlIssueBody = async context => {
  // Get the rendered HTML of the issue body from GitHub
  let body = await context.github.issues.get(context.repo({
    number: context.payload.issue.number,
    headers: { accept: 'application/vnd.github.html+json' }
  }))
  body = body.data.body_html

  // Find all the links
  const links = getLinks(body)

  if (links.length > 0) {
    context.log(links, 'Unfurling links')

    // Unfurl them into attachments
    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')

    // Attaches unfurled links to the comment
    return attachments(context).add(unfurls)
  }
}
