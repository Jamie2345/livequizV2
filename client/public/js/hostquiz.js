function createQuizRoom(quiz) {
  // AJAX POST request to /join
  fetch('/create', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quizName: quiz.name })
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response data as needed
      if (data) {
        window.location.href = `/${data.uuid}?code=${data.code}`
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}