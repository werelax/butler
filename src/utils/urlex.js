const urlSplitRegex = /[\/]|(?=\.)/g

export function convertToGlob (str) {
  return str.replace(/(:([^\/]+))/g, '*')
}

export function parsePlaceholders (url, src, dst) {
  const vars = src.match(/(:[^\/]+)/g) || []
  const srcSplit = src.split(urlSplitRegex)
  const urlSplit = url.split(urlSplitRegex)

  const data = {}
  vars.forEach((v) => {
    const indx = srcSplit.indexOf(v)
    data[v] = urlSplit[indx]
  })

  for (const i in data) {
    dst = dst.replace(`${i}`, data[i] || 'undefined')
  }

  return dst
}

export function parseUrl (url, src, dst) {
  const withPlaceholders = parsePlaceholders(url, src, dst)

  /* parse splat */
  const match = src.match(/\*\*/)
  const indx = match ? match.index : 0
  const $1 = url.substring(indx)

  return withPlaceholders.replace('**', $1)
}
