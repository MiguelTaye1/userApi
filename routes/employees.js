const express = require("express");
const router = express.Router();
const {Employee, Department} = require("../models/model");


// import the middleware for authorization
const auth = require("../middleware/auth")


// create a new employee
router.post("/",auth, async(req, res)=>{
    try{
        // pick the details passed from the insomnia/postman
        const {email, departmentId} = req.body;
        // console.log(email, departmentId)

        // check whether the email address is already registered with another employee
        const existingEmail = await Employee.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message : "Email address already taken"})
        }

        // Check whether the department Id exists and whether is part of the departments
        const department = await Department.findById(departmentId);
        if(!department){
            return res.status(400).json({message : "Invalid Department ID"})
        };

        // if the validation happens, proceed to save an employee
        const employee = new Employee(req.body);
        await employee.save();

        // if the save functionality is successful, return a response
        res.status(201).json({message : "Employee registered successfully", "Employee" : employee})
    }
    catch(err){
        res.status(400).json({message : "Error experienced.", Error : err.message})
    }
});

// Below route is for viewing all the employees available
// Get all emlpoyees
router.get("/",auth,  async(req, res)=>{
    try{
        // find all the employees and put them in a variable
        const employees = await Employee.find().populate('userId', 'name email photo').populate('departmentId', 'name')

        res.json(employees)
    }
    catch(err){
        res.status(500).json({message : "Failed to fetch employees", "Error" : err.message})
    }
});


// fetch a single employee based on the id of the employee
router.get("/:id",auth, async(req, res)=>{
    try{
        // Test whether that given id exists inside of the db
        const employee = await Employee.findById(req.params.id)

        if(!employee){
            return res.status(404).json({message : "Employee not found"})
        }

        // if the employee exists, show the details
        res.json(employee);
    }
    catch(err){
        res.status(500).json({Error : err.message})
    }
});

// update given deatils of an employee
router.put("/:id",auth, async(req, res)=>{
    try{
        // pick the details passed on insomia/postman
        const {userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status} = req.body;

        // console.log(userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status)

        // validate department based on the departmentId passed/entered
        if(departmentId){
            const department = await Department.findById(departmentId);
            if(!department){
                return res.status(400).json({error : "Invalid Department ID"})
            }
        }
        // proceed if the department id is valid
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            {userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status, updatedAt : Date.now()},
            {new : true, runValidators : true}
        );

        if(!employee){
            return res.status(404).json({message : "Employee not found"})
        };

        // if the details are successfully updated, return a response with the new employees' details
        res.json(employee);

    }
    catch(err){
        res.status(400).json({Error : err.message})
    }
});




// Delete an employee
router.delete("/:id",auth, async (req, res)=>{
    try{
        // fetch the particular employee id
        const employee = await Employee.findByIdAndDelete(req.params.id);

        // check whether there is an employee with the given id
        if(!employee){
            return res.status(404).json({message : "Employee not found"})
        }

        // if the id is correct, you should proceed with deleting the employee
        res.json({message : "Employee Deleted Successfully"})
    }
    catch(err){
        res.status(500).json({Error : err.message})
    }
})



module.exports = router;