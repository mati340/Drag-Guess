const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const hostname = '127.0.0.1';
const port = 8080;

const corsConfig = {
    credentials: true,
    origin: true,
};

var app = express();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://localhost:3000/');
    res.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.append('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors(corsConfig));
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: '*',
    }
  });
 
var waitingSockets = [];
var playingSockets = [];
var bestScore = 0;
var currScore = 0;
var currDifficulty;

const checkBestScore = (score) => {
    bestScore = Math.max(bestScore, score);
}

const calcScore = () => {
    if(currDifficulty === 'Easy') currScore+=1;
    else if(currDifficulty === 'Medium') currScore+=3;
    else if(currDifficulty === 'Hard') currScore+=5;

    checkBestScore(currScore);
}

io.on('connection', (socket) => {   
    if (socket.handshake.headers.origin === "http://localhost:3000") {
        socket.emit('bestScore', bestScore);
       
        socket.on('disconnect', () => {
            waitingSockets = waitingSockets.filter((savedSocket) => savedSocket != socket);             
            playingSockets = playingSockets.filter((savedSocket) => savedSocket != socket);  
            currScore = 0; 
        });

        socket.on('startPlay', () => {
            waitingSockets.push(socket);
            if(waitingSockets.length === 2){
                socket.emit('playStatus', 'play');
                waitingSockets[0].emit('playStatus', 'play');
                waitingSockets[0].emit('startGame', 'drawer');
                waitingSockets[1].emit('startGame', 'guesser');    
                playingSockets.push(waitingSockets[0]);        
                playingSockets.push(waitingSockets[1]);
                waitingSockets.splice(0,2);
            }
            else{
                socket.emit('playStatus', 'wait');
            }
        });

        socket.on('drawSubmit', (data) => {
            const secondPlayer = playingSockets.filter((savedSocket) => savedSocket != socket);
            if(secondPlayer.length !== 0)
                secondPlayer[0].emit('startGuess', {pickedWord: data.pickedWord, draw: data.draw});
            currDifficulty = data.pickedDifficulty;
        });

        socket.on('win', (data) => {
            // score session
            calcScore();
            playingSockets.forEach((savedSocket) => savedSocket.emit('win', currScore));
        });
    }
}); 

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});