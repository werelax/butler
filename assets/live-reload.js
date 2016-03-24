(function () {
  var socket = io()

  socket.on('refresh', function() {
    window.location.reload()
  })
})()
