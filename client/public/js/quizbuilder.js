console.log("quizbuilder")

let clickedBox = null;
let multipleChoiceAnswers = {0: null, 1: null, 2: null, 3: null}
let editQuestion = false;


function buildPopup(boxIndex) {
    console.log('clicked')
    const popups = document.querySelectorAll(".pop-up");
    const popup = popups[boxIndex];
    popup.classList.add("active");
}

function closePopup() {
    const popups = document.querySelectorAll(".pop-up");
    popups.forEach(popup => {
        console.log(popup);
        popup.classList.remove("active");
    })
}

function cancelPopup(popupIndex) {
    const choiceInputs = document.querySelectorAll(".multiple-choice-input");
    const choiceInput = choiceInputs[popupIndex];
    choiceInput.value = "";
    closePopup();
    console.log("Cancelled popup");
}

function addAnswer(answerIndex) {
    const answerInputs = document.querySelectorAll(".multiple-choice-input");
    const answerValue = answerInputs[answerIndex].value;

    multipleChoiceAnswers[answerIndex] = answerValue;
    console.log(multipleChoiceAnswers)

    closePopup();
    updateAnswers(multipleChoiceAnswers);
    console.log(answerValue);

    console.log(multipleChoiceAnswers);
}

function updateAnswers(answers) {
    let i = 0;
    const multipleChoiceBoxes = document.querySelectorAll(".multiple-choice");
    multipleChoiceBoxes.forEach(multipleChoice => {
        const answer = answers[i];
        if (answer) {
            multipleChoice.innerHTML = answer;
            multipleChoice.classList.add("completed");
        }
        i++;
    })
}

function getNumberFromUrl(url) {
    // Use regular expression to find the number at the end of the URL
    var matches = url.match(/\/(\d+)$/);
    
    // If a match is found, return the number, otherwise return null
    if (matches && matches.length > 1) {
        return parseInt(matches[1], 10);
    } else {
        return null;
    }
}

function editQuizQuestion(QUIZ) {
    console.log('hi')
    console.log(QUIZ);
    console.log('editing quiz question')

    console.log(getNumberFromUrl(window.location.href))
    const questionIndex = getNumberFromUrl(window.location.href) - 1;
    QUIZ.questions[questionIndex].multipleChoice = [];

    console.log(multipleChoiceAnswers)
    
    const valuesArray = Object.values(multipleChoiceAnswers).filter(value => value !== undefined);

    const questionName = document.getElementById('question-input').value;
    const answerValue = document.getElementById('answer-input').value;

    console.log(valuesArray);
    QUIZ.questions[questionIndex] = {
        question: questionName,
        multipleChoice: valuesArray,
        answer: answerValue
    };
    if (!valuesArray.includes(answerValue)) {
        alert('Answer must be in one of the boxes');
    }
    else if (valuesArray.length == 4) {
        console.log(QUIZ.questions[questionIndex])
        
        const data = {
            name: QUIZ.name,
            description: QUIZ.description,
            updatedName: QUIZ.name,
            questions: QUIZ.questions
        };
        console.log('questions')
        console.log(data.questions);
    
        console.log(data);
        fetch('/api/edit', { // forgot that i needed to change localhost to be relative path instead once I was ready to push to a server / hosting (took a whole hour to find this error)
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
        });
    }
    else {
        alert('All the question boxes must be filled in');
    }

}

function deletePopup() {
    const popup = document.getElementById('delete-popup');
    console.log(popup);
    popup.classList.add('active');
}

function deleteQuestion(index, QUIZ) {
    console.log(index);

    const data = {
        index: index,
        name: QUIZ.name
    }

    fetch('/api/deleteQuestion', { // forgot that i needed to change localhost to be relative path instead once I was ready to push to a server / hosting (took a whole hour to find this error)
        method: 'DELETE',
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
        console.log(data)
        previousPage();  // go to the page before
    })

    closePopup();
}

function sumbitQuestion() {
    console.log(multipleChoiceAnswers);
    
    const answer = document.getElementById("answer-input").value;
    const question = document.getElementById("question-input").value;

    const multipleChoice = Object.values(multipleChoiceAnswers);

    var curentUrl = document.location.href;

    var parsedUrl = new URL(curentUrl);

    // Get the pathname from the parsed URL and decode it
    var decodedPathname = decodeURIComponent(parsedUrl.pathname);

    // Split the pathname by '/' and get the second-to-last part
    var pathComponents = decodedPathname.split('/');
    var quizName = pathComponents[pathComponents.length - 2];

    console.log(quizName);
    
    console.log(multipleChoice)
    console.log(question)
    console.log(answer)

    // Check if the answer is in the multipleChoice array
    if (!multipleChoice.includes(answer)) {
        // Alert the user if the answer is not in the array
        alert("Please make sure the correct answer is in one of the multiple-choice boxes.");
    } else {
        // Construct the request object
        const data = {
            name: quizName,
            question: {
                question: question,
                multipleChoice: multipleChoice,
                answer: answer,
            }
        };
        if (editQuestion) {
            editQuizQuestion(QUIZ);
            return;
        }
        console.log(data);

        // Send a POST request to your backend API
        fetch('/api/add', { // forgot that i needed to change localhost to be relative path instead once I was ready to push to a server / hosting (took a whole hour to find this error)
            method: 'PUT',
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
            console.log(data);
            console.log('question sent')
            console.log(window.location.href)
            function changeNumberInUrlAndRedirect(newNumber) {
                // Get the current URL
                var url = window.location.href;
            
                // Find the position of the last slash
                var lastSlashIndex = url.lastIndexOf('/');
            
                // Extract the portion of the URL before the number
                var baseUrl = url.substring(0, lastSlashIndex + 1);
            
                // Construct the new URL by concatenating the base URL and the new number
                var newUrl = baseUrl + newNumber;
            
                // Redirect to the new URL
                window.location.href = newUrl;
            }
            
            // Example usage:
            var newNumber = data.questions.length+1;
            console.log(newNumber);
            changeNumberInUrlAndRedirect(newNumber);
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function createQuiz(name) {
    // AJAX POST request to /join
    fetch('/api/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data as needed
        if (data.redirect) {
            window.location.href = data.redirect + `?code=${code}`; // Redirect to the URL received in the response
        } else if (data.message) {
            console.log(data.message);
        }
        else {
            console.log('Error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



function displayStoredQuestion(QUESTION) {
    editQuestion = true;
    const questionInput = document.getElementById('question-input');
    const answerBoxes = document.querySelectorAll('.multiple-choice');
    const answerInput = document.getElementById('answer-input');
    console.log(questionInput);
    if (QUESTION) {
        questionInput.value = QUESTION.question;
        answerInput.value = QUESTION.answer;

        let index = 0
        console.log(answerBoxes);
        answerBoxes.forEach(box => {
            box.innerHTML = QUESTION.multipleChoice[index];
            multipleChoiceAnswers[index] = QUESTION.multipleChoice[index];
            index++;
            console.log(multipleChoiceAnswers)
        })


    }
    console.log(multipleChoiceAnswers);
}
