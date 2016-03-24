import slasher from './slasher'

export default function () {
  return (req, res, next) => {
    if (
      req.url !== '/'
      && req.config.files.indexOf(req.url) === -1
    ) {
      res.statusCode = 404
      req.url = slasher(req.config.errorPage)
    }

    next()
  }
}
