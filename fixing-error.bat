@echo off
echo Fixing common errors...

REM Create manifest.json
(
echo {
echo     "name": "NotFlix Ultra",
echo     "short_name": "NotFlix",
echo     "start_url": "/",
echo     "display": "standalone",
echo     "background_color": "#141414",
echo     "theme_color": "#e50914"
echo }
) > frontend\manifest.json

echo ✅ manifest.json created
echo ✅ Check auth.js and notifications.js manually
echo.
pause