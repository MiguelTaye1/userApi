//What is schema?
//Schema usually specifies the different details of the data that we want to store in the database.
//import mongoose library that will help us to connect to the database
const mongoose = require('mongoose');

//create a schema for the employee from the mongoose library
const Schema = mongoose.Schema;

//we shall create 3 schemas for 3 collections i.e Employeeschema, Departmentschema, and Userschema

//user schema
const Userschema = new Schema({
    name: String,
    email: {type: String, unique: true, required: true},
    dob: {type: Date, default: Date.now},
    password: {type: String, required: true},
    photo: String
});

//employee schema
const Employeeschema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', default: null},
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    departmentId: {type: Schema.Types.ObjectId, ref: 'Department', required: true},
    jobTitle: String,
    hireDate: String,
    salary:  Number,
    status: {type: String, enum: ['active', 'inactive','on_leave'], default: 'active'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

//department schema
const Departmentschema = new Schema({
    name: {type: String, unique: true, required: true},
    description: String,
    managerId: {type: Schema.Types.ObjectId, ref: 'Employee', default: null},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
   

});

//make them accessible through the application by exporting them
const User = mongoose.model('User', Userschema);
const Employee = mongoose.model('Employee', Employeeschema);
const Department = mongoose.model('Department', Departmentschema);

//export all of them 
module.exports = {
    User,
    Employee,
    Department
};