const getLinks = require('../lib/get-links')

describe('get-links', () => {
  test('returns href for raw links', () => {
    const links = getLinks(`
      <a href="https://github.com/">https://github.com/</a>
      <a href="https://probot.github.io/">https://probot.github.io/</a>
    `)

    expect(links).toEqual(['https://github.com/', 'https://probot.github.io/'])
  })

  test('ignores links with custom anchor', () => {
    const links = getLinks(`
      <a href="https://etsy.com/">Lovingly hand crafted links</a>
    `)

    expect(links).toEqual([])
  })

  test('ignores links with email-fragment class at parent', () => {
    const links = getLinks(`
    <div class="email-fragment"><a href="https://etsy.com/">Lovingly hand crafted links</a></div>
    `)
    expect(links).toEqual([])
  })

  test('removes duplicate links', () => {
    const links = getLinks(`
      <a href="https://probot.github.io/">https://probot.github.io/</a>
      <a href="https://probot.github.io/">https://probot.github.io/</a>
    `)

    expect(links).toEqual(['https://probot.github.io/'])
  })
})
