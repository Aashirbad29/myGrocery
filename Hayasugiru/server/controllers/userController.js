import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Register User
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // Set cookie expiration to 7 days
        });

        return res.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (error) {
        console.error('Error during registration:', error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // Set cookie expiration to 7 days
        });

        return res.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.json({ success: false, message: error.message });
    }
};

//CHeck Auth : /api/user/is-auth
// is-auth route (protected)
export const isAuth = async (req, res) => {
    try {
        // Log the user ID coming from the middleware (should be set by authUser)
        console.log('User ID from request:', req.userId);

        // Find the user in the database
        const user = await User.findById(req.userId).select("-password"); // Exclude password for security
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Return the user data (without password)
        return res.json({ success: true, user });
    } catch (error) {
        console.error('Error in isAuth:', error.message);
        return res.json({ success: false, message: error.message });
    }
};



// Logout User : /api/user/logout
export const logout = async(req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
