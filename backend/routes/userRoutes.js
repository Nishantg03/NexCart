import express from 'express';
import { registerUser, loginUser, adminLogin, validateToken } from '../controllers/userController.js';

const Userrouter = express.Router();

// route to register user
Userrouter.post('/register', registerUser);

// route to login user
Userrouter.post('/login', loginUser);

// route to validate token
Userrouter.get('/validate-token', validateToken);

// route for admin login
Userrouter.post('/admin/login', adminLogin);


export default Userrouter;