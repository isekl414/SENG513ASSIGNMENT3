var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var people = {};
var userNo = 0;

http.listen( port, function () {
    console.log('listening on port', port);
});


app.use(express.static(__dirname + '/public'));

//listen to 'chat' messages
io.on('connection', function(socket){
          var name = "user" + userNo;
          var color = "#000000";
          userNo++;
          people[socket.id] = name;
          io.emit('chat', " has connected to the server.",name, color);
          console.log("update", name + " has joined the server.")
          console.log("update-people", people);
          io.emit('userlist', people);

      socket.on('chat', function(msg){
        var nickchange = true;
        var msgArr = msg.split(' ')
        if (msgArr[0] == "/nick" && msgArr.length > 1)
        {
          for(p in people)
          {
            if (people[p] == msgArr[1])
              nickchange = false;
          }
          if (nickchange)
          {
          io.emit('chat', " changed their nickname to " + msgArr[1] , name, color)
          name = msgArr[1];
          people[socket.id] = name;
          io.emit('userlist', people);
          }
        }
        else if (msgArr[0] == "/nickcolor" && msgArr.length > 1) {
          color = msgArr[1];
        }
        else {
          io.emit('chat', ' '+new Date().toLocaleTimeString()+" : " + msg, name, color );
        }

       });

      socket.on("disconnect", function(){
          io.emit('chat'," has left the server.", name, color);
          console.log("update", name + " has left the server.");
          delete people[socket.id];
          console.log("update-people", people);
          io.emit('userlist', people);

      });


});
