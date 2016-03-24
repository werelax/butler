import _ from 'lodash'
import fs from 'fs-extra'
import dn from 'denodeify'
import minimist from 'minimist'
import glob from 'glob'
import path from 'path'

export async function setupConfig(config, calledWithCli) {
  const argv = calledWithCli ? minimist(process.argv.slice(2)) : {}

  const files = await dn(fs.readdir)('.')
  const configFromFile = files.indexOf('zab.js') > -1
    ? require(`${process.cwd()}/zab.js`)
    : await dn(fs.readJson)('./zab.json')

  config = Object.assign({}, configFromFile, config)
  config.root = _.get(argv, '_[0]', config.root || process.cwd())
  config.host = process.env.HOST || argv.host || argv.h || config.host
  config.port = process.env.PORT || argv.port || argv.p || config.port
  config.cleanUrls = config.cleanUrls || true
  config.forceSSL = config.forceSSL || false
  config.errorPage = config.errorPage || '/_zab_/not-found.html'
  config.headers = config.headers || []
  config.redirects = config.redirects || []
  config.proxies = config.proxies || []
  config.routes = config.routes || []
  config.open = Boolean(argv.open || argv.o) || config.open
  config.quiet = Boolean(argv.quiet || argv.q) || config.quiet
  config.liveReload = Boolean(argv.live || argv.l) || config.liveReload
    || !calledWithCli

  const assetsDir = path.resolve(__dirname, '../assets')
  const assetFiles = await walkDir(assetsDir, '/_zab_')
  const userFiles = await walkDir(config.root)
  config.files = _.compact(assetFiles.concat(userFiles))

  return config
}

export function configMiddleware(config) {
  return (req, res, next) => {
    req.config = config
    next()
  }
}

export async function walkDir(dir, prepend = '') {
  const files = await dn(glob)(`${dir}/**/*`)
  const baseDir = files.length ? path.dirname(files[0]) : dir

  return files.map((file) => {
    const regex = new RegExp(`^${baseDir}(.*)`)

    if (path.extname(file)) {
      return prepend + file.replace(regex, '$1')
    }

    return null
  })
}
