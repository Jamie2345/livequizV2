const fs = require('fs');

function generateUniqueNumber(existingQuizzes) {
  let randomNumber;
  do {
      randomNumber = Math.floor(Math.random() * 900000) + 100000;
  } while (existingQuizzes[randomNumber]);

  return randomNumber;
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { generateUniqueNumber, checkFileExists };


