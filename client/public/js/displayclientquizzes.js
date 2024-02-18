let currentQuizEdit = null;

// handle closing the boxes
const popupCloseBtns = document.querySelectorAll('.popup-close');
const popupCancelBtns = document.querySelectorAll('.cancel-btn');
const popupBoxes = document.querySelectorAll('.pop-up');

function closeAllPopups() {
  popupBoxes.forEach(popupBox => {
    popupBox.classList.remove('active');
  });
}

popupCloseBtns.forEach(btn => {
  btn.addEventListener('click', closeAllPopups);
});

popupCancelBtns.forEach(btn => {
  btn.addEventListener('click', closeAllPopups);
});

function displayClientQuizzes(quizzes) {
  console.log(quizzes);
  const resultsContainer = document.getElementById('quizzes-container');

  // main code
  const descriptionPopup = document.getElementById('descriptionPopup')
  const descriptionInput = document.getElementById('edit-description-input');
  console.log(descriptionInput);

  const namePopup = document.getElementById('namePopup');
  const nameInput = document.getElementById('edit-name-input');


  console.log('resultscontainer')
  console.log(resultsContainer);
  
  quizzes.forEach(quiz => {
    const searchResult = document.createElement('div');
    searchResult.className = 'quiz';

    const editDescriptionBtn = document.createElement('button');
    editDescriptionBtn.className = 'edit-description-btn';
    editDescriptionBtn.innerHTML = '<i class="ri-pencil-fill"></i>';
    editDescriptionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(quiz)
      descriptionPopup.classList.add('active');
      descriptionInput.value = quiz.description;
      currentQuizEdit = quiz;
    });

    const editNameBtn = document.createElement('button');
    editNameBtn.className = 'edit-name-btn';
    editNameBtn.innerHTML = '<i class="ri-pencil-fill"></i>';
    editNameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(quiz)
      namePopup.classList.add('active');
      nameInput.value = quiz.name;
      currentQuizEdit = quiz;
    });
 
    const quizHTML = `
    <div class="quiz-info-container">
      <div class="main-details-container">
        <div class="title-container">
          <h2 class="quiz-title">${quiz.name}</h2>
        </div>
        <div class="creator-container">
          <a href='/user/${quiz.creator}'><img src="/images/pfps/user.png" alt="" class="creator-img"></a>
          <h3 class="quiz-creator"><a href='/user/${quiz.creator}'>${quiz.creator}</a></h3>
        </div>
        <div class="description-container">
          <p class="description">${quiz.description}</p>
        </div>
      </div>
      <div class="quiz-stats-container">
          <i class="stars-icon" style="--star-rating: ${quiz.avg_review};"></i>
          <div class="quiz-stats">
            <span class="quiz-views">Plays: ${quiz.plays}</span>
            <span class="quiz-reviews">Reviews: ${quiz.total_reviews}</span>
          </div>
      </div>
    </div>
    <a href="/quizbuilder/${quiz.name}/1"><button class="edit-questions-btn">Edit Questions</button></a>
`;

    searchResult.innerHTML += quizHTML;
    const descriptionContainer = searchResult.querySelector('.description-container');
    descriptionContainer.appendChild(editDescriptionBtn);

    const titleContainer = searchResult.querySelector('.title-container');
    titleContainer.appendChild(editNameBtn);

    resultsContainer.appendChild(searchResult);

    // on click create the quiz room and join the room
    searchResult.addEventListener('click', () => {
      const encodedName = encodeURIComponent(quiz.name);
      
      window.location.href = `/quiz/${encodedName}`;
    })

  })
}

function editDescription() {
  console.log(currentQuizEdit)
  const quizName = currentQuizEdit.name;

  const descriptionInput = document.getElementById('edit-description-input');
  const newDescription = descriptionInput.value;

  console.log(quizName);
  console.log(newDescription);

  const data = {
    name: quizName,
    description: newDescription
  };

  fetch('/api/edit', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include' // include cookies
  })
  .then(response => {
  if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
  })
  .then(data => {
      // Handle the response (e.g., get and use the access token)
      console.log('edit complete')
      console.log(data);
      // close the box
      closeAllPopups();

      // refresh the page
      window.location.reload();
  });
}

function editQuizName() {
  console.log(currentQuizEdit)
  const quizName = currentQuizEdit.name;

  const nameInput = document.getElementById('edit-name-input');
  const updatedName = nameInput.value;

  console.log(quizName)
  console.log(updatedName)

  const data = {
    name: quizName,
    updatedName: updatedName
  };

  fetch('/api/edit', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include' // include cookies
  })
  .then(response => {
  if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
  })
  .then(data => {
      // Handle the response (e.g., get and use the access token)
      console.log('edit complete')
      console.log(data);
      // close the box
      closeAllPopups();

      // refresh the page
      window.location.reload();
  });
}