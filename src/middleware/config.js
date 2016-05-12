export default function (config) {
  return (req, res, next) => {
    req.config = config
    next()
  }
}
