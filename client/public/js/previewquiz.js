let showingQuestions = false;

function toggleQuestions() {
  const quizInfo = document.querySelector('.quiz-preview-container');
  const questionsContainer = document.querySelector('.questions-container');

  // remove info page
  if (showingQuestions) {
    quizInfo.style.display = 'grid';
    questionsContainer.classList.add('hide');
  }
  else {
    quizInfo.style.display = 'none';
    questionsContainer.classList.remove('hide');
  }

  showingQuestions = !showingQuestions;
}

function loadQuestions(quizJson) {
  const questionsContainer = document.querySelector('.questions-container');
  const totalQuestionsElement = questionsContainer.querySelector('#total-questions');
  totalQuestionsElement.innerHTML = quizJson.questions.length;

  quizJson.questions.forEach(questionInfo => {
    const question = questionInfo.question;
    const answer = questionInfo.answer;
    const multipleChoice = questionInfo.multipleChoice;

    const questionHTML = `
    <div class="question-container">
      <div class="question-box">
        <h1 class="question-title">${question}</h1>
        <div class="multiple-choice-container">
          <div class="multiple-choice">
            <p>${multipleChoice[0]}</p>
          </div>
          <div class="multiple-choice">
            <p>${multipleChoice[1]}</p>
          </div>
          <div class="multiple-choice">
            <p>${multipleChoice[2]}</p>
          </div>
          <div class="multiple-choice">
            <p>${multipleChoice[3]}</p>
          </div>
        </div>
        <h2 class="question-answer">Answer: ${answer}</h2>
      </div>
    </div>`

    questionsContainer.innerHTML += questionHTML;
  });

  const questionBoxes = document.querySelectorAll('.question-box');
  const questionNumberElement = document.querySelector('#current-question-number');

  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is now visible on the screen
        const index = Array.from(questionBoxes).indexOf(entry.target);
        console.log(`Div at index ${index} is now visible.`);
        questionNumberElement.innerHTML = index + 1;
      }
    });
  };

  // Create an Intersection Observer
  const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
  questionBoxes.forEach(questionBox => {
    observer.observe(questionBox);
  });
}