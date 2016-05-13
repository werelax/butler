import redirect from './redirects'

export default function () {
  return (req, res, next) => {
    const { forceSSL } = req.config

    if (forceSSL && !req.connection.encrypted) {
      const newUrl = `https://${req.headers.host}${req.url}`
      return redirect(res, newUrl)
    }

    next()
  }
}
