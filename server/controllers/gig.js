const Gig = require("../models/gig.model");
const Seller = require("../models/seller.model");
const Review = require("../models/review.model");

exports.CreateGig = async (req, res) => {

    const sellerId = req.user._id;

    const checkSeller = await Seller.findById(sellerId);

    if (checkSeller.length === 0) {
        return res.status(404).json({ success: false, message: "Seller not found" });
    }
    console.log("Seller found:", checkSeller);
    
    try {
        console.log("\nCreate Gig controller called");
        const { title, shortTitle, desc, shortDesc, price, deliveryTime, revisionNumber, features, category } = req.body;

        let parsedFeatures = [];
        if (features) {
            parsedFeatures = Array.isArray(features) ? features : [features];
        }
        
        const newGig = new Gig({
            sellerID: req.user._id, // 
            title,
            shortTitle,
            desc,
            shortDesc,
            price,
            deliveryTime,
            revisionNumber,
            category,
            features: parsedFeatures,
            cover: req.files.cover?.[0]?.path,
            images: req.files.images?.map((img) => img.path) || [],
        });

        await newGig.save();

        return res.status(201).json({
            message: "Gig created successfully",
            success: true,
            gig: newGig // Return the created gig if needed
        });
    } catch (error) {
        console.error("Error creating gig:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

exports.GetGigForSeller = async (req, res) => {
    try {
        const gigs = await Gig.find({ sellerID: req.user._id });
        return res.status(200).json({
            message: "Gigs fetched successfully",
            success: true,
            gigs
        });
    } catch (error) {
        console.error("Error fetching gigs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

exports.DeleteGig = async (req, res) => {
    try {
        const gigId = req.params.id;
        const gig = await Gig.findByIdAndDelete(gigId);

        if (!gig) {
            return res.status(404).json({
                message: "Gig not found",
                success: false
            });
        }
        await Review.deleteMany({ gigId: gigId });

        return res.status(200).json({
            message: "Gig deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error deleting gig:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

exports.GetAllGigs = async (req, res) => {
    try {
        const gigs = await Gig.find();
        const sellerUserName = await Promise.all(
            gigs.map( async (gig) => {
                const seller = await Seller.findById(gig.sellerID, 'username');
                return {
                    ...gig._doc,
                    sellerUserName: seller ? seller.username : 'Unknown Seller'
                }
            })
        ); 
        return res.status(200).json({
            message: "All gigs fetched successfully",
            success: true,
            gigs:sellerUserName,
            
        });
    } catch (error) {
        console.error("Error fetching all gigs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

exports.GetGigById = async (req, res) => {
    try {
        const gigId = req.params.id;
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({
                message: "Gig not found",
                success: false
            });
        }
        const seller = await Seller.findById(gig.sellerID, 'username');
        return res.status(200).json({
            message: "Gig fetched successfully",
            success: true,
            gig: {
                ...gig._doc,
                sellerUserName: seller ? seller.username : 'Unknown Seller'
            }
        });
    } catch (error) {
        console.error("Error fetching gig by ID:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

exports.UpdateGig = async (req, res) => {
    try {
        const gigId = req.params.id;
        const sellerId = req.user.id;
        console.log("Updating gig with ID:", gigId, "by seller ID:", sellerId);

        const sellerCheck = await Gig.findOne({sellerID: sellerId });
        if (sellerCheck=== null) {
            return res.status(400).json({
                message: "Unauthorized",
                success: false
            });
        }

        console.log("Seller found:", sellerCheck);

        const { title, shortTitle, desc, shortDesc, price, deliveryTime, revisionNumber, category } = req.body;

        let features = req.body.features;

        if (features && !Array.isArray(features)) {
            features = [features];
        }

        const updates = {
            ...(title && { title }),
            ...(shortTitle && { shortTitle }),
            ...(desc && { desc }),
            ...(shortDesc && { shortDesc }),
            ...(price && { price }),
            ...(deliveryTime && { deliveryTime }),
            ...(revisionNumber && { revisionNumber }),
            ...(category && { category }),
            ...(features && { features }),
        };

        if (req.files && req.files.cover && req.files.cover.length > 0) {
            updates.cover = req.files.cover[0].path;
        }
        const updatedGig = await Gig.findByIdAndUpdate(gigId, updates, { new: true });

        if (!updatedGig) {
            return res.status(404).json({
                message: "Gig not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Gig updated successfully",
            success: true,
            gig: updatedGig
        });
    } catch (error) {
        console.error("Error updating gig:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

exports.GetGigsByQuery = async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({
            message: "Query parameter is required",
            success: false
        });
    }

    const searchRegex = new RegExp(query, 'i'); 

    console.log("Searching for gigs with query:", query);
    
    const gigs = await Gig.find({
        $or: [
            { title: { $regex: searchRegex } },
            { shortTitle: { $regex: searchRegex } },
            { category: { $regex: searchRegex } }
        ]
    });

    if (!gigs || gigs.length === 0) {
        console.log("No gigs found for query:", query);
        return res.status(404).json({
            message: "No gigs found",
            success: false
        });
    }
    try {
        
        const sellerUserName = await Promise.all(
            gigs.map( async (gig) => {
                const seller = await Seller.findById(gig.sellerID, 'username');
                return {
                    ...gig._doc,
                    sellerUserName: seller ? seller.username : 'Unknown Seller'
                }
            })
        ); 

        console.log("Gigs found:", gigs.length);

        return res.status(200).json({
            message: "Gigs fetched successfully",
            success: true,
            gigs: sellerUserName
        });
    } catch (error) {
        console.error("Error fetching gigs by query:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}
