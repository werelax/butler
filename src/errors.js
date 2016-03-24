export default function () {
  return (err, req, res, next) => {
    console.log(err)
    next()
  }
}
