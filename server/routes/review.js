const express = require('express');
const router = express.Router();
const { createReview, getReviewByGig } = require('../controllers/review');
const Auth = require('../middleware/Auth');

router.post('/create/:orderId/:gigId', Auth, createReview);
router.get('/view/:gigId', Auth, getReviewByGig);

module.exports = router;
