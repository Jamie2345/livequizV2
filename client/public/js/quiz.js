const socket = io();

console.log('quiz')
let CLIENT_ID;
let CLIENT_TOKEN;

function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${cookieName}=`)) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null; // Cookie not found
}

let auth = getCookie('quizToken');  // try to get a quizToken if they have one if not one will be created when they connect to the quiz the quizToken is used to store thier user id in cache as well as to provide proof the user is the actual user to prevent people from being able to send fake requests using thier id 
socket.emit('connectQuiz', ROOM_ID, auth);

socket.on('connected', (quizToken, clientId, gameStarted) => {
    // set the cookie first
    const expirationTime = new Date(Date.now() + 3600000);
    document.cookie = `quizToken=${quizToken}; expires=${expirationTime.toUTCString()};`;

    CLIENT_ID = clientId;
    CLIENT_TOKEN = quizToken;
    
    function startGame() {
        const playersList = document.querySelector('.playerslist-container');
        playersList.remove();

        const waitingSign = document.querySelector('.waiting-room-title');
        waitingSign.remove();
    }

    // function to update the players list on waiting screen
    socket.on('updatePlayers', (updatedPlayers) => {
        console.log('game started')
        console.log(gameStarted)
        if (gameStarted) {
            console.log('game started please wait for next question before joining');
            var pleaseWaitMessage = document.createElement('h2');
            pleaseWaitMessage.innerHTML = 'You will join once the next question starts please wait';
            pleaseWaitMessage.className = 'please-wait-msg';
            document.body.appendChild(pleaseWaitMessage);
            startGame();
            return;
        }
    
        console.log('updatePlayers')
        console.log(updatedPlayers)
        const playersList = document.querySelector('.playerslist-container');
        playersList.innerHTML = '';
        for (let player of updatedPlayers) {
            if (!player.disconnected) {
                var playerContainer = document.createElement('div');
                playerContainer.className = 'player-container';
                var textElement = document.createElement('p');
            
                textElement.innerHTML = player.name;
                if (player.uuid == clientId) {
                    textElement.innerHTML += ' (You)';
                }
    
                var statusSpanElement = document.createElement('span');
                if (player.ready) {
                    statusSpanElement.innerHTML = ' (Ready)';
                    statusSpanElement.style.color = 'green';
                }
                else {
                    statusSpanElement.innerHTML = ' (Not Ready)';
                    statusSpanElement.style.color = 'red';
                }
    
                textElement.appendChild(statusSpanElement);
                playerContainer.appendChild(textElement);
                
                if (player.uuid == clientId) {
                    var readyButton = document.createElement('button');
                    readyButton.innerHTML = 'Toggle Ready';
                    readyButton.addEventListener('click', () => {
                        socket.emit('ready', clientId, quizToken);
                    });
                
                    playerContainer.appendChild(readyButton);
                }
    
                playersList.appendChild(playerContainer);
            }
        }
    });


    socket.on('startGame', () => {
        startGame();
    });

    socket.on('showQuestion', (questionJson) => {
        const pleaseWaitMessage = document.querySelector('.please-wait-msg');
        if (pleaseWaitMessage) {
            pleaseWaitMessage.remove();
        }
        const questionsRemaining = document.querySelector('.questions-left-container');
        questionsRemaining.style.display = 'flex';

        showTimerElement();

        console.log(questionJson);
        resetTimer();
        //showTimerElement();
        turnOffSpinner();
        removeOldQuestion();
        displayQuestion(questionJson);
        // Create a new div element
        const timerDiv = document.createElement('div');

        // Set the id attribute to "timer"
        timerDiv.id = 'timer';

        // Append the div to the body of the document
        document.body.appendChild(timerDiv);
        startTimer();
    });

    socket.on('showAnswer', (correctAnswer) => {  // actually don't need to send all the players answers if you just need to store the clicked on the client side
        turnOffSpinner();
        //hideTimerElement();
        displayAnswer(correctAnswer);
    });

    socket.on('displayLeaderboard', (players) => {
        displayLeaderboard(players);
    })
    
});