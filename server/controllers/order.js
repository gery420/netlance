const Order = require('../models/order.model');
const Gig = require('../models/gig.model');
const stripe = require('../utils/stripe');

exports.CreateOrder = async (req, res, next) => {
    try{
        const { gigId, buyerId } = req.body;

        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({
                message: "Gig not found",
                success: false,
            });
        }

        const DOMAIN = process.env.REACT_APP_FRONTEND_URL;
        if (!gig.title || !gig.price || !gig.sellerID) {
            return res.status(400).json({
                message: "Gig has missing required fields",
                success: false,
        });
}

        const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `${DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}&gigId=${gigId}&buyerId=${buyerId}`,
                cancel_url: `${DOMAIN}/explore`,
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: gig.title,
                                description: gig.description,
                            },
                            unit_amount: gig.price * 100, // Convert to cents
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    gigId: gig._id.toString(),
                    sellerId: gig.sellerID.toString(),
                    buyerId: buyerId.toString(),
                    title: gig.title,
                    price: gig.price.toString(),
                },
        })
        return res.status(200).json({
            message: "Order created successfully",
            success: true,
            url: session.url,
            sessionId: session.id,
        });

    }
    catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}
exports.ConfirmOrder = async (req, res, next) => {

    const { session_id } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session) {
            return res.status(404).json({
                message: "Session not found",
                success: false,
            });
        }

        if (session.payment_status === 'paid') {
                    
            const order = new Order({
                gigID: session.metadata.gigId,
                buyerID: session.metadata.buyerId,
                sellerID: session.metadata.sellerId,
                title: session.metadata.title,
                price: parseFloat(session.metadata.price), // Convert back to original amount
                status: 'in-progress',
                isPaid: true,
                paymentIntentId: session.payment_intent,
            });
            
            await order.save();
            
            return res.status(200).json({
                message: "Order confirmed successfully",
                success: true,
                order,
            });
        }
        else {
            return res.status(400).json({
                message: "Payment not completed",
                success: false,
            });
        }
    }
    catch (error) {
        console.error("Error confirming order:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }

}

exports.GetOrdersByBuyerId = async (req, res, next) => {

    const  buyerID  = req.user.id ;
    console.log("Buyer ID:", buyerID);
    console.log("User ID in request:", req.user.id);

    if (!req.user || req.user.id.toString() !== buyerID) {
        return res.status(403).json({
            message: "Unauthorized access",
            success: false,
        });
    }

    try {
        const orders = await Order.find({ buyerID }).populate('gigID').populate('sellerID');

        if (!orders || orders.length === 0) {
            console.log("No orders found for buyer:", buyerID);
            return res.status(404).json({
                message: "No orders found for this buyer",
                success: false,
            });
        }
        console.log("Orders retrieved successfully for buyer:", buyerID);

        return res.status(200).json({
            message: "Orders retrieved successfully",
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

exports.GetOrdersBySellerId = async (req, res, next) => {
    const  sellerID  = req.user.id;
    console.log("Seller ID:", sellerID);
    if (!req.user || req.user.id.toString() !== sellerID) {
        return res.status(403).json({
            message: "Unauthorized access",
            success: false,
        });
    }

    try {
        const orders = await Order.find({ sellerID }).populate('gigID').populate('buyerID');

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: "No orders found for this seller",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Orders retrieved successfully",
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

exports.UpdateOrderStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

exports.GetOrderById = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId).populate('gigID').populate('buyerID').populate('sellerID');

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                order,
            },
        });
    } catch (error) {
        console.error("Error retrieving order:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}
