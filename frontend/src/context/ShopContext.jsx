import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const backendURL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');
export const ShopContext = createContext({
    products: [],
    currency: '$',
    delivery_fee: 10,
    backendUrl: backendURL,
    
});

const ShopContextProvider = (props) => {
    const [token ,settoken] = useState(localStorage.getItem('token') || '');
    const [search , setSearch] = useState('');
    const [showsearch , setShowSearch] = useState(false);
    const [cartItems , setCartItems] = useState(() => {
        try {
            const raw = localStorage.getItem('cartItems');
            return raw ? JSON.parse(raw) : {};
        } catch (err) {
            return {};
        }
    });
    const [products, setProducts] = useState([]);

    // Validate token on app load
    useEffect(() => {
        const clearAllTokens = () => {
            console.log('Clearing all authentication data');
            localStorage.removeItem('token');
            localStorage.removeItem('tokens');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            
            // Also remove any other token/auth related keys
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('token') || key.includes('user') || key.includes('auth'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        };

        const validateToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await axios.get(`${backendURL}/api/users/validate-token`, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    if (!response.data.success) {
                        clearAllTokens();
                        settoken('');
                    }
                } catch (error) {
                    // Token is invalid, clear all tokens
                    console.log('Token validation failed:', error.message);
                    clearAllTokens();
                    settoken('');
                }
            }
        };
        validateToken();
    }, []);

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

    // persist
    try { localStorage.setItem('cartItems', JSON.stringify(cartData)); } catch (e) {}

       if(token){
        axios.post(`${backendURL}/api/cart/add`, { userId: token, productId: itemId, size: size })
            .then(response => {
                console.log('Cart updated on server:', response.data);
            })
            .catch(error => {
                console.error('Error updating cart on server:', error);
            });
       }
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

        try { localStorage.setItem('cartItems', JSON.stringify(cartData)); } catch (e) {}

        if(token){
            axios.post(`${backendURL}/api/cart/update`, { userId: token, productId: itemId, size: size, quantity: quantity })
                .then(response => {
                    console.log('Cart updated on server:', response.data);
                })
                .catch(error => {
                    console.error('Error updating cart on server:', error);
                });
        }
    };

    const removeFromCart = (itemId, size) => {
        let cartData = structuredClone(cartItems);
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
        }
        setCartItems(cartData);
        toast.success('Item removed from cart');
        try { localStorage.setItem('cartItems', JSON.stringify(cartData)); } catch (e) {}
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (let itemId in cartItems) {
            const itemInfo = products.find(p => p._id === itemId);
            if (!itemInfo) continue; // Skip if product not found
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

   const fetchProducts = useCallback(async () => {  
        try {
            console.log('=== listProducts API Called ===');
            const response = await axios.get(`${backendURL}/api/products/list`);
            const data = response.data;
            if (data.success) {
                setProducts(data.products);
                console.log('Products loaded successfully:', data.products.length);
            } else {
                console.warn('Products fetch returned success: false');
                toast.error('Failed to load products');
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products. Please try again later.');
        }
    }, [backendURL]);

    const getusercart = async (token) => {
        try {
            const response = await axios.get(`${backendURL}/api/cart/getusercart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.cartData || {};
        } catch (error) {
            console.error('Error fetching user cart:', error);
            return {};
        }
    }

    // Fetch products on mount and when backend URL changes
    useEffect(() => {
        console.log('ShopContextProvider mounted, fetching products');
        // Small delay to ensure backend is ready
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        
        return () => clearTimeout(timer);
    }, [backendURL]);

    useEffect(() => {
        if(!token && localStorage.getItem('token')){
            settoken(localStorage.getItem('token'));
            getusercart(localStorage.getItem('token')).then(cartData => {
                setCartItems(cartData);
            }   );
        
        }
    }, [token]);





    return (
        <ShopContext.Provider value={{ getCartCount, getCartAmount, search, setSearch, showsearch, settoken, token, setShowSearch, products, currency: '$', delivery_fee: 10, cartItems, setCartItems, addtocart, updateQuantity, removeFromCart, backendUrl: backendURL, fetchProducts, getusercart }}>
            {props.children}
        </ShopContext.Provider>
    );
};


export default ShopContextProvider;