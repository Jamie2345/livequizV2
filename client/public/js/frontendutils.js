function turnOnSpinner() {
  const spinner = document.querySelector('.spinner-container');
  spinner.style.display = 'flex';
}

function turnOffSpinner() {
  const spinner = document.querySelector('.spinner-container');
  spinner.style.display = 'none';
}

function decodeJson(jsonString) {
  const dummyElement = document.createElement('div');
  dummyElement.innerHTML = jsonString;
  
  // Retrieve the decoded content
  const decodedString = dummyElement.textContent;

  // Parse the JSON string
  const output = JSON.parse(decodedString);

  return output
}