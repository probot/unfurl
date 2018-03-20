const unfurl = require('..')
const {createRobot} = require('probot')
const payload = require('./fixtures/issue_comment.created')
const comment = require('./fixtures/api/comment')
const settings = require('./fixtures/api/settings')
const repo = require('fs').readFileSync('./test/fixtures/html/repo.html').toString()
const nock = require('nock')
const cacheManager = require('cache-manager')

nock.disableNetConnect()
nock.enableNetConnect(/127\.0\.0\.1/)

let cache
let app
let robot

beforeEach(() => {
  cache = cacheManager.caching({store: 'memory'})
  app = () => 'jwt'
  robot = createRobot({app, cache})
  unfurl(robot)

  nock('https://api.github.com')
    .post('/installations/13055/access_tokens').reply(200, {token: 'test'})
})

test('unfurls comments', async () => {
  nock('https://api.github.com')
    .get('/repos/robotland/test/issues/comments/336888903').reply(200, comment)
    .patch('/repos/robotland/test/issues/comments/336888903').reply(200)
  nock('https://api.github.com')
    .get('/repos/robotland/test/contents/.github/settings.yml').reply(200, settings)
    .patch('/repos/robotland/test/contents/.github/settings.yml').reply(200)
  nock('https://github.com')
    .get('/octokit/node-github')
    .reply(200, repo)

  await robot.receive({event: 'issue_comment', payload})
})
