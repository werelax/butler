import 'source-map-support/register'
import express from 'express'
import compression from 'compression'
import serve from 'serve-static'
import initConfig from './config'

import configMiddleware from './middleware/config'
import metaMidddleware from './middleware/meta'
import headersMiddleware from './middleware/headers'
import redirectsMiddleware from './middleware/redirects'
import cleanUrlsMiddleware from './middleware/clean-urls'
import sslMiddleware from './middleware/ssl'
import proxiesMiddleware from './middleware/proxies'
import routesMiddleware from './middleware/routes'
import notFoundMiddleware from './middleware/not-found'

module.exports = async function (userConfig) {
  const config = await initConfig(userConfig)

  const app = express()
  app.disable('x-powered-by')

  // TODO: handle leading/trailing slashes
  // TODO: come up with solution for favicons

  /* middleware */
  app.use(compression())
  app.use(configMiddleware(config))
  app.use(metaMidddleware())
  // app.use(urlParse())
  // app.use(favicon())
  app.use(headersMiddleware())
  app.use(redirectsMiddleware())
  app.use(cleanUrlsMiddleware())
  app.use(sslMiddleware())
  app.use(proxiesMiddleware())
  app.use(routesMiddleware())
  // app.use(prerender())
  // /* serve files */
  app.use(serve(config.root))
  app.use(notFoundMiddleware())
  // app.use(errors())

  const uri = `http://${config.host}:${config.port}`
  await new Promise((resolve, reject) => {
    app.listen(config.port, config.host, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  return uri
}
