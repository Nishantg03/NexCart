//add product to user cart
import UserModel from '../models/usermodel.js';

const addtocart =async ( req, res ) => {
  try {
    const { userId, productId, size } = req.body;

    const userDate = await UserModel.findById(userId);
   const cartData = await userDate.cart || {};
    if(cartData[productId]){
        if(cartData[productId][size]){
            cartData[productId][size] += 1; 
        }
    } else {
        cartData[productId] = { [size]: 1 };
    }

   await UserModel.findByIdAndUpdate(userId, { cart: cartData }, { new: true });

    res.status(200).json({ success: true, message: 'Product added to cart successfully' });

  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


const updateCart = async ( req , res) => {
    try {
        const { userId, productId, size, quantity } = req.body;

        const userDate = await UserModel.findById(userId);
        const cartData = await userDate.cart || {}; 
     
        cartData[productId][size] = quantity;
        await UserModel.findByIdAndUpdate(userId, { cart: cartData }, { new: true });
        res.status(200).json({ success: true, message: 'Cart updated successfully' });

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }   
}


const  getuserCart = async ( req , res) => {
    try {   
        const { userId } = req.body;
        const userDate = await UserModel.findById(userId);
        const cartData = await userDate.cart || {};
        res.status(200).json({ success: true, cart: cartData });
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



export { addtocart , updateCart , getuserCart }