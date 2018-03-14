const { unfurlIssueComment, unfurlIssueBody } = require('./checkUnfurl.js')

module.exports = (robot) => {
  robot.on(['issue_comment.created'], unfurlIssueComment)
  robot.on(['issues.opened, pull_request.opened'], unfurlIssueBody)
}
