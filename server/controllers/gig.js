const Gig = require("../models/gig.model"); // Assuming you have a Gig model defined
const Seller = require("../models/seller.model"); // Assuming you have a Seller model defined
exports.CreateGig = async (req, res) => {
    try {
        console.log("\nCreate Gig controller called");
        const { title, shortTitle, desc, shortDesc, price, deliveryTime, revisionNumber, features } = req.body;

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
        ); // Assuming you have a seller model with a name field;
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
