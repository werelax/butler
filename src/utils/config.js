import path from 'path'
import fs from 'fs-promise'
import minimist from 'minimist'
import { getFreePort } from './common'

export async function parseConfig (config = {}) {
  const argv = minimist(process.argv.slice(2))

  const configFile = path.resolve('zab.json')
  if (!await fs.exists(configFile)) throw new Error('cannot find zab.json')

  config = Object.assign({}, await fs.readJson(configFile), config)

  return {
    port: process.env.PORT || argv.port || argv.p || config.port || await getFreePort(),
    host: process.env.HOST || argv.host || argv.h || config.host || '0.0.0.0',
    open: argv.open || argv.o || false,

    root: argv._[0] || config.root || '.',
    cleanUrls: config.cleanUrls === false ? false : true,
    forceSSL: config.forceSSL === true ? true : false,
    headers: config.headers || [],
    redirects: config.redirects || [],
    proxies: config.proxies || [],
    routes: config.routes || [],
  }
}
