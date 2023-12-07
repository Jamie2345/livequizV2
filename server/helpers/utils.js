function generateUniqueNumber(existingQuizzes) {
  let randomNumber;
  do {
      randomNumber = Math.floor(Math.random() * 900000) + 100000;
  } while (existingQuizzes[randomNumber]);

  return randomNumber;
}

module.exports = { generateUniqueNumber };


