import mm from 'micromatch'

export default function () {
  return (req, res, next) => {
    const { headers } = req.config

    headers.forEach((h) => {
      if (h.url && !mm.isMatch(req.url, h.url)) return
      res.setHeader(h.name, h.value)
    })

    next()
  }
}
