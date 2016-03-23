import path from 'path'
import minimatch from 'minimatch'
import urlex from './urlex'
import { removeSlashes } from './slasher'

export default function () {
  return (req, res, next) => {
    if (req.passthru) return next()

    const { routes, cleanUrls } = req.config.server

    /* handle custom routes (not for assets) */
    if (!req.host.ext) {
      routes.forEach((obj) => {
        obj.dest = removeSlashes(obj.dest)
        obj.src = removeSlashes(obj.src)

        if (minimatch(req.url, obj.src)) {
          req.url = urlex(req.url, obj.src, obj.dest)
          return false
        }
      })
    }

    /* add html extension for clean urls */
    if (cleanUrls && !path.extname(req.url) && req.url.length > 1) {
      req.url += '.html'
    }

    next()
  }
}
