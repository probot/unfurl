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
  },

  // Domains with partial metadata
  'http://philschatz.com/': {
    title: 'Phil\'s Musings · notes from a peripatetic programmer',
    title_link: 'http://philschatz.com/',
    thumb_url: '/public/favicon.ico'
  },

  'https://etsy.com/': {
    fallback: 'Find handmade, vintage, and unique goods that express who you are.',
    author_name: 'Etsy',
    title: 'Etsy.com | Shop for anything from creative people everywhere',
    title_link: 'https://etsy.com/',
    text: 'Find handmade, vintage, and unique goods that express who you are.',
    thumb_url: '/images/favicon.ico'
  },

  'https://archive.org/': {
    fallback: 'Internet Archive is a non-profit digital library offering free universal access to books, movies & music, as well as 321 billion archived web pages.',
    title: 'Internet Archive: Digital Library of Free Books, Movies, Music & Wayback Machine',
    title_link: 'https://archive.org/',
    text: 'Internet Archive is a non-profit digital library offering free universal access to books, movies & music, as well as 321 billion archived web pages.',
    thumb_url: 'https://archive.org/images/glogo.jpg'
  },

  'https://github.com/philschatz': {
    fallback: 'philschatz has 186 repositories available. Follow their code on GitHub.',
    author_name: 'GitHub',
    author_icon: 'https://assets-cdn.github.com/favicon.ico',
    title: 'philschatz (Philip Schatz)',
    title_link: 'https://github.com/philschatz',
    text: 'philschatz has 186 repositories available. Follow their code on GitHub.',
    thumb_url: 'https://avatars1.githubusercontent.com/u/253202?s=400&v=4'
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
