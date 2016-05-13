import prerender from 'prerender-node'

export default function () {
  return (req, res, next) => {
    const { prerenderToken } = req.config

    if (prerenderToken) {
      return prerender.set('prerenderToken', prerenderToken)(req, res, next)
    }

    next()
  }
}
