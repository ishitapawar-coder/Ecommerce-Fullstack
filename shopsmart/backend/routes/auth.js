const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple token generation using timestamp and random number
const generateToken = () => {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Google authentication
router.post('/google', async (req, res) => {
    try {
        const { access_token, user: googleUser } = req.body;

        // Find or create user
        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = new User({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.sub,
                avatar: googleUser.picture,
                isVerified: true
            });
        }

        // Generate and store authentication token
        const authToken = generateToken();
        user.authToken = authToken;
      
        await user.save();

        res.json({
            success: true,
            message: 'Authentication successful',
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Authentication failed' 
        });
    }
});

// Check if user is authenticated
router.get('/check', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.json({
                authenticated: false,
                message: 'No token provided'
            });
        }

        const user = await User.findOne({ 
            authToken: token,
            tokenExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.json({
                authenticated: false,
                message: 'Invalid or expired token'
            });
        }

        res.json({
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Token verification failed' 
        });
    }
});

// Logout route
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(400).json({ 
                success: false,
                message: 'Token required' 
            });
        }

        const user = await User.findOne({ authToken: token });
        
        if (user) {
            user.authToken = null;
            user.tokenExpires = null;
            await user.save();
        }
        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Logout failed' 
        });
    }
});

// Regular login (email/password)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Generate and store authentication token
        const authToken = generateToken();
        user.authToken = authToken;
        user.tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await user.save();
        
        res.json({
            success: true,
            message: 'Login successful',
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Login failed' 
        });
    }
});

// Regular signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        
        // Create new user
        const user = new User({
            name,
            email,
            password,
            isVerified: false
        });
        
        // Generate and store authentication token
        const authToken = generateToken();
        user.authToken = authToken;
        user.tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await user.save();
        
        res.json({
            success: true,
            message: 'Signup successful',
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Signup failed' 
        });
    }
});

module.exports = router;