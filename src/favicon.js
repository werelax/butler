export default function () {
  return (req, res, next) => {
    if (req.url.indexOf('/favicon.ico') === 0) {
      res.setHeader('Cache-Control', 'public, max-age=0, no-cache')
    }

    next()
  }
}
