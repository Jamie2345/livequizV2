// script to send a post request to the server to build a new quiz
document.addEventListener('DOMContentLoaded', function() {
    const joinForm = document.getElementById('createForm');

    joinForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('quiz-name-input').value;
        createQuiz(name);
    });
});

function createQuiz(quizName) {
    // AJAX POST request to /join
    fetch('/api/make', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: quizName })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data as needed
        if (data) {
            console.log(data);
            if (data.name) {
                window.location.href = `/quizbuilder/${data.name}/1`;
                return;
            }
        }
        else {
            console.log('Error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}