export default function () {
  return (req, res, next) => {
    if (req.passthru) return next()
    
    const { headers } = req.config.server

    headers.forEach((obj) => {
      res.setHeader(obj.name, obj.value)
    })

    next()
  }
}
