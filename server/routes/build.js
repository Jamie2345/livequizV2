const express = require('express')
const router = express.Router()

const QuizBuilderController = require('../controllers/QuizBuilderController')

router.post('/make', QuizBuilderController.make)
router.put('/add', QuizBuilderController.add)
router.patch('/edit', QuizBuilderController.edit)

module.exports = router