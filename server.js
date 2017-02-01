var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var team;
var team1;
var team2;
var score;
var score1;
var score2;

app.get('/', function(req, res){
  res.sendfile('main.html');
  //res.sendfile('main.css');
});

app.get('/panel', function(req, res){
  res.sendfile('panel.html');
});



io.on('connection', function(socket){
  console.log('User connected.');
  socket.on('chat message', function(msg){
    var gameInfo = msg.split(" ");
    //console.log(gameInfo);

    if (gameInfo[0] == "setTeam()") {
      setTeam(gameInfo[1], gameInfo[2]);
    }else {
      game = gameInfo[0];
      console.log("game: " + game);
      team = gameInfo[1];
      console.log("team: " + team);
      if (team == team1) {
          score1 = gameInfo[2];
        }else if(team == team2) {
          score2 = gameInfo[2];
        }else {
          console.log("Error: Team name")
        }
        score = gameInfo[2];
        console.log("score: " + score);
    }

    io.emit('chat message', msg);
    console.log(team1 + " - " + score1 + " \n" + team2 + " - " + score2);
  });
  socket.on('disconnect', function() {
    console.log('User disconnected!');
  });
});


http.listen(3000, function(){
  console.log('Listening on port 3000...');
});


function setTeam(position, team) {
  if (position == "1") {
    team1 = team;
    return "team1";
  }
  if (position == "2") {
    team2 = team;
    return "team2";
  }
}