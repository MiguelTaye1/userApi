//import express library to create a router
const express = require('express');
const router = express.Router();
//import the User model from models/model.js
const { User } = require('../models/model');
//import bcryptjs for hashing passwords
const bcryptjs = require('bcryptjs');
const path = require('path');
const fs = require('fs');
//import multer for handling file uploads
const multer = require('multer');
//configure the storage folder for uploaded files
const upload = multer({ dest: 'uploads/' });
//import jwt(jsonwebtoken) for generating tokens
const jwt = require('jsonwebtoken');
//import the JWT secret from .env file
const JWT_SECRET = process.env.JWT_SECRET;



//Below is an API endpoint to register a new user
//register
router.post('/register',upload.single('photo'), async (req , res)=> {
    try {
        //get the different data passed in the request body
        const { name, email, password } = req.body;
        //console.log("The entered name is:", name);
        //console.log("The entered email is:", email);
        //console.log("The entered password is:", password);

        //check if the user already exists
        const existingUser = await User.findOne({ email });

        //hash the password using bcryptjs so it does not get stored in plain text
        const salt = await bcryptjs.genSalt(10);
        console.log("The salt is:", salt);
        const hashedPassword = await bcryptjs.hash(password, salt);
        console.log("The hashed password is:", hashedPassword);





        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        };

        //declare a variable for photo
        let photo = null;

        //check if a file was uploaded
        if (req.file) {
            const ext = path.extname(req.file.originalname); // get the file extension
            //assign a new name to the photo
            const newfileName = Date.now() + ext;
            //specify the new file path
            const newPath = (`uploads/${newfileName}`);
            //move the file to the new path
            fs.renameSync(req.file.path, newPath);
            //set the photo variable to the new file name
            photo = newPath.replace(/\\/g, '/'); // replace backslashes with forward slashes for consistency
        }

        const user = new User({name , email, password: hashedPassword });
        const saved = await user.save();
      
        res.status(201).json( saved);
 
    }
    catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message });

    }
})



// Below is the login endpoint
router.post("/login", async(req,res)=>{
    // we shall use the email and the password during the signin
    const {email, password} = req.body;
    
    // show the entered records from insomnia
    // console.log("The entered name is: ", email)
    // console.log("The entered password is: ", password)


    // check whether the email entered is registered in the database.
    const user = await User.findOne({ email })
    console.log("The details of the user are: ",user)
    if(!user) return res.status(404).json({message : "User not found"})

    // check whether the password entered mathches with the one in the db
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("The value is: ",isMatch)
    if(!isMatch) return res.status(400).json({message : "Invalid password"})

    const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn : '1h'} );
    // console.log("The generated token is: ", token)

    res.json({token, user});
})



//expose the router to be used in other files
module.exports = router;