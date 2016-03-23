import url from 'url'
import path from 'path'

export default function () {
  return (req, res, next) => {
    const protocol = req.connection.encrypted ? 'https' : 'http'

    req.host = url.parse(protocol + '://' + req.headers.host + req.url)
    req.host = Object.assign({}, req.host, path.parse(req.host.pathname))

    /* replace query string */
    req.url = req.url.replace(req.host.search, '')

    next()
  }
}
