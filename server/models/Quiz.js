const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchema = require('./Question');

const quizSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    creator_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    topics: {
        type: Array,
        default: []
    },
    // add a creator and creator id and some user stuff later on like leaderboards ranking etc. users friends share quizes etc and much more.
    // add a study feature where people can make flashcards from their decks as well as just making them.
    questions: {
        type: [questionSchema]
    },
    reviews: {
        type: Array,
        default: [0, 0, 0, 0, 0]
    },
    avg_review: {
        type: Number,
        default: 0
    },
    total_reviews: {
        type: Number,
        default: 0
    },
    plays: {
        type: Number,
        default: 0
    }

}, {timestamps: true});

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz;