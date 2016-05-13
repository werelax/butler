import path from 'path'
import mm from 'micromatch'
import { convertToGlob, parseUrl } from '../utils/urlex'

export default function () {
  return (req, res, next) => {
    const { routes, cleanUrls, pushState } = req.config

    /* dont use custom routes if url is an asset */
    if (!path.extname(req.url)) {
      routes.forEach((r) => {
        if (mm.isMatch(req.url, convertToGlob(r.src))) {
          req.url = parseUrl(req.url, r.src, r.dest)
          return false
        }
      })
    }

    /* add .html extension for cleanUrl routing */
    if (cleanUrls && !path.extname(req.url) && req.url.length > 1) {
      req.url += '.html'
    }

    /* if pushState is enabled, route non-assets through index.html */
    if (
      pushState &&
      (!path.extname(req.url) || path.extname(req.url) === '.html')
    ) req.url = '/index.html'

    next()
  }
}
