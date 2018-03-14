const { unfurlIssueComment, unfurlIssueBody, unfurlPRBody } = require('./checkUnfurl.js')

module.exports = (robot) => {
  robot.on(['issue_comment.created'], unfurlIssueComment)
  robot.on(['issues.opened'], unfurlIssueBody)
  robot.on(['pull_request.opened'], unfurlPRBody)
}
