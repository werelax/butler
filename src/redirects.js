import url from 'url'
import minimatch from 'minimatch'
import urlex from './urlex'
import { removeSlashes } from './slasher'

export default function () {
  return (req, res, next) => {
    if (req.passthru) return next()

    const { redirects, forceSSL, cleanUrls } = req.config.server

    /* custom redirects */
    let matchFound = false
    redirects.forEach((obj) => {
      obj.src = removeSlashes(obj.src)
      obj.dest = removeSlashes(obj.dest)

      if (minimatch(req.url, obj.src)) {
        matchFound = true

        const generatedUrl = urlex(req.url, obj.src, obj.dest)
        redirect(res, generatedUrl, obj.code)

        return false
      }
    })

    /* force ssl */
    if (forceSSL && !req.connection.encrypted) {
      req.host.protocol = 'https:'
      return redirect(res, url.format(req.host))
    }

    /* redirect /index and /index.html */
    if (req.url.match(/\/index(\.html)?$/)) {
      const newUrl = req.url.substring(0, req.url.lastIndexOf('/index'))
      return redirect(res, newUrl || '/')
    }

    /* redirect html extension if cleanUrls is enabled */
    if (cleanUrls && req.host.ext === '.html') {
      const newUrl = url.format(req.host).replace(/\.html$/, '')
      return redirect(res, newUrl)
    }

    if (!matchFound) next()
  }
}

/**
 * send headers and body response for a page redirect
 */
function redirect(res, url, code) {
  res.writeHead(code || 301, {
    'Content-Type': 'text/plain',
    'Location': url,
  })

  res.end(`'Redirecting to ${url}`)
}
