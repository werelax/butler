import connect from 'connect'
import compression from 'compression'
import { getPort } from 'portfinder'
import dn from 'denodeify'
import open from 'open'
import chalk from 'chalk'
import http from 'http'
import socketio from 'socket.io'
import { setupConfig, configMiddleware } from './config'
import urlParse from './url-parse'
import favicon from './favicon'
import headers from './headers'
import redirects from './redirects'
import proxies from './proxies'
import router from './router'
import serve from './serve'
import notFound from './not-found'
import assets from './assets'
import prerender from './prerender'
import errors from './errors'

let IO

export async function startServer(config = {}, calledWithCli = true) {
  try {
    config = await setupConfig(config, calledWithCli)
    const app = connect()
    const server = http.Server(app)

    /* middleware */
    app.use(configMiddleware(config))
    app.use(compression())
    app.use(urlParse())
    app.use(favicon())
    app.use(headers())
    app.use(redirects())
    app.use(proxies())
    app.use(router())
    app.use(notFound())
    app.use(prerender())
    /* serve files */
    app.use('/_zab_', assets())
    app.use(serve(config.root))
    app.use(errors())

    if (config.liveReload) {
      IO = socketio(server)
    }

    const host = config.host || 'localhost'
    const port = config.port || await dn(getPort)()
    const uri = `http://${host}:${port}`

    await server.listen(port, host)

    if (config.open) {
      open(uri)
    }

    if (!config.quiet) {
      console.log(chalk.dim(`=> serving at ${chalk.underline(uri)}`))
    }

    return uri
  } catch (err) {
    return Promise.reject(err)
  }
}

export function refreshPage() {
  if (IO) IO.emit('refresh')
}
