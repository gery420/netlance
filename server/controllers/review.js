const Review = require('../models/review.model');
const Gig = require('../models/gig.model');
const Order = require('../models/order.model');

exports.createReview = async (req, res) => {
    const { gigId, orderId } = req.params;
    const { buyerId, desc, star } = req.body;

    try {
        if (!gigId || !buyerId || !desc || star === undefined) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const gigExists = await Gig.findById(gigId);
        if (!gigExists) {
            return res.status(404).json({ success: false, message: "Gig not found" });
        }

        const newReview = new Review({
            gigId,
            buyerId,
            desc,
            star,
        });
        
        await newReview.save();

        const gigReview = await Gig.findById(gigId);

        const updatedTotalStars = gigReview.totalStars + star;
        const updatedReviews = gigReview.totalReviews + 1;

        await Gig.findByIdAndUpdate(gigId, {
            totalStars: updatedTotalStars,
            totalReviews: updatedReviews,
        });

        await Order.findByIdAndUpdate(orderId, {
            reviewId: newReview._id,
        });

        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        console.error("Create review error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.getReviewByGig = async (req, res) => {
    const { gigId } = req.params;

    try {
        const reviews = await Review.find({ gigId }).populate('buyerId', 'username');
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error("Get reviews by gig error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        const gig = await Gig.findById(review.gigId);
        if (!gig) {
            return res.status(404).json({ success: false, message: "Gig not found" });
        }
        gig.totalStars -= review.star;
        gig.totalReviews -= 1;

        const order = await Order.findOne({ reviewId: reviewId });
        if (order) {
            order.reviewId = null;
            await order.save();
        }

        await gig.save();
        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
