if (!process.env.NOCK_BACK_MODE) {
  // set to `record` or `dryrun` to allow HTTP requests
  process.env.NOCK_BACK_MODE = 'lockdown'
}

const path = require('path')
const nock = require('nock').back
const unfurlToAttachment = require('../lib/unfurl-to-attachment')

nock.fixtures = path.join(__dirname, '/fixtures/nock') // this only needs to be set once in your test helper

const urls = {
  'https://github.com/octokit/node-github': {
    fallback: 'node-github - node library to access the GitHub API',
    author_name: 'GitHub',
    author_icon: 'https://assets-cdn.github.com/favicon.ico',
    title: 'octokit/node-github',
    title_link: 'https://github.com/octokit/node-github',
    text: 'node-github - node library to access the GitHub API',
    thumb_url: 'https://avatars0.githubusercontent.com/u/3430433?s=400&v=4'
  },

  'https://www.npmjs.com/package/unfurl.js': {
    author_icon: 'https://www.npmjs.com/static/images/touch-icons/favicon-230x230.png',
    author_name: 'npm',
    fallback: 'Scraper for oEmbed, Twitter Cards and Open Graph metadata - fast and Promise-based',
    text: 'Scraper for oEmbed, Twitter Cards and Open Graph metadata - fast and Promise-based',
    thumb_url: 'https://www.npmjs.com/static/images/touch-icons/open-graph.png',
    title: 'unfurl.js',
    title_link: 'https://www.npmjs.com/package/unfurl.js'
  }
}

describe('unfurl-to-attachment', () => {
  Object.keys(urls).forEach(url => {
    test(url, (done) => {
      nock(url + '.json', async function (nockDone) {
        const result = await unfurlToAttachment(url)
        this.assertScopesFinished() // throws an exception if all nocks in fixture were not satisfied
        nockDone() // Record the fixture

        expect(result).toEqual(urls[url])

        done()
      })
    })
  })
})
