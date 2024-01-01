function turnOnSpinner() {
  const spinner = document.querySelector('.spinner-container');
  spinner.style.display = 'flex';
}

function turnOffSpinner() {
  const spinner = document.querySelector('.spinner-container');
  spinner.style.display = 'none';
}

function decodeJson(jsonString) {
  console.log('jsonstring')
  console.log(jsonString);
  const dummyElement = document.createElement('div');
  dummyElement.innerHTML = jsonString;
  
  // Retrieve the decoded content
  const decodedString = dummyElement.textContent;
  console.log(decodedString);
  console.log(decodedString);
  
  // Parse the JSON string
  const output = JSON.parse(decodedString);
  console.log(output);
  return output
}