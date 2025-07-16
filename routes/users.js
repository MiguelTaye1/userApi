// import the express module
const express = require("express");
const router = express.Router();
const { User } = require("../models/model");
const bcrypt = require("bcryptjs");

// import the middleware for authorization
const auth = require("../middleware/auth")

// Below is a route to fetch all users
router.get("/",auth, async(req, res)=>{
    try{
        const user = await User.find()
        res.json(user)
    }
    catch(err){
        res.status(500).json({message : err.message})
    }
});



// fetch a users based on a given id
router.get("/:id",auth, async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);

        // check whether the user exists based on the id passed
        if(!user) return res.status(404).json({message : "user not found"})
        
        // if the id passed is correct, we shall just show the records of that given user
        res.json(user);

    }
    catch(err){
        res.status(500).json({message : err.message})
    }
});

// Below is the update route for the user
router.put("/:id",auth, async(req, res)=>{
    try{
        // destructure the details you want to update for the user.
        const {name, email, age, password} = req.body;
        // console.log(name, email, age, password)
        const user = await User.findById(req.params.id);

        // Step 1: Check whether the user exist by use of passed ID
        if(!user) res.status(404).json({message : "user not found"});

        // Step 2: Prepare the data to update
        let updateData = {name, email, age}

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        };

        console.log("The updated data is: ",updateData)
        // Step 3: update the user with the new details
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new : true}
        );


        // step 4: Give a response back
        res.json({message : "user Details updated successfully", user : updatedUser})
    }
    catch(err){
        res.status(400).json({message : err.message})
    }
});




// Below is the delete route for the user
router.delete("/:id",auth, async(req,res)=>{
    try{
        // Attempt to find and delete the users by their ID from the URL
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        // If no user is found to be deleted, give a response back
        if(!deletedUser) res.status(404).json({message : "User not found"});

        // If the deletion has happened, notify the user with a success message
        res.json({message : "user deleted successfully"});
    }
    catch(err){
        res.status(500).json({message : err.message});
    }
});


// export the entire module
module.exports = router;