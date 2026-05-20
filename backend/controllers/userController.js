import UserModel from '../models/usermodel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Validate token
const validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Token is valid', user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

// route to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.json({ success: true, message: 'User logged in successfully', token: token });


    }
    catch (err) {
        res.status(400).json({ message: 'Error occurred while logging in user' });
    }
}

//Route to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const exist = await UserModel.findOne({ email: email });
        if (exist) {
            return res.json({ success: false, message: 'User already exist' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }
        if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newuser = new UserModel({
            name, email, password: hashedPassword
        });
        await newuser.save();
        const token = createToken(newuser._id);
        res.json({ success: true, message: 'User registered successfully', token: token });

    }
    catch (err) {
        console.error('Error registering user:', err);
        res.status(400).json({ message: 'Error occurred while registering user' });
    }
}




//route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const adminId = 'admin_' + process.env.ADMIN_EMAIL;
            const token = jwt.sign({ id: adminId, email: email }, process.env.JWT_SECRET);
            res.json({ success: true, message: 'Admin logged in successfully', token: token });
        } else {
            res.status(400).json({ message: 'Invalid admin credentials' });
        }
    } catch (err) {
        console.log('Admin login error:', err);
        res.status(400).json({ message: 'Error occurred while logging in admin', error: err.message });
    }
}

export { loginUser, registerUser, adminLogin, validateToken };