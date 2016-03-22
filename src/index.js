import connect from 'connect'
import serveStatic from 'serve-static'
import open from 'open'

export function start(dir, open = false) {
  const server = connect()

  server.use(serveStatic(config.build.outputDir))

  const host = config.server.host
  const port = config.server.port
  const uri = `http://${host}:${port}`

  return new Promise((resolve, reject) => {
    server.listen(port, host, (err) => {
      if (err) return reject(err)

      if (open) open(uri)

      resolve()
    })
  })
}
