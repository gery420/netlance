const Message = require('../models/message.model');

exports.sendMessage = async (req, res) => {
    const { conversationId } = req.params;
    const { senderType, senderId, text } = req.body;

    try {
        const message = new Message({
        conversationId,
        senderType,
        senderId,
        text,
        });

        await message.save();

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getMessages = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const messages = await Message.find({ conversationId }).sort({ sentAt: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
