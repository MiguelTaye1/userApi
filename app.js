//import express
const express = require('express');
//import mongoose   for database connection
const mongoose = require('mongoose');

//import the .env module
require('dotenv').config();



//create an express application
const app = express();

//specify the data formart you expect to receive your data in
app.use(express.json());

//import the auth routes
const authRoutes = require('./routes/auth');
//use the auth routes
app.use('/api/auth', authRoutes);

//import the user routes
const userRoutes = require('./routes/users');
//use the user routes
app.use('/api/users', userRoutes);

//import the department routes
const departmentRoutes = require('./routes/departments');
//use the department routes
app.use('/api/departments', departmentRoutes);

//import the employee routes
const employeeRoutes = require('./routes/employees');
//use the employee routes
app.use('/api/employees', employeeRoutes);

//connect to the MongoDB database using the connection string from .env file
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Could not connect to MongoDB:', err));






//specify the port the application will listen on
const PORT = process.env.PORT || 3000;

//listen to the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});