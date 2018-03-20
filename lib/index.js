const unfurl = require('./unfurl')
const commitunfurl = require('./commitunfurl')
module.exports = (robot) => {
  robot.on(['issue_comment.created'], async context => {
    // Get the rendered HTML of the comment from GitHub
    const comment = await context.github.issues.getComment(context.repo({
      id: context.payload.comment.id,
      headers: { accept: 'application/vnd.github.html+json' }
    }))
    const config = await context.config('settings.yml')
    const configMax = config.maxUrl
    if (configMax === null || configMax === undefined) {
      context.log('maxUrl in config file not set')
    } else {
      if (context.payload.sender.login !== 'testingappprobot[bot]') {
        return unfurl(context, comment.data.body_html, configMax)
      } else {
        context.log('bot will message once')
      }
    }
  })
  // this will run when comment is edited
  robot.on(['issue_comment.edited'], async context => {
    const comment = await context.github.issues.getComment(context.repo({
      id: context.payload.comment.id,
      headers: { accept: 'application/vnd.github.html+json' }
    }))
    if (context.payload.sender.login !== 'testingappprobot[bot]') { // change this to name of your bot
      const config = await context.config('settings.yml')
      const configMax = config.maxUrl
      if (configMax === null || configMax === undefined) {
        context.log('maxUrl in config file not set')
      } else {
        return commitunfurl(context, comment.data.body_html, configMax)
      }
    } else {
      context.log('sorry bot cannot edit commit messages') // preventing looping of edit of comments
    }
  })

  robot.on(['issues.opened', 'pull_request.opened'], async context => {
    // Get the rendered HTML of the issue body from GitHub
    let issue = await context.github.issues.get(context.issue({
      headers: { accept: 'application/vnd.github.html+json' }
    }))

    return unfurl(context, issue.data.body_html)
  })
}
