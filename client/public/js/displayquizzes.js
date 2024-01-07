function displayQuizzes(quizzes) {
  console.log(quizzes);
  const resultsContainer = document.getElementById('quizzes-container');
  console.log('resultscontainer')
  console.log(resultsContainer);
  
  quizzes.forEach(quiz => {
    const searchResult = document.createElement('div');
    searchResult.className = 'quiz';

    const quizHTML = `
    <div class="quiz-info-container">
      <div class="main-details-container">
        <h2 class="quiz-title">${quiz.name}</h2>
        <div class="creator-container">
          <a href='/user/${quiz.creator}'><img src="/images/pfps/user.png" alt="" class="creator-img"></a>
          <h3 class="quiz-creator"><a href='/user/${quiz.creator}'>${quiz.creator}</a></h3>
        </div>
        <p class="description">${quiz.description}</p>
      </div>
      <div class="quiz-stats-container">
          <i class="stars-icon" style="--star-rating: ${quiz.avg_review};"></i>
          <div class="quiz-stats">
            <span class="quiz-views">Plays: ${quiz.plays}</span>
            <span class="quiz-reviews">Reviews: ${quiz.total_reviews}</span>
          </div>
      </div>
    </div>
`;

    searchResult.innerHTML += quizHTML;
    resultsContainer.appendChild(searchResult);

    // on click create the quiz room and join the room
    searchResult.addEventListener('click', () => {
      const encodedName = encodeURIComponent(quiz.name);
      
      window.location.href = `/quiz/${encodedName}`;
    })

  })
}