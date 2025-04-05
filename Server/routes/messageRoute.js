import express from 'express';
const messageRouter = express.Router();
import { sendMessage , getMessages } from '../controllers/messageController.js';
import { authenticateUser } from '../middlewares/AuthMiddleware.js';


messageRouter.post('/send/:id', authenticateUser, sendMessage);   // // api/message/send/:id
messageRouter.get('/get/:id', authenticateUser, getMessages);   // // api/message/get/:id



export default messageRouter; 