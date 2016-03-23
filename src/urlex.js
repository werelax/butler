import _ from 'lodash'

export default function (url, src, dest) {
  // TODO: figure out how to match base url as well as glob
  // ex. route /api** doesn't match /api

  let regexString = ''
  const globSplit = _.trim(src, '/').split(/[\/]|(?=\.)/)

  globSplit.forEach((val, index) => {
    /* if piece is single start */
    if (!val.match(/\*/)) regexString += val.replace(/\./g, '\\.')
    /* if piece is double star */
    else if (val.match(/\*\*/)) regexString += '(.*)'
    /* everything else */
    else regexString += '([^\\/]*)'

    /* if there are more parts of the uri that arent an extension */
    if (
      index < globSplit.length - 1 &&
      globSplit[index+1].charAt(0) !== '.'
    ) {
      regexString += '\\/'
    }
  })

  const regex = new RegExp(_.trim(regexString, '\\/'))
  let final = _.trim(url.replace(regex, dest), '/')

  if (final.indexOf('http') !== 0) {
    final = `/${final}`
  }

  return final
}
