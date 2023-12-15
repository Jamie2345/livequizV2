const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId for ID conversion
const app = express();
const path = require('path');
const ejs = require('ejs');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidV4 } = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const port = 8080;

const dotenv = require('dotenv')
dotenv.config()


mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const quizSecret = process.env.QUIZ_AUTH_SECRET;

console.log(quizSecret)

const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to mongoose database'))

app.use(express.static(path.join(__dirname, '../client/public')));
app.set('view engine', 'ejs');

const server = http.createServer(app);
const io = socketIO(server);

const BuildRoute = require('./routes/build')
app.use('/api', BuildRoute)

const Quiz = require('./models/Quiz')

//const middleware = require('./middleware/middleware');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.set('views', path.join(__dirname, '../client/views'));

let quizzes = {};
const liveQuiz = require('./classes/livequiz');
const Player = require('./classes/player');

let userQuizCookies = {};

// your_main_file.js
const { generateUniqueNumber } = require('./helpers/utils'); // Adjust the path accordingly

const geoip = require('geoip-lite');

app.get('/', (req, res) => {
  res.render('index');
});

// join and start/create quizzes
app.post('/join', (req, res) => {
  console.log('join req');
  const code = parseInt(req.body.code);
  const quizId = Object.keys(quizzes).find(quizId => quizzes[quizId].joinCode === code);

  if (quizId) {
      res.json({ redirect: quizId });
  }
  else {
      res.json( { message: "Invalid Code"} )
  }
});

app.post('/create', (req, res) => {
  const quizName = req.body.quizName;

  try {
      Quiz.findOne({name: quizName})
      .then(foundQuiz => {
          if (foundQuiz) {
              var code = generateUniqueNumber(quizzes);
              var uuid = uuidV4();

              quizzes[uuid] = {
                  joinCode: code,
                  quizObj: new liveQuiz(foundQuiz),   // change this so instead of the db as parameter it is the entire quiz json
                  players: []
              };
 
              res.json({ code, uuid });
          }
          else {
              res.json({ message: 'A quiz with that name does not exists' });
          }
      });
  }
  catch (error) {
      console.error('Error checking object existence:', error);
      res.json({ message: 'Error checking object existence' }); // Handle any errors gracefully
  }
  
});

app.get('/:quiz', (req, res) => {
  const roomId = req.params.quiz;
  const codeToCheck = Number(req.query.code);

  if (quizzes[roomId] && quizzes[roomId].joinCode === codeToCheck) {
      console.log('quiz valid')
      res.render('quiz', { roomId: roomId, quizCode: codeToCheck })
  }
  else {
      res.render('invalid')
  }
});

io.on('connection', (socket) => {
  console.log('connection')
  function verifyUser(userId, token) {
    return userQuizCookies[userId] === token;
  }

  socket.on('connectQuiz', (roomId, token) => {
    console.log('token of user connected')
    console.log(token);
    console.log('socket obj')
    console.log(socket);
    var ipAddress = socket.handshake.address;
    console.log(`User ip address: ${ipAddress}`);
    if (ipAddress == '::1') {
      ipAddress = '92.40.184.89';
    }
    const geo = geoip.lookup(ipAddress);
    console.log(geo);

    //country: GB
    //region: ENG

    // try do country-region and look if theres a flag there
    // if not just do country

    let country = geo.country;
    let region = geo.region;
    let regionCode = `${country}-${region}`


    console.log(country, region);

    // https://github.com/hampusborgos/country-flags/tree/main/png100px
    // https://github.com/hampusborgos/country-flags/archive/refs/heads/main.zip
    console.log('getting userflag')

    if (!quizzes[roomId]) {
      return false;
    }

    const foundUserId = Object.keys(userQuizCookies).find(userId => userQuizCookies[userId] === token);
    const foundPlayer = quizzes[roomId].players.find(player => player.uuid === foundUserId);

    console.log(foundPlayer);
    let userId;

    socket.join(roomId);
    if (!foundPlayer) {
      console.log('New player joining')
      userId = uuidV4();
      console.log(country);

      const player = new Player(userId);
      console.log(`Player: ${player}`);
      // generate a new username for the user
      player.name = player.generateName(); 
      player.country = country;
      function updateUserFlag(flagCode) {
        const flagPath = `../client/public/images/flags/png100px/${flagCode.toLowerCase()}.png`;
        const absoluteFlagPath = path.resolve(__dirname, flagPath);
        console.log(absoluteFlagPath)
        fs.access(absoluteFlagPath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error(`Error checking file existence: ${err}`);
          }
          else {
            console.log(`File ${absoluteFlagPath} exists in the folder.`);
            if (player.flag === undefined) {
              let localFlag = `images/flags/png100px/${flagCode.toLowerCase()}.png`
              player.flag = localFlag;
              io.to(roomId).emit('updatePlayers', quizzes[roomId].players);
            }
          }
        });
      }
      updateUserFlag(regionCode);
      updateUserFlag(country);
      quizzes[roomId].players.push(player);

      
      // give the user a token
      const payload = {
        userId
      }
  
      const quizToken = jwt.sign(payload, quizSecret, { expiresIn: '1h' });
      userQuizCookies[userId] = quizToken;
      console.log('quiz')
      console.log(quizzes[roomId]);
      console.log(quizzes[roomId].quizObj.running)
      socket.emit('connected', quizToken, userId, quizzes[roomId].quizObj.running);
    }
    else {
      console.log('player reconnected')
      foundPlayer.disconnected = false;
      userId = foundUserId;
      socket.emit('connected', token, foundUserId, quizzes[roomId].quizObj.running);
    }

    io.to(roomId).emit('updatePlayers', quizzes[roomId].players);

    var quizObj = quizzes[roomId].quizObj;
    var players = quizzes[roomId].players;

    console.log('ALL PLAYERS: ')
    console.log(players);

    function findPlayerByUUID(uuid) {
      return players.find(player => player.uuid === uuid);
    }

    function quizGameLoop() {
      
      // call this function to play the quiz
      function showNextQuestion() {
        var questionToShow = quizObj.nextQuestion()
        console.log(questionToShow);
  
        io.to(roomId).emit('showQuestion', {questionIndex: quizObj.questionIndex, quizLength: quizObj.size, question: questionToShow.question, multipleChoice: questionToShow.multipleChoice});
        
        const submittedPlayersCount = players.filter(player => player.questionAnswer !== null).length;        
        socket.emit('incrementSubmitted', submittedPlayersCount, players.length);
      }

      function updateScores() {
        players.forEach(player => {
          if (player.questionAnswer === quizObj.currentQuestion.answer) {
            player.score += quizObj.ppq;
          }
        });
      }

      function showQuestionAnswer() {
          var correctAnswer = quizObj.currentQuestion.answer;
          console.log('correctAnswer');
          console.log(correctAnswer);
          io.to(roomId).emit('showAnswer', correctAnswer);
      }

      // function to make all players.questionAnswer be null before the next question is shown
      function setPlayersAnswersToNull() {
          players = players.map(player => {
              player.questionAnswer = null;
              return player;
          });
      }

      function checkIfAllPlayersAnswered() {
          return players.every(player => player.questionAnswer !== null);
      }

      if (quizObj.questionsLeft() > 0 && quizzes[roomId]) {
      
          setPlayersAnswersToNull();
          showNextQuestion();

          // show a question then after x seconds or if all players have answered show the answer
          let counter = 0;
          const timeBetweenIteration = 1000; // 1 second between each loop
          
          function simulateWhileLoop(duration) { 
              const numberOfIterations = duration / timeBetweenIteration; // how many loops will occur (one loop every 1000ms / 1s)

              // if all players answered or the loop has finished
              if (checkIfAllPlayersAnswered() || ((counter >= numberOfIterations))) {
                  updateScores();
                  showQuestionAnswer();
                  setTimeout(quizGameLoop, 5000); // display answer for 5s then go to next question
              }
              else {
                  counter ++;
                  setTimeout(() => {
                      simulateWhileLoop(duration);
                  }, timeBetweenIteration);
              }
              
          }
          
          simulateWhileLoop(15000);
          
      }
      else {
          console.log('quiz over');
          if (quizzes[roomId]) {
            io.to(roomId).emit('displayLeaderboard', players);
          }
      }
    }

    socket.on('ready', (user, token) => {
      if (!verifyUser(user, token)) {
        console.log('invalid user')
        return false;
      }
      
      // if the user is ensured to be the correct user then make them ready
      const foundPlayer = players.find(player => player.uuid === user);
      foundPlayer.toggleReady();
      
      io.to(roomId).emit('updatePlayers', players);  // broadcast a signal to all clients to update players
      
  
      // if all players have pressed the ready button send a signal to the room to start the game            
      const allPlayersReady = players.every(player => player.ready || player.disconnected);
      if (allPlayersReady) {
          io.to(roomId).emit('startGame');
          quizzes[roomId].quizObj.running = true;
          console.log('game started')
  
          // start the quiz
          quizGameLoop();
      }

    });

    socket.on('userAnswer', (answer, userID, token) => {

      console.log(`user token auth ${token}`)
      console.log(players)

      var playerFound = players.find(player => player.uuid === userID)
      console.log(userID, token)
      if (verifyUser(userID, token)) {
          if (playerFound) {
              if (playerFound.questionAnswer === null) {
                  playerFound.questionAnswer = answer;
              }
              console.log('player found')
              console.log(playerFound)
          }
          else {
              console.log("player doesn't exist");
          }
      }
      else {
          console.log("Invalid auth token");
      }

    });


    socket.on('disconnect', () => {
      console.log('disconnect code running');
      console.log(userId);
      if (quizzes[roomId] && typeof userId !== 'undefined') {
        var playerFound = findPlayerByUUID(userId);
        console.log('player disconnected')
        if (playerFound) {
          playerFound.disconnected = true;
          console.log('player disconnected')

          console.log(playerFound)
          io.to(roomId).emit('updatePlayers', players);
        }

        const allPlayersHaveDisconnected = players.every(player => player.disconnected === true);
        if (allPlayersHaveDisconnected) {
          console.log('all players have disconnected')
          delete quizzes[roomId];
        }
      }
    });

  });
  

});

server.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});