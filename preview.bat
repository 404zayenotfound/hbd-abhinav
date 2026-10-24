@echo off
rem Opens the site at http://localhost:8080 so the music player works.
start "" http://localhost:8080
node "%~dp0serve.js" "%~dp0." 8080
