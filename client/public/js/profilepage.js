console.log('wap')
function displayUserInfo(user) {
  const usernameElement = document.getElementById('user-name');
  usernameElement.innerHTML = user.username;

  const friendsElement = document.getElementById('friends');
  friendsElement.innerHTML = user.friends.length;
}

function displayQuizzesInfo(quizzes) {
  const postsElement = document.getElementById('posts');
  postsElement.innerHTML = quizzes.length;

  const savesElement = document.getElementById('saves')
  
  let totalSaves = 0;
  for (let i = 0; i < quizzes.length; i++) {
    totalSaves += quizzes[i].saves;
  }

  savesElement.innerHTML = totalSaves.toString();

  // Initialize an array to store the sums for each rating
  const ratingSums = Array.from({ length: 5 }, () => 0);
  let totalReviews = 0;

  // Iterate through each quiz and update the sums
  quizzes.forEach((quiz) => {
    quiz.reviews.forEach((count, index) => {
      ratingSums[index] += count;
      totalReviews += count;
    });
  });

  let reviewTotal = 0;
  for (let i = 0; i < ratingSums.length; i++) {
    reviewTotal += ratingSums[i] * (i + 1);
  }

  const avgReview = (reviewTotal / totalReviews).toFixed(1);

  const averageReviewElement = document.getElementById('avg-review');	
  averageReviewElement.innerHTML = avgReview.toString();

  const starInnerElement = document.querySelector('.star-inner');
  starInnerElement.style.width = ((avgReview / 5) * 100) + '%';

  console.log('Average Reviews:', avgReview);

}