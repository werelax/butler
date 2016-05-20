import path from 'path'
import fs from 'fs-promise'
import _ from 'lodash'

export let CONFIG
const defaults = {
  root: 'dist',
  port: parseInt(process.env.PORT, 10) || 8000,
  host: process.env.HOST || '0.0.0.0',
  errorPage: false,
  cleanUrls: true,
  pushState: false,
  forceSSL: false,
  redirects: [],
  proxies: [],
  routes: [],
  headers: [],
}

export default async function (userConfig = {}) {
  const configFile = path.resolve('butler.config.js')
  const configFromFile = await fs.exists(configFile)
    ? require(configFile) : {}

  const config = _.defaultsDeep({}, userConfig, configFromFile, defaults)
  config.root = path.resolve(config.root)

  CONFIG = config
  return config
}
