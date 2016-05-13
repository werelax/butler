import path from 'path'
import { redirect } from './redirects'

export default function () {
  return (req, res, next) => {
    const { cleanUrls } = req.config
    if (!cleanUrls) return next()

    /* redirect if index.html is in url */
    if (req.url.match(/\/index(\.html)?$/)) {
      const newUrl = req.url.substring(0, req.url.lastIndexOf('/index'))
      return redirect(res, newUrl || '/')
    }

    /* redirect if .html is in url */
    if (path.extname(req.url) === '.html') {
      const newUrl = req.url.replace(/\.html$/, '')
      return redirect(res, newUrl)
    }

    next()
  }
}
