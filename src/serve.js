import fs from 'fs'
import dn from 'denodeify'
import path from 'path'
import serveStatic from 'serve-static'

export default function (dir) {
  return (req, res, next) => {
    let filename = dir + req.url
    if (filename.slice(-1) === '/') filename += 'index.html'

    if (path.extname(filename) === '.html') sendHtml(filename, req, res)
    else serveStatic(dir)(req, res, next)
  }
}

export async function sendHtml(filename, req, res) {
  const html = await dn(fs.readFile)(filename, 'utf8')

  res.setHeader('Content-Type', 'text/html')
  res.write(html)

  if (req.config.liveReload) {
    res.write(`
<script src="/socket.io/socket.io.js"></script>
<script src="/_zab_/live-reload.js"></script>
    `)
  }

  res.end()
}
