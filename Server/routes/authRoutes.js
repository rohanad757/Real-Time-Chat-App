import { Router } from 'express';
const router = Router();
import { signUp , login , getCurrentUser , updateProfile , getImage , removeImage , logout } from '../controllers/AuthController.js';
import { authenticateUser } from '../middlewares/AuthMiddleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/signup' , signUp)   // // api/auth/signup
router.post('/login' , login)   // // api/auth/login
router.get('/me' , authenticateUser, getCurrentUser)   // // api/auth/me
router.put('/update' , authenticateUser , upload.single('image') , updateProfile)   // // api/auth/update
router.get('/image' , authenticateUser , getImage)   // // api/auth/image
router.put('/remove-img' , authenticateUser , removeImage)   // // api/auth/remove-img
router.get('/logout' , authenticateUser , logout)   // // api/auth/logout

export default router;