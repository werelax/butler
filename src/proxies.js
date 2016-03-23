import httpProxy from 'http-proxy'
import url from 'url'
import minimatch from 'minimatch'
import urlex from './urlex'
import { removeSlashes } from './slasher'

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  toProxy: true,
})

export default function () {
  return (req, res, next) => {
    if (req.passthru) return next()
    
    const { proxies } = req.config.server

    let matchFound = false
    proxies.forEach((obj) => {
      obj.src = removeSlashes(obj.src)
      obj.dest = removeSlashes(obj.dest)

      if (minimatch(req.url, obj.src)) {
        const generatedUrl = urlex(req.url, obj.src, obj.dest)
        const target = url.parse(generatedUrl)

        req.url = target.path

        /* delete encoding header because it messes things up */
        // delete req.headers['accept-encoding']
        /* add origin headers */
        obj.headers.forEach((header) => {
          req.headers[header.name] = header.value
        })

        /* proxy request */
        proxy
          .on('error', (err) => (console.log(err) && next()))
          .web(req, res, {
            target: target.protocol + '//' + target.host
          }, (err) => {
            console.log(`proxy error: "${target.host}" is not responding!`)
            next()
          })

        matchFound = true
        return false
      }
    })

    if (!matchFound) next()
  }
}
