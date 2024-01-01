function displayQuestion(questionJson) {
  
  const mainContainer = document.querySelector('.main-container');

  const questionElement = document.createElement('h1');
  questionElement.innerHTML = questionJson.question;
  questionElement.className = 'questionText';

  const questionDiv = document.querySelector('.question-container');
  questionDiv.appendChild(questionElement);

  console.log('question json');
  console.log(questionJson);

  // update the questions remaining
  let questionNumberElement = document.getElementById('question-number');
  let totalQuestionsElement = document.getElementById('total-questions');

  questionNumberElement.innerHTML = questionJson.questionIndex+1;
  totalQuestionsElement.innerHTML = questionJson.quizLength;

  console.log(questionJson.question);
  console.log(questionElement);

  const multipleChoiceContainer = document.querySelector('.multiple-choice-container');
  multipleChoiceContainer.innerHTML = ''; // clear its html remove all old questions

  const playersSubmitted = document.getElementById('total-submitted');
  playersSubmitted.innerHTML = '0';

  questionJson.multipleChoice.forEach(choice => {
      const multipleChoiceAnswer = document.createElement('div');
      multipleChoiceAnswer.setAttribute('data-answer', choice);
      multipleChoiceAnswer.className = 'multiple-choice';

      const answerText = document.createElement('p');
      answerText.innerHTML = choice;

      multipleChoiceAnswer.appendChild(answerText);
      multipleChoiceContainer.appendChild(multipleChoiceAnswer);

      multipleChoiceAnswer.addEventListener("click", (e) => {
          // only allow one element to be clicked=true
          if (document.querySelector('[clicked="true"]') === null) {
              multipleChoiceAnswer.setAttribute('clicked', true);
              var userAnswer = answerText.innerHTML;
              socket.emit("userAnswer", userAnswer, CLIENT_ID, CLIENT_TOKEN);

              multipleChoiceContainer.style.display = 'none';
              
              var questionShown = document.querySelector('.questionText');
              if (questionShown) {
                  questionShown.style.display = 'none';
              }

              turnOnSpinner();
          }

      });
  })

  mainContainer.appendChild(multipleChoiceContainer);

}

function removeOldQuestion() {
  var oldQuestion = document.querySelector('.question-container');
  if (!oldQuestion) {
    return;
  }
  
  var oldMultipleChoiceContainer = document.querySelector('.multiple-choice-container');
  
  oldQuestion.innerHTML = '';
  oldMultipleChoiceContainer.innerHTML = '';
}

function displayAnswer(correctAnswer) {
  var questionShownElement = document.querySelector('.questionText');

  if (!questionShownElement) {
    return;
  }
  questionShownElement.style.display = 'block';  // style.display

  var multipleChoiceContainer = document.querySelector('.multiple-choice-container');
  multipleChoiceContainer.style.display = 'grid';

  var userAnswer = document.querySelector('[clicked="true"]');
  console.log(correctAnswer);
  var correctAnswerElement = document.querySelector(`[data-answer="${correctAnswer}"]`);
  console.log(correctAnswerElement);

  if (userAnswer && userAnswer.innerHTML !== correctAnswer) {
      userAnswer.style.backgroundColor = 'red';
  }
  
  correctAnswerElement.style.backgroundColor = 'green';

  // set all other options to a different colour
  var remainingChoices = multipleChoiceContainer.querySelectorAll('.multiple-choice:not([clicked="true"]):not([data-answer="' + correctAnswer + '"])');
  remainingChoices.forEach(function(choice) {
    choice.style.backgroundColor = 'var(--tertiary)'; // Set your desired color here
  });
}