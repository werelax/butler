import mm from 'micromatch'
import { convertToGlob, parseUrl } from '../utils/urlex'

export default function () {
  return (req, res, next) => {
    const { redirects } = req.config

    let routeMatched = false
    redirects.forEach((r) => {
      if (mm.isMatch(req.url, convertToGlob(r.from))) {
        const newUrl = parseUrl(req.url, r.from, r.to)

        redirect(res, newUrl, r.code)
        routeMatched = true

        return false
      }
    })

    if (!routeMatched) next()
  }
}

export function redirect(res, url, code = 301) {
  res.writeHead(code, {
    'Content-Type': 'text/plain',
    'Location': url,
  })

  res.end(`Redirecting to ${url}`)
}


//   obj.src = slasher(obj.src)
//   obj.dest = slasher(obj.dest)
//     const generatedUrl = urlex(req.url, obj.src, obj.dest)
//     redirect(res, generatedUrl, obj.code)
