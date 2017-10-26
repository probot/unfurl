const {JSDOM} = require('jsdom')
const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')

module.exports = (robot) => {
  robot.on(['issue_comment.created'], checkUnfurl)

  async function checkUnfurl (context) {
    // Get the rendered HTML of the comment from GitHub
    const comment = await context.github.issues.getComment(context.repo({
      id: context.payload.comment.id,
      headers: {accept: 'application/vnd.github.html+json'}
    }))

    // Parse the HTML
    const frag = JSDOM.fragment(comment.data.body_html)

    const links = []

    // Find all the links
    frag.querySelectorAll('a').forEach(a => {
      links.push(unfurlToAttachment(a.href))
    })

    // Add links as attachments
    return attachments(context).add(await Promise.all(links))
  }
}
