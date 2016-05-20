#!/usr/bin/env node

import server from '../'

if (process.env.NODE_ENV === 'development') {
  require('source-map-support').install()
}

server().then((res) => console.log('running at', res.uri))
