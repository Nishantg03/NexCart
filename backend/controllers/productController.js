import ProductModel from '../models/productmodel.js';
import { cloudinary } from '../config/cloudinary.js';



// function to create a new product

const addProduct = async (req, res) => {
    try {
        console.log('Starting product upload...');
        
        // Check Cloudinary configuration
        if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
            console.error('Cloudinary not properly configured');
            return res.status(500).json({ message: 'Cloudinary configuration missing' });
        }
        
        const { name, description, price, category, subcategory, sizes, bestseller } = req.body;
        console.log('Form data received:', { name, description, price, category, subcategory, sizes, bestseller });
        
        // Validate required fields
        if (!name || !description || !price) {
            return res.status(400).json({ message: 'Missing required fields: name, description, price' });
        }
        
        const image1 = req.files['image1'] ? req.files['image1'][0].buffer : null;
        const image2 = req.files['image2'] ? req.files['image2'][0].buffer : null;
        const image3 = req.files['image3'] ? req.files['image3'][0].buffer : null;
        const image4 = req.files['image4'] ? req.files['image4'][0].buffer : null;

        const images = [image1, image2, image3, image4].filter(image => image !== null);
        console.log('Images to upload:', images.length);

        if (images.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        let imageUrl = await Promise.all(images.map(async (item) => {
            let result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({resource_type: 'image'}, (error, result) => {
                    if (error) {
                        console.log('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Image uploaded to Cloudinary:', result.secure_url);
                        resolve(result);
                    }
                });
                uploadStream.end(item);
            });
            return result.secure_url;
        }));

        console.log('All images uploaded. Creating product...');
        
        const productData = {
            name,
            description,
            price: Number(price),
            image: imageUrl,
            category,
            subcategory: subcategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true' ? true : false,
            date: Date.now()
        };
        console.log('Product data:', productData);
        
        const newProduct = new ProductModel(productData);
        await newProduct.save();
        console.log('Product saved successfully');
        res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });

    }
    catch (err) {
        console.log('Error adding product:', err);
        console.log('Error stack:', err.stack);
        res.status(500).json({ message: 'Error occurred while adding product', error: err.message });
    }
}




// Function to list all products

const listProducts = async (req, res) => {
    try {
        console.log('=== listProducts API Called ===');
        const products = await ProductModel.find({});
        console.log('Products data:', products);
        res.json({ success: true, products: products });
        
    }
    catch (err) {
        console.error('Error in listProducts:', err);
        console.error('Error stack:', err.stack);
        res.status(400).json({ message: 'Error occurred while fetching products', error: err.message });
    }
}











// function for removing a product

const removeProduct = async (req, res) => {

    try {
        const { id } = req.params;
        await ProductModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Product removed successfully' });
    }
    catch (err) {
        res.status(400).json({ message: 'Error occurred while removing product' });
    }



}





    // function for single product details

    const singleDetails = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }   
            res.json({ success: true, product: product });
        }
        catch (err) {
            res.status(400).json({ message: 'Error occurred while fetching product details' });
        }

    }



export { addProduct, listProducts, removeProduct, singleDetails };