const unfurlToAttachment = require('./unfurl-to-attachment')
const unfurl = require('./unfurl')

module.exports = (robot) => {
  robot.on('content_reference.created', async context => {
    console.log('Content refrence created!', context.payload)
    const link = context.payload.content_reference.reference

    // Unfurl the link into an attachment
    const attachment = unfurlToAttachment(link)
    context.log.trace(attachment, 'Unfurled link')

    await context.github.request({
      method: 'POST',
      headers: { accept: 'application/vnd.github.corsair-preview+json' },
      url: `/content_references/${context.payload.content_reference.id}/attachments`,
      title: attachment.title,
      body: attachment.text
    })
  })

  robot.on(['issue_comment.created'], async context => {
    // Get the rendered HTML of the comment from GitHub
    const comment = await context.github.issues.getComment(context.repo({
      id: context.payload.comment.id,
      headers: { accept: 'application/vnd.github.html+json' }
    }))

    return unfurl(context, comment.data.body_html)
  })

  robot.on(['issues.opened', 'pull_request.opened'], async context => {
    // Get the rendered HTML of the issue body from GitHub
    let issue = await context.github.issues.get(context.issue({
      headers: { accept: 'application/vnd.github.html+json' }
    }))

    return unfurl(context, issue.data.body_html)
  })
}
