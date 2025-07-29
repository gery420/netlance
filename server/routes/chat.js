const express = require('express');
const router = express.Router();
const Auth = require('../middleware/Auth');

const {
    getOrCreateConversation,
} = require('../controllers/conversation');

const {
    sendMessage,
    getMessages,
} = require('../controllers/message');

router.get('/conversation/:orderId', Auth, getOrCreateConversation);

router.post('/message/:conversationId', Auth, sendMessage);

router.get('/message/:conversationId', Auth, getMessages);

module.exports = router;
