function displayReviews(quiz) {
  const ratingProgressContainer = document.querySelector('.rating__progress');
  const ratingAverageContainer = document.querySelector('.rating__average');

  const totalReviews = quiz.total_reviews;

  const avgReviewPercent = (quiz.avg_review / 5) * 100;

  ratingAverageHTML = `
    <h1>${quiz.avg_review}</h1>
    <div class="star-outer">
      <div class="star-inner" style="width: ${avgReviewPercent}%"></div>
    </div>
    <p>${totalReviews}</p>
  `;

  ratingAverageContainer.innerHTML += ratingAverageHTML;

  // Create the horizontal bar chart of the stars and rating

  for (var i = quiz.reviews.length-1; i >= 0; i--) {
    const amountReviews = quiz.reviews[i];

    if (totalReviews == 0) {
      var elementWidth = 0;
    }
    else {
      var elementWidth = (amountReviews / totalReviews) * 100;
      console.log(elementWidth)
    }

    const reviewHTML = 
    `<div class="rating__progress-value">
      <p>${i+1} <span class="star">&#9733;</span></p>
      <div class="progress">
        <div class="bar" style="width: ${elementWidth}%"></div>
      </div>
      <p>${amountReviews}</p>
    </div>`
    
    ratingProgressContainer.innerHTML += reviewHTML;
  } 
}