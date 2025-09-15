@echo off
echo Starting L-Tec Solutions Backend Server...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server...
echo.
echo IMPORTANT: When you see a QR code, scan it with your WhatsApp to authenticate!
echo.
call npm start
pause
