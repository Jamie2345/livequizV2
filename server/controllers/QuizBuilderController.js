const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

console.log(Quiz);


const make = (req, res) => {
  const userId = req.userInfo.id
  const username = req.userInfo.username
  const quizName = req.body.name
  const description = req.body.description
  const topics = req.body.topics
  const questions = req.body.questions

  console.log(userId, username, quizName)

  Quiz.findOne({name: req.body.name})
  .then(quiz => {
    if (quiz) {
      res.status(409)
      res.json({
        message: "Quiz name already in use"
      })
    }
    else {
      let newQuiz = new Quiz({
        name: quizName,
        creator: username,
        creator_id: userId,
        description: description,
        topics: topics,
        questions: questions
      })

      newQuiz.save()
      .then(newQuiz => {
        res.json(newQuiz)
      })
      .catch(error => {
        console.log(error)
        res.json({
          message: 'An error occurred please try again later'
        })
      })
    }
  })
};

const add = (req, res) => {
  const userId = req.userInfo.id
  const quizName = req.body.name

  console.log(userId)

  console.log(quizName)

  Quiz.findOne({$and: [{name: quizName}, {creator_id: userId}]})
  .then(foundQuiz => {
    if (foundQuiz) {

      foundQuiz.questions.push(req.body.question)
      foundQuiz.save()
      .then(saveQuiz => {
        console.log('Quiz saved')
        res.status(200).json(saveQuiz)
      })
      .catch(error => {
        res.json({
          message: 'An error occurred please try again later'
        })
      })
    }
    else {
      console.log('quiz not found')
      res.status(404).json({
        'message': 'A quiz with that name does not exist'
      })
    }
  })
};

const edit = (req, res) => {
  const userId = req.userInfo.id;
  const quizName = req.body.name;
  const description = req.body.description;
  const updatedName = req.body.updatedName;
  const questions = req.body.questions;

  // Check if the updatedName is already in use by another quiz
  Quiz.findOne({ $and: [{ name: updatedName }, { creator_id: { $ne: userId } }] })
    .then(existingQuiz => {
      if (existingQuiz) {
        return res.status(400).json({ error: 'Quiz name already in use by another user' });
      }

      // Proceed with updating the quiz
      Quiz.findOne({ $and: [{ name: quizName }, { creator_id: userId }] })
        .then(foundQuiz => {
          if (!foundQuiz) {
            return res.status(404).json({ error: 'Quiz not found' });
          }

          if (description) foundQuiz.description = description;
          if (updatedName) foundQuiz.name = updatedName;
          if (questions) foundQuiz.questions = questions;

          foundQuiz.save()
            .then(savedQuiz => {
              console.log('Quiz saved');
              res.status(200).json(savedQuiz);
            })
            .catch(error => {
              res.status(500).json({
                message: 'An error occurred, please try again later'
              });
            });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred, please try again later'
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred, please try again later'
      });
    });
};

const deleteQuiz = (req, res) => {
  const userId = req.userInfo.id
  const quizName = req.body.name

  console.log(userId)

  console.log(quizName)

  Quiz.findOneAndDelete({$and: [{name: quizName}, {creator_id: userId}]})
  .then(foundQuiz => {
    if (foundQuiz) {
      res.status(200).json(foundQuiz);
    }
    else {
      console.log('quiz not found')
      res.status(404).json({
        'message': 'A quiz with that name does not exist'
      })
    }
  })
};



module.exports = {
  make,
  add,
  edit,
  deleteQuiz
}