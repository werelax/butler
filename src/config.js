export function setConfig(config) {
  return (req, res, next) => {
    req.config = config
    next()
  }
}
