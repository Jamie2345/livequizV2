const express = require('express')
const router = express.Router()

const FriendController = require('../controllers/FriendController')

router.put('/request', FriendController.request)
router.put('/accept', FriendController.accept)

router.delete('/unfriend', FriendController.unfriend)
router.delete('/unrequest', FriendController.unrequest)

router.get('/friends', FriendController.friends)
router.get('/incoming', FriendController.incoming)
router.get('/outgoing', FriendController.outgoing)
router.get('/friend_status', FriendController.friendStatus)

module.exports = router