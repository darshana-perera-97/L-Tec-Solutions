const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const WhatsAppClient = require('./whatsapp-client');

const app = express();
const PORT = process.env.PORT || 5555;

// Initialize WhatsApp client
const whatsappClient = new WhatsAppClient();

// CORS configuration for separate frontend
const corsOptions = {
    origin: true, // Allow all origins for now - you can restrict this later
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors(corsOptions));

// WhatsApp client status endpoint
app.get('/api/whatsapp/status', (req, res) => {
    res.json({
        ready: whatsappClient.isClientReady(),
        message: whatsappClient.isClientReady() ? 'WhatsApp client is ready' : 'WhatsApp client is not ready'
    });
});

// Form submission endpoint
app.post('/api/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        
        // Validate required fields
        if (!formData.name || !formData.email || !formData.phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, email, and phone are required'
            });
        }

        // Check if WhatsApp client is ready
        if (!whatsappClient.isClientReady()) {
            return res.status(503).json({
                success: false,
                message: 'WhatsApp service is not ready. Please try again later.'
            });
        }

        // Format the message for the business
        const message = `🏢 *New Product Inquiry from L-Tec Solutions Website*

👤 *Customer Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}

📦 *Product Information:*
• Product: ${formData.product || 'Not specified'}
• Quantity: ${formData.quantity || 'Not specified'}
• Message: ${formData.message || 'No additional message'}

📅 *Inquiry Date:* ${new Date().toLocaleString()}

Please contact the customer as soon as possible.`;

        // Send WhatsApp message ONLY to the business number (+94771461925)
        // NO message will be sent to the customer's phone number
        const businessNumber = '+94771461925';
        await whatsappClient.sendMessage(businessNumber, message);

        res.json({
            success: true,
            message: 'Form submitted successfully! Our team has been notified via WhatsApp and will contact you soon.'
        });

    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process form submission',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        whatsapp: whatsappClient.isClientReady()
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`API endpoints available at: http://localhost:${PORT}/api`);
    console.log(`WhatsApp status: http://localhost:${PORT}/api/whatsapp/status`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('Frontend should be served separately (e.g., using Live Server, http-server, or any web server)');
    console.log('Make sure to update the API_BASE_URL in your frontend configuration');
    
    // Initialize WhatsApp client
    try {
        await whatsappClient.initialize();
    } catch (error) {
        console.error('Failed to initialize WhatsApp client:', error);
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    await whatsappClient.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down server...');
    await whatsappClient.destroy();
    process.exit(0);
});
