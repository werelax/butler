import connect from 'connect'
import compression from 'compression'
import { getPort } from 'portfinder'
import dn from 'denodeify'
import open from 'open'
import chalk from 'chalk'
import { setupConfig, configMiddleware } from './config'
import urlParse from './url-parse'
import favicon from './favicon'
import headers from './headers'
import redirects from './redirects'
import proxies from './proxies'
import router from './router'
import serve from './serve'
import notFound from './not-found'

module.exports = async function (config = {}, useArgs = true) {
  try {
    config = await setupConfig(config, useArgs)
    const server = connect()

    /* custom middleware */
    server.use(configMiddleware(config))
    server.use(compression())
    server.use(urlParse())
    server.use(favicon())
    server.use(headers())
    server.use(redirects())
    server.use(proxies())
    server.use(router())
    server.use(notFound())
    server.use(serve(config.root))
    server.use('/_zab_', serve())

    const host = config.host || 'localhost'
    const port = config.port || await dn(getPort)()
    const uri = `http://${host}:${port}`

    return new Promise((resolve, reject) => {
      server.listen(port, host, (err) => {
        if (err) return reject(err)

        if (config.open) open(uri)
        if (!config.quiet) {
          console.log(chalk.dim(`=> serving at ${chalk.underline(uri)}`))
        }

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
