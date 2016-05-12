// import compression from 'compression'
// import { getPort } from 'portfinder'
// import dn from 'denodeify'
// import { setupConfig, configMiddleware } from './config'
// import urlParse from './url-parse'
// import favicon from './favicon'
// import headers from './headers'
// import redirects from './redirects'
// import proxies from './proxies'
// import router from './router'
// import serve from './serve'
// import notFound from './not-found'
// import assets from './assets'
// import prerender from './prerender'
// import errors from './errors'

import connect from 'connect'
import serve from 'serve-static'
import open from 'open'
import chalk from 'chalk'
import { parseConfig } from './utils/config'
import { log, error } from './utils/emit'

import configMiddleware from './middleware/config'
import headers from './middleware/headers'
import redirects from './middleware/redirects'
import proxies from './middleware/proxies'
import router from './middleware/router'

module.exports = async function (conf = {}) {
  try {
    const config = await parseConfig(conf)
    const app = connect()

    // /* middleware */
    app.use(configMiddleware(config))
    // app.use(compression())
    // app.use(urlParse())
    // app.use(favicon())
    app.use(headers())
    app.use(redirects())
    app.use(proxies())
    app.use(router())
    // app.use(notFound())
    // app.use(prerender())
    // /* serve files */
    // app.use('/_zab_', assets())
    app.use(serve(config.root))
    // app.use(errors())

    await app.listen(config.port, config.host)

    const uri = `http://${config.host}:${config.port}`
    if (config.open) open(uri)

    log('running at', chalk.underline(uri))
  } catch (err) {
    error(err.msg || err.message || err)
  }
}
