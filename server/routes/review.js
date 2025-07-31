const express = require('express');
const router = express.Router();
const { createReview, getReviewByGig, deleteReview } = require('../controllers/review');
const Auth = require('../middleware/Auth');

router.post('/create/:orderId/:gigId', Auth, createReview);
router.get('/view/:gigId',  getReviewByGig);
router.delete('/delete/:reviewId', Auth, deleteReview);

module.exports = router;
