# Butler

[![Build Status](https://travis-ci.org/zab/butler.svg?branch=master)](https://travis-ci.org/zab/butler)
[![Coverage Status](https://coveralls.io/repos/github/zab/butler/badge.svg?branch=master)](https://coveralls.io/github/zab/butler?branch=master)

A fully-featured static server for your sites and apps. Includes support for HTML5 pushState, redirects, custom routes, proxied routes, clean URLs, custom error pages, and more. Butler is the open-sourced version of what powers [Zab](http://zab.io) hosting.

<a name="get-started"></a>
## Get Started

```bash
$ npm install butler -g
  # or if using the module
$ npm install butler --save
```

Then go into your project folder, setup your config from the options below, and run
```bash
$ butler
```

You can also use programmatically by importing the module. This will return a promise, which resolves when the server starts, returning an object with the URI and the server config.
```javascript
import butler from 'butler'

butler().then((res) => {
  // res.uri
  // res.config
})
```

> You cannot currently use Butler as middleware in an existing server, but support is coming soon.

<a name="config"></a>
## Config

You can customize the behavior of Butler with a file called `butler.config.js` located in the root of your project. The file should export an object using CommonJS like the example below.

```javascript
module.exports = {
  root: 'dist',
  // ...
}
```

#### Options

- `root` The root folder of your compiled site (where your index.html lives) relative to the directory you run Butler from.

  > Type: `string`  
  > Default: `dist`

- `port` The port to serve your site on. This will be overridden by the *PORT* environment variable if it is set.

  > Type: `integer`  
  > Default: `8000`

- `host` The host to serve your site on. This will be overridden by the *HOST* environment variable if set.

  > Type: `string`  
  > Default: `0.0.0.0`

- `errorPage` Sets a custom 404 error page to use. Butler will serve a default 404 page if you don't specify one. File should be relative to your Butler config file.

  > Type: `string`  
  > Default: Butler 404 page

- `cleanUrls` Lets you drop `.html` from your URLs (`zab.io/about` instead of `zab.io/about.html`). When a URL with `.html` is requested, we will drop it automatically with a 301 redirect.

  > Type: `boolean`  
  > Default: `true`

- `pushState` A quick way to enable HTML5 pushState in your server. When enabled, all URLs that are not assets will fallback to `/index.html`. This is a shortcut to defining `/** => /index.html` in your routes.

  > Type: `boolean`  
  > Default: `false`

- `forceSSL` Forces your site to be accessed over https by redirecting to the secure version of your site. **Only enable this if you have a valid SSL certificate configured on your server!**

  > Type: `boolean`  
  > Default: `false`

- `redirects` You can specify certain URLs to be redirected to other locations, both internally and externally. This list is prioritized from top to bottom, and whichever route matches first will return. See [Redirects](#redirects) for more info.

  > Type: `array` of `objects`  
  > Default: `[]`

  - `from` URL to match
  - `to` URL to redirect to
  - `type` Redirect code to use. Defaults to `301`.

- `proxies` You can proxy any URL within your site to an external site, whether it's your API, blog, or a site full of kittens. This list is prioritized from top to bottom, and whichever route matches first will return. See [Proxies](#proxies) for more info.

  > Type: `array` of `objects`  
  > Default: `[]`

  - `src` URL to match
  - `dest` URL to proxy to
  - `headers` Array of [headers](#headers)

- `routes` You can specify custom routes for your site, without being limited to your file structure (such as using `aboutUs.html` for `zab.io/about`). This list is prioritized from top to bottom, and whichever route matches first will return. See [Routes](#routes) for more info.

  > Type: `array`  
  > Default: `[]`

  - `src` URL to match
  - `dest` File to use for route

- `headers` Allows you to set custom response headers on your site globally or for specific routes. A good use case for this would be adding a CORS configuration. See [Headers](#headers) for more info.

  > Type: `array`  
  > Default: `[]`

  - `name` Name of your header
  - `value` Value of your header
  - `url` Only apply header if URL matches this pattern

<a name="redirects"></a>
## Redirects

You can specify certain URLs to be redirected to other locations, both internally and externally. This list is prioritized from top to bottom, and whichever route matches first will return. Supports [segments](#segments) to carry over values from the original URL, as well as [splats](#splats) for wildcards. You can also redirect to external sites by using an absolute url.

```javascript
redirects: [
  { from: '/old/path', to: '/new/path' }, // basic redirect
  { from: '/old/path', to: '/new/path', type: 302 }, // setting redirect type
  { from: '/name/:firstName', to: '/path/:firstName' }, // using segments
  { from: '/google/**', to: 'https://www.google.com/#q=$1' }, // external sites
]
```

<a name="proxies"></a>
## Proxies

Proxies are a powerful feature in Butler. They allow you to mask outside URLs behind routes in your site. This is useful to solve issues with CORS, to mask the url of your APIs, and many other things. You can also send custom headers to the destination, following the same structure as [headers](#headers). This list is prioritized from top to bottom, and whichever route matches first will return. Supports [segments](#segments) to carry over values from the original URL, as well as [splats](#splats) for wildcards. We will automatically set the `Host` header to the host of the destination.

```javascript
proxies: [
  {
    src: '/api/**',
    dest: 'https://api.zab.io/**',
    headers: [
      { name: 'x-custom-header', value: 'kittens' },
    ],
  },
]
```

With the above example, going to `mysite.com/api/user/12345` will proxy the request to `https://api.zab.io/user/12345`. This is different than a redirect, because visitors will still see the original url with `mysite.com` in their address bar.

<a name="routes"></a>
## Routes

You can specify custom routes for your site, without being limited to your file structure (such as using `aboutUs.html` for `zab.io/about`). Supports [segments](#segments) to carry over values from the original URL, as well as [splats](#splats) for wildcards. This list is prioritized from top to bottom, and whichever route matches first will return. *Any URL with a file extension other than `.html` will simply bypass the router.*

```javascript
routes: [
  { src: '/about', dest: 'aboutUs.html' },
  { src: '/contact', dest: 'contact-page.html' },
]
```

<a name="headers"></a>
## Headers

Allows you to set custom response headers on your site globally or for specific routes. A good use case for this would be adding a CORS configuration.

```javascript
headers: [
  { name: 'Access-Control-Allow-Origin', value: '*' },
  { name: 'X-Special', value: 'Hi', url: '/special/**' }, // only for specific routes
]
```

<a name="segments"></a>
### Segments

Segments are a simple way of carrying over values from the old URL to the new URL. Any piece of your path preceded with `:` is treated as a segment, and will carry over. For example, if you define the redirect `/name/:firstName => /path/:firstName`, going to `yoursite.com/name/jason` will redirect to `yoursite.com/path/jason`.

<a name="splats"></a>
### Splats

Splats are a simple way of defining wildcards in your URLs. Putting `**` anywhere in your source will allow anything to be matched there. It will also replace whatever the splat covers in the new URL if you include `**` there as well. For example, if you define the redirect `/blog/** => https://medium.com/@jsonmaur/**`, going to `yoursite.com/blog/my-post` will redirect to `https://medium.com/@jsonmaur/my-post`.

<a name="license"></a>
## License

[MIT](LICENSE) © [Zab Labs](http://zab.io)

<br />
<p align="center">
  <a href="http://zab.io">
    <img src="http://cdn.zab.io/logo/icon-50.png" alt="Zab Logo" />
  </a>
</p>
