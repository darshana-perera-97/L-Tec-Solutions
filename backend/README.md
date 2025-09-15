# L-Tec Solutions Backend

This is the Node.js backend server for L-Tec Solutions with WhatsApp integration.

## Features

- Express.js server
- WhatsApp Web.js integration
- Form submission API endpoint
- Automatic WhatsApp message sending to +94771461925

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 3. WhatsApp Authentication

When you first run the server, you'll see a QR code in the terminal. Follow these steps:

1. Open WhatsApp on your phone
2. Go to Settings > Linked Devices
3. Tap "Link a Device"
4. Scan the QR code displayed in the terminal
5. Wait for the "WhatsApp client is ready!" message

### 4. Test the Integration

1. Open your browser and go to `http://localhost:3000`
2. Navigate to the product page
3. Click "Buy Now" and fill out the form
4. Submit the form
5. Check WhatsApp for the message sent to +94771461925

## API Endpoints

### POST /api/submit-form
Submits form data and sends WhatsApp message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "product": "Gaming PC Pro",
  "quantity": 1,
  "message": "Additional details..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully and WhatsApp message sent!"
}
```

### GET /api/whatsapp/status
Check WhatsApp client status.

**Response:**
```json
{
  "ready": true,
  "message": "WhatsApp client is ready"
}
```

### GET /api/health
Health check endpoint.

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
```

## Troubleshooting

### WhatsApp Connection Issues
- Make sure your phone has an active internet connection
- Try restarting the server and scanning the QR code again
- Check if WhatsApp Web is working in your browser

### Form Submission Issues
- Check browser console for errors
- Verify the backend server is running
- Check network connectivity

## Dependencies

- **express**: Web framework
- **whatsapp-web.js**: WhatsApp Web API
- **qrcode-terminal**: QR code display
- **cors**: Cross-origin resource sharing
- **body-parser**: Request body parsing
- **dotenv**: Environment variables
