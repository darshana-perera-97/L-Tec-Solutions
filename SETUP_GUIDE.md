# L-Tec Solutions - Frontend & Backend Setup Guide

This guide explains how to set up and run the L-Tec Solutions website with separate frontend and backend components.

## Project Structure

```
L-Tec-Solutions/
├── backend/                 # Node.js backend server
│   ├── server.js           # Express server with WhatsApp integration
│   ├── whatsapp-client.js  # WhatsApp Web.js client
│   ├── package.json        # Backend dependencies
│   ├── start.bat          # Windows startup script
│   ├── start.sh           # Linux/Mac startup script
│   └── README.md          # Backend documentation
├── products/               # Product pages
│   ├── product.html       # Gaming PC product page
│   ├── product-script.js  # Product page JavaScript
│   └── product-styles.css # Product page styles
├── api.js                 # Frontend API utilities
├── index.html             # Main homepage
├── script.js              # Main page JavaScript
├── styles.css             # Main page styles
└── SETUP_GUIDE.md         # This file
```

## Quick Start

### 1. Start the Backend Server

**Option A: Using the startup script (Recommended)**
```bash
# Windows
cd backend
start.bat

# Linux/Mac
cd backend
chmod +x start.sh
./start.sh
```

**Option B: Manual setup**
```bash
cd backend
npm install
npm start
```

### 2. Start the Frontend

**Option A: Using Live Server (VS Code)**
1. Open the project in VS Code
2. Install "Live Server" extension
3. Right-click on `index.html` and select "Open with Live Server"

**Option B: Using Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option C: Using Node.js http-server**
```bash
npm install -g http-server
http-server -p 8000
```

### 3. WhatsApp Authentication

When you start the backend server:
1. A QR code will appear in the terminal
2. Open WhatsApp on your phone
3. Go to Settings > Linked Devices
4. Tap "Link a Device"
5. Scan the QR code
6. Wait for "WhatsApp client is ready!" message

## Testing the Integration

### 1. Check Backend Status
Visit: `http://localhost:3000/api/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "whatsapp": true
}
```

### 2. Check WhatsApp Status
Visit: `http://localhost:3000/api/whatsapp/status`

Expected response:
```json
{
  "ready": true,
  "message": "WhatsApp client is ready"
}
```

### 3. Test Form Submission
1. Open the frontend (e.g., `http://localhost:8000`)
2. Navigate to the product page
3. Click "Buy Now"
4. Fill out the form
5. Submit the form
6. Check WhatsApp for the message sent to +94771461925

## Configuration

### Backend Configuration
- **Port**: 3000 (default)
- **WhatsApp Number**: +94771461925
- **CORS**: Configured for localhost:8000, localhost:3000, and file:// protocols

### Frontend Configuration
- **API Base URL**: `http://localhost:3000/api` (in `api.js`)
- **Timeout**: 10 seconds
- **Retry Attempts**: 3

## Troubleshooting

### Backend Issues

**Problem**: `npm install` fails
**Solution**: Make sure Node.js is installed. Download from https://nodejs.org/

**Problem**: WhatsApp QR code not appearing
**Solution**: 
1. Check if port 3000 is available
2. Try restarting the server
3. Check console for error messages

**Problem**: WhatsApp authentication fails
**Solution**:
1. Make sure your phone has internet connection
2. Try scanning the QR code again
3. Check if WhatsApp Web is working in your browser

### Frontend Issues

**Problem**: Form submission fails with CORS error
**Solution**: 
1. Make sure backend is running on port 3000
2. Check if frontend is served from allowed origins
3. Verify CORS configuration in `backend/server.js`

**Problem**: "API utilities not loaded" error
**Solution**: 
1. Make sure `api.js` is included in your HTML
2. Check browser console for script loading errors
3. Verify file paths are correct

**Problem**: Backend not available error
**Solution**:
1. Start the backend server
2. Check if it's running on port 3000
3. Verify API_BASE_URL in `api.js`

### Network Issues

**Problem**: Connection timeout
**Solution**:
1. Check if both frontend and backend are running
2. Verify firewall settings
3. Try increasing timeout in `api.js`

## Development

### Adding New API Endpoints

1. Add endpoint in `backend/server.js`
2. Add corresponding method in `api.js`
3. Update frontend to use the new endpoint

### Modifying WhatsApp Messages

Edit the message format in `backend/server.js` in the `/api/submit-form` endpoint.

### Changing WhatsApp Number

Update the `targetNumber` variable in `backend/server.js`.

## Production Deployment

### Backend Deployment
1. Set up a VPS or cloud server
2. Install Node.js and dependencies
3. Use PM2 for process management
4. Set up reverse proxy (nginx)
5. Configure environment variables

### Frontend Deployment
1. Deploy to any static hosting (Netlify, Vercel, GitHub Pages)
2. Update API_BASE_URL in `api.js` to point to production backend
3. Update CORS configuration in backend

## Support

If you encounter issues:
1. Check the console logs in both frontend and backend
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Check network connectivity

## API Reference

### Endpoints

- `GET /api/health` - Health check
- `GET /api/whatsapp/status` - WhatsApp client status
- `POST /api/submit-form` - Submit product inquiry

### Request/Response Examples

See `backend/README.md` for detailed API documentation.
