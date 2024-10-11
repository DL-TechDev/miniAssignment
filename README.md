# Mini Assignment Project
- This project is a Node.js application using Express and MongoDB to upload, search, and paginate CSV data.
- The frontend is built using Svelte, and the backend controllers will manage data upload and retrieval.
- This project also include 1 unit test using Vitest for the frontend and 2 unit tests using jest for backend.

## Assumptions
- The csv file uploaded must only contain the 5 fields such as postId, id, name, email and body.
- The search input will search for string found in the name email and body fields.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#run-application)

## Features
- Upload a CSV file and store its data in MongoDB.
- Fetch paginated data.
- Search for data based on multiple fields.
- Svelte frontend for user interaction.
- Unit test using Vitest.

## Requirements
- Node.js (v18+ recommended)
- MongoDB (local or cloud instance)
- Powershell (to run the commands)
- Browser (e.g. Google Chrome)

## Installation
### 1. Clone the Repository
```
git clone https://github.com/DL-TechDev/miniAssignment.git
cd miniAssignment
```

### 2. Install Dependencies
You will need to install the dependencies for both the backend and frontend.
- open Powershell and run the following commands in the root directory:
```
npm install
This will install all the required Node.js packages for both the backend and frontend.
```

### 3. Set Up MongoDB
You will need to run a local MongoDB instance.
--------------------------------------------------------------------
## Run Application

### 1. Start the Backend Server
Open Powershell
```
cd miniAssignment/backend
```
Run the following command to start the backend server:
```
nodemon app.js
```
### 2. Start Frontend
Open a second Powershell window
```
cd miniAssignment/frontend
```
Run the following command to start the frontend:
```
npm run dev
```
### 3. Use application in browser
1. Open browser and type the folllowing url to user the application:
```
http://localhost:5173/
```
2. Click on the upload button and choose the data.csv file.
3. Click on upload button to upload.
4. Browse the display data.
