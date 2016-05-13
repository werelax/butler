import path from 'path'
import fs from 'fs-promise'
import _ from 'lodash'

export let CONFIG
const defaults = {
  port: 8000,
  host: '0.0.0.0',
  root: 'dist',
  errorPage: false,
  cleanUrls: true,
  pushState: false,
  forceSSL: false,
  headers: [],
  redirects: [],
  proxies: [],
  routes: [],
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
