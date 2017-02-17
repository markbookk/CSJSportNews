// Version 1.0
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var team = "";
var team1 = "";
var team2 = "";
var score = "";
var score1 = "";
var score2 = "";
var token = "";

var express = require('express');

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.sendfile('main.html');
  //res.sendfile('main.css');
});

app.get('/panel', function(req, res){
  res.sendfile('panel.html');
});


io.on('connection', function(socket){
  console.log('User connected.');

  //On user first connection...
  var msg2 = team1 + " - " + score1 + " \n" + team2 + " - " + score2;
  io.emit('welcome-live-score', { message: msg2});

  socket.on('chat message', function(msg){
    //Create string to a array.
    var gameInfo = msg.split(" ");

    //Validate string
    /*
    Array values:
    0 - token
    1 - sport/commands
    2 - team/parameters
    3 - score/parameters

    */

    //generateToken();
    if (gameInfo[0] == "gimeeToken") {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var string_size = 6;
    token = "";
    for( var i=0; i < string_size; i++ )
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log(token);
    //If you want token being sent to the panel. (Have in mind it will also be sent to normal live-score)
    io.emit('chat message', token);
    return; 
    }



    //validateToken();
    console.log(gameInfo[0]);
    console.log(token);
    if (gameInfo[0] != token) {
      msg = "Error: Give me token!";
      io.emit('chat message', msg);
      return;
    }

    if (gameInfo[1] == "setTeam") {
      setTeam(gameInfo[2], gameInfo[3]);
    }else {
      game = gameInfo[1];
      console.log("game: " + game);
      team = gameInfo[2];
      console.log("team: " + team);
      if (team == team1) {
          score1 = gameInfo[3];
        }else if(team == team2) {
          score2 = gameInfo[3];
        }else if (gameInfo[1] !="setTeam" || gameInfo[0] != "gimmeToken"){
          console.log('Error: Team name!');
          msg = "Error: Bad use of syntax!</br></br>Please do:</br>(token) (sport) (team name) (score)</br>Ex. yDrRFe Basketball CSJ 34";
          io.emit('chat message', msg);
          return;
        }
        score = gameInfo[3];
        console.log("score: " + score);
    }
    msg = team1 + " - " + score1 + " \n" + team2 + " - " + score2;
    io.emit('chat message', msg);
    console.log(msg);
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


// function validateToken() {

// }


// function assignTokenGame() {

// }



//TODO LIST!
/*
1. Arreglar lo de if () en el client-side para el token porque si no pueden hackearlo para poder conseguir ese token.

Future:
- Add a list of all commands, add to array in order to be useful to check if commands have been sent or if its a bad syntax.

*/

