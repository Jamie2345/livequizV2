function displayLeaderboard(players) {
  const questionsRemaining = document.querySelector('.questions-left-container');
  questionsRemaining.style.display = 'none';
  
  turnOffSpinner();
  removeTimerElement();
  console.log('leaderboard');
  console.log('leaderboarding function');
  removeOldQuestion();
  console.log('Players');
  console.log(players);
  console.log(players[0]);

  players.sort((a, b) => b.score - a.score);

  let top3Players = players.slice(0, 3);
  console.log(top3Players);

  const highestScore = top3Players[0].score;

  let mainBoardContainer = document.createElement('div');
  mainBoardContainer.className = 'leaderboard-main-container';

  document.body.appendChild(mainBoardContainer);

  // Create the bar container dynamically
  let boardContainer = document.createElement('div');
  boardContainer.className = 'leaderboard-container';

  // Get the body element and append the bar container
  mainBoardContainer.appendChild(boardContainer);

  function toOrdinal(number) {
      // Check if the number is between 11 and 13
      // If yes, use 'th' as the suffix
      if (number >= 11 && number <= 13) {
          return number + 'th';
      }

      // Otherwise, determine the suffix based on the last digit
      switch (number % 10) {
          case 1:
              return number + 'st';
          case 2:
              return number + 'nd';
          case 3:
              return number + 'rd';
          default:
              return number + 'th';
      }
  }

  // Loop through the sorted players and create bars using a for loop
  for (let i = 0; i < top3Players.length; i++) {
      const player = top3Players[i];

      // Calculate the bar height relative to the highest score
      let barHeight = (player.score / highestScore) * 100;

      // Create a bar element
      let boardPodium = document.createElement('div');
      boardPodium.className = 'leaderboard-podium';

      // Add class based on position for color
      if (i === 0) {
          boardPodium.classList.add('gold');
      } else if (i === 1) {
          boardPodium.classList.add('silver');
      } else if (i === 2) {
          boardPodium.classList.add('bronze');
      }

      boardPodium.style.setProperty('--target-height', barHeight + '%');

      // Create player leaderboard position
      let playerPosition = document.createElement('h2');
      playerPosition.innerHTML = `${toOrdinal(i + 1)} Place`;

      // Create a text element for the player's name
      let barText = document.createElement('h3');
      barText.innerHTML = player.name;

      // Create a bar to show
      let barBlock = document.createElement('div');
      barBlock.className = 'leaderboard-podium-bar';

      // Append the bar and text to the container
      boardPodium.appendChild(playerPosition);
      boardPodium.appendChild(barText);
      boardPodium.appendChild(barBlock);

      // Append the bars to the container
      if (i === 1 && players.length === 3) {
          // For the first player, insert before the first child
          boardContainer.insertBefore(boardPodium, boardContainer.firstChild);
      } else {
          boardContainer.appendChild(boardPodium);
      }
  }

  window.scrollTo(0, document.body.scrollHeight); // scroll down so the leaderboard is fully visible
};