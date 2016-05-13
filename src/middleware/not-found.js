import path from 'path'
import serve from 'serve-static'
import { CONFIG } from '../config'

export default function () {
  return (req, res, next) => {
    res.statusCode = 404

    const assetsDir = path.resolve(__dirname, '../../assets')

    req.url = CONFIG.errorPage ? CONFIG.errorPage : '/not-found.html'
    serve(CONFIG.errorPage ? CONFIG.root : assetsDir)(req, res, next)
  }
}
