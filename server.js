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

var gameStringChecker = "";
var position = "";

var game = "";

//Name of Sports
var sportNick_1 = "";
var sportNick_2 = "";
var sportNick_3 = "";

var sportName = "";
var sportName_1 = "";
var sportName_2 = "";
var sportName_3 = "";

var letterNick = "";


app.get('/', function(req, res){
  res.sendfile('main.html');
  //res.sendfile('main.css');
});

app.get('/panel', function(req, res){
  res.sendfile('panel.html');
});

//  app.use(express.static(path.join(__dirname, 'styles')));

io.on('connection', function(socket){
  console.log('User connected.');

  //On user first connection...
  var msg2 = team1 + " - " + score1 + " \n" + team2 + " - " + score2;
  io.emit('welcome-live-score', { message: msg2, sportName_1: sportName_1, sportName_2: sportName_2, sportName_3: sportName_3});

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

    if (gameInfo[1] == "setTeam") {
      setTeam(gameInfo[3], gameInfo[4], gameInfo[2]);
      var locationSetTeam = gameInfo[2];
    }else {
      game = gameInfo[3];
      team = gameInfo[2];
      if (team == team1) {
          score1 = gameInfo[3];
      }else if(team == team2) {
          score2 = gameInfo[3];
      }else if (gameInfo[1] !="setTeam" && gameInfo[0] != "gimmeToken" && gameInfo[1] != "setSport"){
          console.log('Error: Team name!');
          msg = "Error: Bad use of syntax!</br></br>Please do:</br>(token) (sport) (team name) (score)</br>Ex. yDrRFe Basketball CSJ 34";
          io.emit('chat message', msg);
          return;
      }
      score = gameInfo[3];
      console.log("score: " + score);
    }

    msg = team1 + " - " + score1 + " \n" + team2 + " - " + score2;


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
    if (game == sportNick_1) {
      io.emit('sport-score-1', { message: msg});
    }
    else if (game == sportNick_2) {
      io.emit('sport-score-2', { message: msg});
    }
    else if (game == sportNick_3) {
      io.emit('sport-score-3', { message: msg});
    }





    io.emit('chat message', msg);
  });

  socket.on('disconnect', function() {
    console.log('User disconnected!');
  });
});


http.listen(3000, function(){
  console.log('Listening on port 3000...');
});

//whereAt refers to the sport
function setTeam(position, team, whereAt) {
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

