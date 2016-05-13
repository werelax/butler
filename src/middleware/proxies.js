import url from 'url'
import httpProxy from 'http-proxy'
import mm from 'micromatch'
import { convertToGlob, parseUrl } from '../utils/urlex'

const proxyServer = httpProxy.createProxyServer({
  changeOrigin: true,
  toProxy: true,
})

export default function () {
  return (req, res, next) => {
    const { proxies } = req.config

    let routeMatched = false
    proxies.forEach((p) => {
      if (mm.isMatch(req.url, convertToGlob(p.src))) {
        routeMatched = true

        const newUrl = parseUrl(req.url, p.src, p.dest)
        const parsed = url.parse(newUrl)

        /* does this still mess crap up? */
        // delete req.headers['accept-encoding']

        req.url = parsed.path

        proxyServer.on('error', next)
        proxyServer.web(req, res, {
          target: `${parsed.protocol}//${parsed.host}`,
        }, next)
      }
    })

    if (!routeMatched) next()
  }
}
