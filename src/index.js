import connect from 'connect'
import compression from 'compression'
import { getPort } from 'portfinder'
import dn from 'denodeify'
import open from 'open'
import { setConfig } from './config'
import urlParse from './url-parse'
import favicon from './favicon'
import headers from './headers'
import redirects from './redirects'
import proxies from './proxies'
import router from './router'
import serve from './serve'
import notFound from './not-found'

export default async function (config, options = {}) {
  try {
    const server = connect()

    /* custom middleware */
    server.use(setConfig(config))
    server.use(compression())
    server.use(urlParse())
    server.use(favicon())
    server.use(headers())
    server.use(redirects())
    server.use(proxies())
    server.use(router())
    server.use(serve(config.build.outputDir))
    server.use(notFound())
    server.use('/_zab_', serve())

    const openPort = await dn(getPort)()
    const port = config.server.port || openPort

    const host = config.server.host
    const uri = `http://${host}:${port}`

    return new Promise((resolve, reject) => {
      server.listen(port, host, (err) => {
        if (err) return reject(err)

        if (options.open) open(uri)
        resolve(uri)
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          return reject(`port ${port} is already in use`)
        }

        reject(err)
      })
    })
  } catch (err) {
    return Promise.reject(err)
  }
}
