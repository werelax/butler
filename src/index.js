import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import serve from 'serve-static'
import initConfig from './config'
import { enableHsr } from './utils/hsr'

import configMiddleware from './middleware/config'
import metaMidddleware from './middleware/meta'
import headersMiddleware from './middleware/headers'
import redirectsMiddleware from './middleware/redirects'
import cleanUrlsMiddleware from './middleware/clean-urls'
import sslMiddleware from './middleware/ssl'
import proxiesMiddleware from './middleware/proxies'
import routesMiddleware from './middleware/routes'
import notFoundMiddleware from './middleware/not-found'

module.exports = async function (userConfig, opts = {}) {
  const config = await initConfig(userConfig)

  const app = express()
  app.disable('x-powered-by')

  // TODO: handle leading/trailing slashes
  // TODO: come up with solution for favicons
  // TODO: allow multiple providers (fs, s3, etc.) with vinyl
  // TODO: allow custom cache headers on responses
  // TODO: correct configuration of cors
  // TODO: get ideas from npmjs.org/charge
  // TODO: implement browser-sync
  // TODO: implement analytics?

  /* middleware */
  app.use(compression())
  app.use(helmet())
  app.use(cors())

  /* custom middleware */
  app.use(configMiddleware(config))
  app.use(proxiesMiddleware())

  /* enable HSR */
  const hsr = opts.hsr ? await enableHsr(app) : null

  /* custom middleware */
  app.use(metaMidddleware())
  app.use(headersMiddleware())
  app.use(redirectsMiddleware())
  app.use(cleanUrlsMiddleware())
  app.use(sslMiddleware())
  app.use(routesMiddleware())
  /* serve files */
  app.use(serve(config.root))
  app.use(notFoundMiddleware())

  const uri = `http://${config.host}:${config.port}`
  await new Promise((resolve, reject) => {
    app.listen(config.port, config.host, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  const returnObj = { uri, config }
  if (hsr) returnObj.hsr = hsr

  return returnObj
}
