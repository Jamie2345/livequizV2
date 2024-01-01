const express = require('express')
const router = express.Router()

const QuizReviewController = require('../controllers/QuizReviewController')

router.post('/review', QuizReviewController.review)

module.exports = router