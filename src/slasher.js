export function removeSlashes(url) {
  if (
    typeof url === 'object' ||
    url.indexOf('http') === 0
  ) {
    return url
  }

  if (url.charAt(0) !== '/') {
    return '/' + url
  }

  return url
}
