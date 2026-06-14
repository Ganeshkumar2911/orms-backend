const userModel = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Add expiry

    res.cookie('token', token, {
        // httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // FIX: lax in dev, none in prod
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: 'Login successful' });

}

async function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

async function getUser(req, res) {

    const user = await userModel.findById(req.user.id).select('-password');

    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    } else {
        res.status(200).json({ 
            message: 'User fetched successfully',
            user: user
        }); 
    }
}

module.exports = {
    loginUser,
    logoutUser,
    getUser,
}