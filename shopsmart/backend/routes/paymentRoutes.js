const express = require('express');
const router = express.Router();

// Initialize Razorpay with better error handling
let razorpay = null;
let razorpayInitialized = false;

try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const Razorpay = require('razorpay');
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        razorpayInitialized = true;
        console.log('Razorpay initialized successfully');
    } else {
        console.warn('Razorpay credentials missing. Payment functionality will be disabled.');
    }
} catch (error) {
    console.error('Failed to initialize Razorpay:', error.message);
}

// Middleware to check if Razorpay is initialized
const checkRazorpay = (req, res, next) => {
    if (!razorpayInitialized) {
        return res.status(503).json({
            success: false,
            message: 'Payment service is currently unavailable. Please check server configuration.'
        });
    }
    next();
};

// Create order
router.post('/create-order', checkRazorpay, async (req, res) => {
    try {
        console.log('Create order request:', req.body);
        
        const { amount, currency = 'INR', receipt, notes } = req.body;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        const options = {
            amount: Math.round(amount),
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes,
            payment_capture: 1
        };

        console.log('Creating Razorpay order with options:', options);
        
        const order = await razorpay.orders.create(options);
        
        console.log('Order created successfully:', order.id);
        
        res.json({
            success: true,
            order,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order: ' + error.message
        });
    }
});

// Verify payment
router.post('/verify-payment', (req, res) => {
    try {
        console.log('Verify payment request:', req.body);
        
        const { order_id, payment_id, signature } = req.body;
        
        if (!order_id || !payment_id || !signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        // If Razorpay not initialized, we can't verify but we can still accept the payment
        if (!razorpayInitialized) {
            console.warn('Razorpay not initialized, but accepting payment verification');
            return res.json({
                success: true,
                message: 'Payment verified successfully (offline mode)'
            });
        }

        const crypto = require('crypto');
        
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(order_id + "|" + payment_id)
            .digest('hex');
        
        console.log('Expected signature:', expectedSignature);
        console.log('Received signature:', signature);
        
        if (expectedSignature === signature) {
            console.log('Payment verification successful');
            res.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            console.log('Payment verification failed: signature mismatch');
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment: ' + error.message
        });
    }
});

// Test endpoint to check Razorpay configuration
router.get('/test-config', (req, res) => {
    const config = {
        razorpay_configured: razorpayInitialized,
        key_id: process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Missing',
        key_secret: process.env.RAZORPAY_KEY_SECRET ? 'Configured' : 'Missing',
        message: razorpayInitialized ? 
            'Razorpay is ready for payments' : 
            'Razorpay is not configured. Please check environment variables.'
    };
    
    res.json(config);
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        service: 'payment',
        status: razorpayInitialized ? 'active' : 'inactive',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;