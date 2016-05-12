export default function () {
  return (req, res, next) => {
    const { headers } = req.config
    headers.forEach((h) => res.setHeader(h.name, h.value))

    next()
  }
}
