import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { products } from "../assets/assets.js";
export const ShopContext = createContext({
    products: products,
    currency: '$',
    delivery_fee: 10
    
});

const ShopContextProvider = (props) => {
    const [search , setSearch] = useState('');
    const [showsearch , setShowSearch] = useState(false);
    const [cartItems , setCartItems] = useState({});
    const addtocart = (itemId,size) => {
       if(!size){
        toast.error('Please select a size before adding to cart');
        return;
       }
       
       let cartData = structuredClone(cartItems);
       if(cartData[itemId]){
           if(cartData[itemId][size]){
               cartData[itemId][size] += 1; 
           }
           else{
               cartData[itemId][size] = 1; 
           }
       }
       else{
           cartData[itemId] = {};
           cartData[itemId][size] = 1; 
       }
       setCartItems(cartData);
       toast.success('Item added to cart');
    }
    
    const getCartCount = () => {
        let totalCount = 0;
        for (let itemId in cartItems) {
            for (let size in cartItems[itemId]) {
                try {
                    if(cartItems[itemId][size]>0){
                        totalCount += cartItems[itemId][size];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity <= 0) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        } else {
            cartData[itemId][size] = quantity;
        }
        setCartItems(cartData);
    };

    const removeFromCart = (itemId, size) => {
        let cartData = structuredClone(cartItems);
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
        }
        setCartItems(cartData);
        toast.success('Item removed from cart');
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (let itemId in cartItems) {
            const itemInfo = products.find(p => p._id === itemId);
            for (let size in cartItems[itemId]) {
                try {
                    if(cartItems[itemId][size]>0){
                        totalAmount += cartItems[itemId][size] * itemInfo.price;
                    }
                } catch (error) {
                    console.error('Error occurred while calculating cart amount:', error);
                }
            }
        }
        return totalAmount;
    };

    return (
        <ShopContext.Provider value={{ getCartCount, getCartAmount, search, setSearch, showsearch, setShowSearch, products, currency: '$', delivery_fee: 10, cartItems, addtocart, updateQuantity, removeFromCart }}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;