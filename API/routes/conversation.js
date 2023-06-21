const router = require('express').Router();
const conversationController = require('../controller/conversationController')

router.post('/', conversationController.createConversation)
router.get('/:userId', conversationController.getConversation)
router.get('/find/:firstId/:secondId', conversationController.getConversationById)
router.delete('/:userId', conversationController.deleteConversation)

module.exports = router