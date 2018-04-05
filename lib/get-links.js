const {JSDOM} = require('jsdom')

module.exports = html => {
  const links = []

  // Parse the HTML
  const frag = JSDOM.fragment(html)

  // Check if the content came from an email
  const isEmail = !!frag.querySelector('.email-fragment').length

  if (!isEmail) {
    // Find all the links
    frag.querySelectorAll('a').forEach(a => {
      // Only unfurl raw links. GitHub also adds a trailing `/`
      if (a.href === a.innerHTML || a.href === `${a.innerHTML}/`) {
        links.push(a.href)
      }
    })
  }
  return links
}
