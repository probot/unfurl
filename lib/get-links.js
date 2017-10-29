const {JSDOM} = require('jsdom')

module.exports = html => {
  const links = []

  // Parse the HTML
  const frag = JSDOM.fragment(html)

  // Find all the links
  frag.querySelectorAll('a').forEach(a => {
    // Only unfurl raw links
    if (a.href === a.innerHTML) {
      links.push(a.href)
    }
  })

  return links
}
