import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { Server } from 'socket.io';

// Assuming io is passed or imported from socket.js (you'll need to adjust your server setup)
let io; // We'll set this in server.js

export const setIo = (socketIo) => {
    io = socketIo;
};

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([conversation.save(), newMessage.save()]);

        // Emit the message via Socket.IO
        io.to(receiverId).emit('newMessage', { senderId, receiverId, message: newMessage.message, createdAt: newMessage.createdAt });
        io.to(senderId).emit('newMessage', { senderId, receiverId, message: newMessage.message, createdAt: newMessage.createdAt });

        res.status(200).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.userId;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        const messages = await Message.find({
            _id: { $in: conversation.messages },
        }).sort({ createdAt: 1 });
        res.status(200).json({
            senderMessages: messages.filter((message) => message.senderId.toString() === senderId),
            receiverMessages: messages.filter((message) => message.senderId.toString() === receiverId),
            conversationId: conversation._id,
            senderId,
            receiverId,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};