const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppClient {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });
        
        this.isReady = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.client.on('qr', (qr) => {
            console.log('QR Code received, scan with your WhatsApp app:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('WhatsApp client is ready!');
            this.isReady = true;
        });

        this.client.on('authenticated', () => {
            console.log('WhatsApp client authenticated');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('Authentication failed:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('WhatsApp client disconnected:', reason);
            this.isReady = false;
        });
    }

    async initialize() {
        try {
            await this.client.initialize();
            console.log('WhatsApp client initialized');
        } catch (error) {
            console.error('Failed to initialize WhatsApp client:', error);
            throw error;
        }
    }

    async sendMessage(phoneNumber, message) {
        if (!this.isReady) {
            throw new Error('WhatsApp client is not ready');
        }

        try {
            // Format phone number (remove any non-numeric characters and add country code if needed)
            const formattedNumber = this.formatPhoneNumber(phoneNumber);
            
            // Check if the number is registered on WhatsApp
            const isRegistered = await this.client.isRegisteredUser(formattedNumber);
            
            if (!isRegistered) {
                throw new Error(`Phone number ${formattedNumber} is not registered on WhatsApp`);
            }

            // Send the message
            const result = await this.client.sendMessage(formattedNumber, message);
            console.log('Message sent successfully:', result.id._serialized);
            return result;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }

    formatPhoneNumber(phoneNumber) {
        // Remove all non-numeric characters
        let cleaned = phoneNumber.replace(/\D/g, '');
        
        // If the number doesn't start with country code, add Sri Lanka code (94)
        if (cleaned.startsWith('0')) {
            cleaned = '94' + cleaned.substring(1);
        } else if (!cleaned.startsWith('94')) {
            cleaned = '94' + cleaned;
        }
        
        // Add @c.us suffix for WhatsApp
        return cleaned + '@c.us';
    }

    isClientReady() {
        return this.isReady;
    }

    async destroy() {
        if (this.client) {
            await this.client.destroy();
        }
    }
}

module.exports = WhatsAppClient;
