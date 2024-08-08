@echo off
cd C:\Users\simon\Documents\Code\Projects\random_chat\frontend
start cmd /k "npm start"

cd C:\Users\simon\Documents\Code\Projects\random_chat\backend
start cmd /k "nodemon src/index.js"

exit