const Conversation = require('../models/conversation.model');
const Order = require('../models/order.model');

exports.getOrCreateConversation = async (req, res) => {
    const { orderId } = req.params;

    try {
        let convo = await Conversation.findOne({ orderId });

        if (!convo) {
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            convo = new Conversation({
                orderId,
                buyerId: order.buyerID,
                sellerId: order.sellerID,
            });

            await convo.save();
        }

        res.status(200).json({ success: true, conversation: convo });
    } catch (error) {
        console.error("Get/Create conversation error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
