// import express
const express = require("express");
const router = express.Router();

// import the Department Schema
const { Department } = require("../models/model");


// import the middleware for authorization
const auth = require("../middleware/auth")

router.post("/",auth, async(req, res)=>{
    try{
        const {name, description, managerId} = req.body;
        // console.log(name, ", ",description)
        const department = new Department({name, description, managerId})
        await department.save()
        res.status(200).json({message: "Department added successfully", addedDepartment : department})
    }
    catch(err){
        res.status(400).json({Error : err.message})
    }
});


// below is the endpoint to get all the departments
router.get("/",auth, async(req, res)=>{
    try{
        // CREATE a variable that will hold all data responded to us from mongo
        const departments = await Department.find()

        // show the response
        res.json(departments)
    }
    catch(err){
        res.status(500).json({Error : err.message})
    }
});

// get a single department
router.get("/:id",auth, async(req, res) =>{
    try{
        const department = await Department.findById(req.params.id)
        // check whether that department with the given id exists
        if(!department){
            return res.status(404).json({message : "Department not found"})
        }
        // if the department is there just give the datails of the department
        res.json(department)
    }
    catch(err){
        res.status(500).json({Error: err.message})
    }
});

//below is the update route for a department
router.put("/:id",auth, async(req, res)=>{
    try{
        // destrucute the different details you intend to update
        const {name, description, managerId} = req.body

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            {name, description, managerId, updatedAt: Date.now() },
            {new : true, runValidators : true}
        );

        // check whether the department you are trying to update is there or not
        if(!department){
            return res.status(404).json({message : "Department not found"})
        };

        // if the department is available for update, just return the new records
        res.json({message: "Department Details updated successfully", updatedDepartment : department})
    
    }
    catch(err){
        res.status(400).json({Error : err.message})
    }
});

// delete Department
router.delete("/:id",auth, async(req, res) =>{
    try{
        const department = await Department.findByIdAndDelete(req.params.id)

        // check whether the department exists or not
        if(!department){
            return res.status(404).json({message : "Department not found"})
        };

        // if the department id corresponds to one of the departments save inside of our database, proceed with deleting the department
        res.json({message : "Department Deleted Successfully"});
    }
    catch(err){
        res.status(500).json({Error : err.message})
    }
});



// export the route to make it accessible all over the application
module.exports = router;