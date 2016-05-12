import path from 'path'
// import url from 'url'
// import minimatch from 'minimatch'
// import urlex from '../utils/urlex'
// import slasher from '../utils/slasher'
import { routeMatch } from '../utils/common'

export default function () {
  return (req, res, next) => {
    const { redirects, forceSSL, cleanUrls } = req.config

    if (req.url.match(/\/index(\.html)?$/)) {
      const newUrl = req.url.substring(0, req.url.lastIndexOf('/index'))
      return redirect(res, newUrl || '/')
    }

    if (forceSSL && !req.connection.encrypted) {
      const newUrl = `https://${req.headers.host}${req.url}`
      return redirect(res, newUrl)
    }

    if (cleanUrls && path.extname(req.url) === '.html') {
      const newUrl = req.url.replace(/\.html$/, '')
      return redirect(res, newUrl)
    }

    for (const r of redirects) {
      const match = routeMatch(req.url, r.from)
      if (match) return redirect(res, r.to)
    }

    next()

    //   obj.src = slasher(obj.src)
    //   obj.dest = slasher(obj.dest)
    //     const generatedUrl = urlex(req.url, obj.src, obj.dest)
    //     redirect(res, generatedUrl, obj.code)

  }
}

export function redirect(res, url, code = 301) {
  res.writeHead(code, {
    'Content-Type': 'text/plain',
    'Location': url,
  })

  res.end(`Redirecting to ${url}`)
}
