import httpProxy from 'http-proxy'
// import url from 'url'
// import minimatch from 'minimatch'
// import urlex from './urlex'
// import slasher from './slasher'
import { routeMatch } from '../utils/common'
import { error } from '../utils/emit'

const proxyServer = httpProxy.createProxyServer({
  changeOrigin: true,
  toProxy: true,
})

export default function () {
  return (req, res, next) => {
    const { proxies } = req.config

    for (const p of proxies) {
      const match = routeMatch(req.url, p.src)
      if (match) {
        // delete req.headers['accept-encoding']

        proxyServer.web(req, res, {
          target: p.dest,
        }, (err) => {
          if (err) error(err)
          // next()
        }).on('error', error)
      }
    }

    // next()

    // let matchFound = false
    // proxies.forEach((obj) => {
    //   obj.src = slasher(obj.src)
    //   obj.dest = slasher(obj.dest)
    //
    //   if (minimatch(req.url, obj.src)) {
    //     const generatedUrl = urlex(req.url, obj.src, obj.dest)
    //     const target = url.parse(generatedUrl)
    //
    //     req.url = target.path
    //
    //     /* delete encoding header because it messes things up */
    //     // delete req.headers['accept-encoding']
    //     /* add origin headers */
    //     obj.headers.forEach((header) => {
    //       req.headers[header.name] = header.value
    //     })
    //
    //     /* proxy request */
    //     proxy
    //       .on('error', (err) => (console.log(err) && next()))
    //       .web(req, res, {
    //         target: target.protocol + '//' + target.host
    //       }, (err) => {
    //         console.log(err)
    //         next()
    //       })
    //
    //     matchFound = true
    //     return false
    //   }
    // })
    //
    // if (!matchFound) next()
  }
}
