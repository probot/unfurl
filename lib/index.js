const unfurl = require('./unfurl')

module.exports = (robot) => {
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
