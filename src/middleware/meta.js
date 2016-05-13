export default function () {
  return (req, res, next) => {
    res.setHeader('Server', 'Zab')
    next()
  }
}
