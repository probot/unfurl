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

    if (config.maxUrl === null || config.maxUrl === undefined) {
      context.log('maxUrl in config file not set')
      // returning default of 10 links to unfurl
      return unfurl(context, comment.data.body_html, 10)
    } else {
      if (context.payload.sender.type !== 'Bot') {
        return unfurl(context, comment.data.body_html, config.maxUrl)
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

    if (context.payload.sender.type !== 'Bot') { // change this to name of your bot
      const config = await context.config('settings.yml')

      if (config.maxUrl === null || config.maxUrl === undefined) {
        context.log('maxUrl in config file not set')
        // returning default of 10 links to unfurl
        return commitunfurl(context, comment.data.body_html, 10)
      } else {
        return commitunfurl(context, comment.data.body_html, config.maxUrl)
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
    const config = await context.config('settings.yml')

    if (config.maxUrl === null || config.maxUrl === undefined) {
      context.log('maxUrl in config file not set')
      // returning default of 10 links to unfurl
      return unfurl(context, issue.data.body_html, 10)
    } else {
      if (context.payload.sender.type !== 'Bot') {
        return unfurl(context, issue.data.body_html, config.maxUrl)
      } else {
        context.log('bot will message once')
      }
    }
  })
  // for editing pull requests and isses

  robot.on(['issues.edited', 'pull_request.edited'], async context => {
    // Get the rendered HTML of the issue body from GitHub
    let issue = await context.github.issues.get(context.issue({
      headers: { accept: 'application/vnd.github.html+json' }
    }))
    const config = await context.config('settings.yml')

    if (config.maxUrl === null || config.maxUrl === undefined) {
      context.log('maxUrl in config file not set')
      // returning default of 10 links to unfurl
      if (context.payload.sender.type !== 'Bot') {
        return commitunfurl(context, issue.data.body_html, 10)
      } else {
        context.log('bot will message once')
      }
    } else {
      if (context.payload.sender.type !== 'Bot') {
        return commitunfurl(context, issue.data.body_html, config.maxUrl)
      } else {
        context.log('bot will message once')
      }
    }
  })
}
