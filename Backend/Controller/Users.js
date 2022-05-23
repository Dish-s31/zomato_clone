// importing collection from models to authenticate and save new user details

const Users = require('../Models/Users');

// LOGIN function to check user login details with the saved details in the database

/* FUNCTIONALITY: 
1. collecting username,password from request body by frontend in variables.
2. finding the credentials in database by mongoose method(find).
3. if response sent back by database is not empty so authenticating user and returning the response.
*/


exports.userLogin = (req, res) => {
    const { user, pwd } = req.body;
    Users.find({ username: user, password: pwd })
        .then(response => {
            let msg, auth;
            if (response.length == 0) {

                msg = "user not authenticated succesfully";
                auth = false;
            } else {

                msg = "user authenticated succesfully";
                auth = true;
            }
            res.status(200).json({
                message: msg,
                user: response,
                isAuthenticated: auth
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

// SIGNUP function for saving new user credentials in the database

/*
FUNCTIONALITY:
 1. Collecting username,password,firstname and lastname from request body by frontend in variables.
2. Making an object(user info) of Users collection(own db).
3. Mongoose save method to save user credentials in the Users collection in the db.
4. returning message if added succesfully else displaying error
*/


exports.userSignUp = (req, res) => {
    let { user, pwd, fn, ln } = req.body;

    let userObj = new Users({
        username: user,
        password: pwd,
        firstName: fn,
        lastName: ln
    });

    // save return obj and it will be in response var
    userObj.save()
        .then(response => {
            res.status(200).json({
                message: "User added succesfully",
                user: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};