export default function () {
  return (req, res, next) => {
    res.statusCode = 404

    const { errorPage } = req.config.server
    req.url = errorPage || '/_zab_/not-found.html'

    next()
  }
}
