import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleDetails
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminauth from "../middleware/adminauth.js";


const productRouter = express.Router();

productRouter.post('/add',adminauth,upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 },{name: 'image3', maxCount: 1},{name: 'image4', maxCount: 1}]), addProduct);
productRouter.get('/list', listProducts);
productRouter.delete('/remove/:id', adminauth, removeProduct);
productRouter.get('/details/:id', singleDetails);


export default productRouter