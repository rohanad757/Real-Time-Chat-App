import { Router } from "express";
const contactRoute = Router();
import { searchContact , getAllContact } from "../controllers/contackController.js"; 
import { authenticateUser } from "../middlewares/AuthMiddleware.js";

contactRoute.post('/search' , authenticateUser , searchContact);  // // api/contact/search
contactRoute.get('/search' , authenticateUser , getAllContact); // api/contact/search

export default contactRoute;