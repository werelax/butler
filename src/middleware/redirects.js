import mm from 'micromatch'
import { convertToGlob, parseUrl } from '../utils/urlex'

export default function () {
  return (req, res, next) => {
    const { redirects } = req.config

    let routeMatched = false
    redirects.forEach((r) => {
      if (mm.isMatch(req.url, convertToGlob(r.from))) {
        // TODO: make sure this works with absolute urls
        const newUrl = !r.to.match(/^http/)
          ? parseUrl(req.url, r.from, r.to)
          : r.to

        redirect(res, newUrl, r.type)
        routeMatched = true

        return false
      }
    })

    if (!routeMatched) next()
  }
}

export function redirect (res, url, code = 301) {
  res.writeHead(code, {
    'Content-Type': 'text/plain',
    'Location': url,
  })

  res.end(`Redirecting to ${url}`)
}
