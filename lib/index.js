const {JSDOM} = require('jsdom')
const unfurlToAttachment = require('./unfurl-to-attachment')
const attachments = require('probot-attachments')

module.exports = (robot) => {
  robot.on(['issue_comment.created'], checkUnfurl)

  async function checkUnfurl (context) {
    const comment = await context.github.issues.getComment(context.repo({
      id: context.payload.comment.id,
      headers: {accept: 'application/vnd.github.full+json'}
    }))

    robot.log('confused', comment.data.body_html)

    const frag = JSDOM.fragment(comment.data.body_html)

    const links = []

    frag.querySelectorAll('a').forEach(a => {
      links.push(unfurlToAttachment(a.href))
    })

    robot.log(await Promise.all(links), 'Attaching links')

    return attachments(context).add(await Promise.all(links))
  }
}
