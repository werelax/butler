import net from 'net'
import minimatch from 'minimatch'

export function getFreePort () {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(0, (err) => {
      if (err) return reject(err)

      const port = server.address().port
      server.close(() => resolve(port))
    })
  })
}

export function routeMatch (url, src, dest) {
  if (minimatch(url, src)) {
    return true
    // const generatedUrl = urlex(req.url, obj.src, obj.dest)
    // redirect(res, generatedUrl, obj.code)
    //
    // return false
  }

  return false
}
