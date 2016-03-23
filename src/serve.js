import serveStatic from 'serve-static'
import path from 'path'

export default function (dir) {
  return (req, res, next) => {
    dir = dir || path.resolve(__dirname, '../assets')
    serveStatic(dir)(req, res, next)
  }
}
