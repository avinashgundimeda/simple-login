 const express = require('express');
 const router = express.Router();
const User = require('../models/user');

 const bcrypt = require('bcrypt');


 router.post('/signup', (req, res) => {
    let {  name, lastname, email, password, number } = req.body;
    name = name.trim();
    lastname = lastname.trim();
    email = email.trim();
    password = password.trim();
    number = number.trim();


 if( name == "" || lastname == "" || email == "" || password == "" || number == ""){
    res.json({
        status: "FAILED",
        message: "Empty input fields!"
    });
 } else if (!/^[a-zA-Z]+$/.test(name) || !/^[a-zA-Z]+$/.test(lastname)) {
    res.json({
        status: "FAILED",
        message: "Invalid name or lastname entered"
    });
 } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
        status: "FAILED",
        message: "Invalid email entered"
    });
 } else if (password.length < 8) {
    res.json({
        status: "FAILED",
        message: "Password is too short!"
    });
 } else if (!/^\d{2,3}-?\d{6,}$/.test(number)) {
    res.json({
        status: "FAILED",
        message: "Invalid number entered"
    });

    ///checking for same email present
 } else {
        User.find({ email}).then(result => {
             if(result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists!"
                });
             } else {
                const saltRounds = 10; 
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        lastname,
                        email,
                        password: hashedPassword,
                        number
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful!",
                            data: result
                        });
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while saving user account!"
                        });
                    });  
                }
                )
             }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            });
        });
 }
 });


///login
 router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim(); 

    if( email == "" || password == "" ){
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied!"
        });
     } else {
        User.find({ email})
        .then(data => {
            if(data.length) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Login successful!",
                            data: data
                        }); 
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        });
                    }
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while comparing passwords!"
                    });
                });
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!"
                });
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            });
        });
     }
 });

 module.exports = router; 