const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')
const getLinks = require('./get-links')
const template = require('../node_modules/probot-attachments/template.js')

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

    // Attachment unfurled links to the comment
    return attachments(context).add(unfurls)
  }
}

exports.unfurlIssueBody = async context => {
  let body = await context.github.issues.get(context.repo({
    number: context.payload.issue.number,
    headers: { accept: 'application/vnd.github.html+json' }
  }))
  body = body.data.body_html
  const links = getLinks(body)

  if (links.length > 0) {
    context.log(links, 'Unfurling links')

    const unfurls = await Promise.all(links.map(link => unfurlToAttachment(link)))

    context.log.trace(unfurls, 'Unfurled links')
    const rendered = [].concat(unfurls).map(attachment => template(attachment))
    body = context.payload.issue.body
    body += '\n\n' + rendered.join('\n')
    return context.github.issues.edit(context.repo({
      number: context.payload.issue.number,
      body: body
    }))
  }
}
