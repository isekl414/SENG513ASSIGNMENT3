// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    $('form').submit(function(){
	socket.emit('chat', $('#m').val());
	$('#m').val('');
	return false;
    });
    socket.on('chat', function(msg, name, color){
	$('#messages').append($('<li>').html(name.fontcolor(color)+msg));
    });
    socket.on('userlist', function(people){
      $('#users').empty();
        $('#users').append($('<h3>').text("Online Users"));
      for(p in people)
      {
        $('#users').append($('<li>').text(people[p]));
      }
    });
});
