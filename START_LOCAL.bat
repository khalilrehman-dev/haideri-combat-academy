@echo off
cd /d "%~dp0public"
echo Open http://localhost:8000 in your browser.
echo Keep this window open while previewing the website.
python -m http.server 8000
pause
