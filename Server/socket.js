import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN || 'http://localhost:5173', // Adjust this based on your frontend URL
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('New client connected with id:', socket.id);

    // Join a room based on user ID (passed via query or auth)
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle sending messages
    socket.on('sendMessage', (data) => {
        const { senderId, receiverId, message } = data;
        console.log('Message received:', data);

        // Emit the message to the receiver's room and the sender
        io.to(receiverId).emit('newMessage', { senderId, receiverId, message, createdAt: new Date() });
        io.to(senderId).emit('newMessage', { senderId, receiverId, message, createdAt: new Date() }); // Echo back to sender
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected with id:', socket.id);
    });
});

export { httpServer, app };
