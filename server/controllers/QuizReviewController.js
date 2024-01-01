const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

function calculate_avg_review(reviewsArray) {
  let totalReviews = 0;
  let totalStars = 0;

  for (let i = 0; i < reviewsArray.length; i++) {
    totalReviews += reviewsArray[i];
    totalStars += reviewsArray[i] * (i+1);
  }
  console.log(totalReviews, totalStars);
  console.log(totalStars / totalReviews);
  return (totalStars / totalReviews).toFixed(1);
}

// need to add a function to prevent same person leaving multiple reviews
const review = (req, res) => {
  const userReview = parseInt(req.body.review, 10);
  if (!isNaN(userReview) && userReview >= 1 && userReview <= 5) {
    
    Quiz.findOne({name: req.body.quizName})
    .then(quiz => {
      if (quiz) {
        const quiz_reviews = quiz.reviews;
        quiz_reviews[userReview-1] += 1
        const avg_review = calculate_avg_review(quiz_reviews);

        quiz.quiz_reviews = quiz_reviews;
        quiz.avg_review = avg_review;
        quiz.total_reviews++;
        quiz.save()

        .then(quiz => {
          res.json(quiz);
        })
        .catch(error => {
          console.error('Error saving quiz:', error);
          res.status(500).json({
            message: 'An error occurred while saving the quiz.'
          });
        });
      }
      else {
        res.json({
          message: 'Quiz with that name could not be found'
        })
        .catch(error => {
          res.json({
            message: 'An error occurred please try again later'
          });
        });
      }
    });
  }
  else {
    res.json({
      message: 'Please leave a review which is between the numbers 1 and 5'
    });
  }
};

module.exports = {review}