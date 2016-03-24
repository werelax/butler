import prerender from 'prerender-node'

export default function () {
  return (req, res, next) => {
    if (req.config.prerenderToken) {
      prerender.set('prerenderToken', req.config.prerenderToken)(req, res, next)
    }
  }
}
