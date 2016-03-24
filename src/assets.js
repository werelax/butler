import path from 'path'
import serve from './serve'

export default function () {
  return (req, res, next) => {
    const assetsDir = path.resolve(__dirname, '../assets')
    req.url = req.url.replace(/^\/_zab_(.*)/, '$1')

    serve(assetsDir)(req, res, next)
  }
}
