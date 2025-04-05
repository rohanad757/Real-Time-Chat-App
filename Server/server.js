import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import router from './routes/authRoutes.js';
import contactRoute from './routes/contactRoutes.js';
import messageRouter from './routes/messageRoute.js';
import { setIo } from './controllers/messageController.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN || '*', 
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use('/api/auth', router);
app.use('/api/contact', contactRoute);
app.use('/api/message', messageRouter);

setIo(io);

io.on('connection', (socket) => {
    console.log('New client connected with id:', socket.id);
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected with id:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
const database = process.env.MONGO_URL || 'mongodb+srv://rohanad777:Rohan757@cluster0.vhfnl.mongodb.net/chatty';
mongoose.connect(database)
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.log(err));

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
