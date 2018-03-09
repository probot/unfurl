const unfurl = require('..')
const {createRobot} = require('probot')
const payload = require('./fixtures/issue_comment.created')
const comment = require('./fixtures/api/comment')
const repo = require('fs').readFileSync('./test/fixtures/html/repo.html').toString()

const nock = require('nock')
const cacheManager = require('cache-manager')

nock.disableNetConnect()
nock.enableNetConnect(/127\.0\.0\.1/)

test('it works', async () => {
  // FIXME: move this and app setup below to a test harness
  const cache = cacheManager.caching({store: 'memory'})

  const app = () => 'jwt'
  const robot = createRobot({app, cache})

  nock('https://api.github.com')
    .post('/installations/13055/access_tokens').reply(200, {token: 'test'})
    .get('/repos/robotland/test/issues/comments/336888903').reply(200, comment)
    .patch('/repos/robotland/test/issues/comments/336888903').reply(200)
  nock('https://github.com')
    .get('/octokit/node-github')
    .reply(200, repo)

  unfurl(robot)

  await robot.receive({event: 'issue_comment', payload})
})
