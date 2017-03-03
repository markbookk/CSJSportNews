// Version 1.0
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');

var team = "";

var team1 = "";
var team2 = "";

var score1 = "";
var score2 = "";

var score1_1 = "";
var score2_1 = "";

var score1_2 = "";
var score2_2 = "";

var score1_3 = "";
var score2_3 = "";


var token = "";

var gameStringChecker = "";
var position = "";

var game = ""; //Se supone q sea la letra pequena del deporte

var team1_1 = "";
var team2_1 = "";

var team1_2 = "";
var team2_2 = "";

var team1_3 = "";
var team2_3 = "";

var game1 = team1_1 + " - " + score1_1 + " \n" + team2_1 + " - " + score2_1;
var game2 = team1_2 + " - " + score1_2 + " \n" + team2_2 + " - " + score2_2;
var game3 = team1_3 + " - " + score1_3 + " \n" + team2_3 + " - " + score2_3;

//Name of Sports
var sportNick_1 = "";
var sportNick_2 = "";
var sportNick_3 = "";

var sportName = "";
var sportName_1 = "";
var sportName_2 = "";
var sportName_3 = "";

var letterNick = "";

var usersAmount = 0;


app.get('/', function(req, res){
  res.sendfile('main.html');
  app.use(express.static(path.join(__dirname, '.')));
  //res.sendfile('main.css');
});

app.get('/panel', function(req, res){
  res.sendfile('panel.html');
});


io.on('connection', function(socket){
  usersAmount ++;
  console.log('User connected... Current users: ' + usersAmount);

  //On user first connection...
  var msg2 = team1 + " - " + score1 + " \n" + team2 + " - " + score2;
  io.emit('welcome-live-score', { message: msg2, sportName_1: sportName_1, sportName_2: sportName_2, sportName_3: sportName_3, sportScore_1: game1, sportScore_2: game2, sportScore_3: game3});

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
    if (gameInfo[0] != token) {
      msg = "Error: Give me token!";
      io.emit('chat message', msg);
      return;
    }

    if (gameInfo[2] == "setTeam") {
      setTeam(gameInfo[1], gameInfo[3], gameInfo[4]);
      //msg = "Team set succesfully!</br>Team: " + gameInfo[4] + "<br>Position: " + gameInfo[3];
    }else if (gameInfo[1] == "setSport") {} //if setSport pichea lo de setear el score y el team
    else { // Setting score for live scores
      game = gameInfo[1];
      team = gameInfo[2];
      //score = gameInfo[3];
      setScore(game, team, gameInfo[3]);
    }

    if (gameInfo[2] !="setTeam" && gameInfo[0] != "gimmeToken" && gameInfo[1] != "setSport"){
        console.log('Error: Team name!');
        msg = "Error: Bad use of syntax!</br></br>" + 
        "Usage:</br>" + 
        "(token) (sport initial) (team name) (score)</br>" + 
        "Ex. yDrRFe Basketball CSJ 34";
        io.emit('chat message', msg);
        return;
    }
    if (checkPos() == 1) msg = team1_1 + " - " + score1_1 + " \n" + team2_1 + " - " + score2_1;
    if (checkPos() == 2) msg = team1_2 + " - " + score1_2 + " \n" + team2_2 + " - " + score2_2;
    if (checkPos() == 3) msg = team1_3 + " - " + score1_3 + " \n" + team2_3 + " - " + score2_3;
    




    //setSportPosition
    var letterNick;
    if (gameInfo[1] == "setSport") {
      if (gameInfo[2] == "1") {
        sportName = gameInfo[3];
        letterNick = sportName.split("");
        sportNick_1 = letterNick[0].toLowerCase();
      }else if (gameInfo[2] == "2") {
        sportName = gameInfo[3];
        letterNick = sportName.split("");
        sportNick_2 = letterNick[0].toLowerCase();
      }else if (gameInfo[2] == "3") {
        sportName = gameInfo[3];
        letterNick = sportName.split("");
        sportNick_3 = letterNick[0].toLowerCase();
      }
    }


    //setSport()
    if (gameInfo[1] == "setSport" && gameInfo[2] == "1") {  //Normally you would be doing setTeam which in that case the sport string would be the lowercase first letter of the sport. The problem is when you are doing setSport, because it is a complete word instead so you check it again with lowercase first letter.
      io.emit('sport-name-1', { sport: sportName});
      sportName_1 = sportName;
    }else if(gameInfo[1] == "setSport" && gameInfo[2] == "2") {
      io.emit('sport-name-2', { sport: sportName});
      sportName_2 = sportName;
    }else if(gameInfo[1] == "setSport" && gameInfo[2] == "3") {
      io.emit('sport-name-3', { sport: sportName});
      sportName_3 = sportName;
    }


    //Check location where to put the score
    if (checkPos() == 1) {
      game1 = team1_1 + " - " + score1_1 + " \n" + team2_1 + " - " + score2_1;
      io.emit('sport-score-1', { message: game1});
    }
    else if (checkPos() == 2) {
      game2 = team1_2 + " - " + score1_2 + " \n" + team2_2 + " - " + score2_2;
      io.emit('sport-score-2', { message: game2});
    }
    else if (checkPos() == 3) {
      game3= team1_3 + " - " + score1_3 + " \n" + team2_3 + " - " + score2_3;
      io.emit('sport-score-3', { message: game3});
    }





    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    usersAmount --;
    console.log('User disconnected! Current users: ' + usersAmount);
  });
});


http.listen(3000, function(){
  console.log('Listening on port 3000...');
});

//whereAt refers to the sport
function setTeam(sport, position, team) {
  //Check first the sport via the nickname and then assign the team
  //per name etc
  game = sport;
  if (sport == sportNick_1) {
    if (position == "1") team1_1 = team;
    else if (position == "2") team2_1 = team;
  }
  else if (sport == sportNick_2) {
    if (position == "1") team1_2 = team;
    else if (position == "2") team2_2 = team;
  }
  else if (sport == sportNick_3) {
    if (position == "1") team1_3 = team;
    else if (position == "2") team2_3 = team;
  }
  else return;
}

function setScore(sport, team, score) {
  /*
  If the sport is one of the 3 established then:
  1. Check what position is the team (left/right)
  2. Assign the score to left/right team
  */
  if (checkPos() == 1) {
    if (team == team1_1) score1_1 = score;
    else if (team == team2_1) score2_1 = score;
  }else if (checkPos() == 2) {
    if (team == team1_2) score1_2 = score;
    else if (team == team2_2) score2_2 = score;
  }else if (checkPos() == 3) {
    if (team == team1_3) score1_3 = score;
    else if (team == team2_3) score2_3 = score;
  }
}

function checkPos() {
    if (game == sportNick_1) return 1;
    else if (game == sportNick_2) return 2;
    else if (game == sportNick_3) return 3;
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

