import express from 'express'
import { addtocart , getuserCart ,updateCart } from '../controllers/cartController.js'
import verifyToken from '../middleware/auth.js';

const Cartrouter = express.Router();

Cartrouter.post('/addtocart',verifyToken ,addtocart);
Cartrouter.get('/getusercart', verifyToken, getuserCart);
Cartrouter.put('/updatecart', verifyToken, updateCart);


export default Cartrouter;