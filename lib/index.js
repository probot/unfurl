const unfurlIssueComment = require('./check-unfurl-issue-comment')

module.exports = (robot) => {
  robot.on(['issue_comment.created'], unfurlIssueComment)

}
