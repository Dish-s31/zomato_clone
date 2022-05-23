// importing the menuitems from the models

const Locations = require('../Models/Locations');


// Function for getting locations available

/*
FUNCTIONALITY:
1. Finding the locations in our collection.
3. Returning the response if  success else catching the error. 
*/


// find method like mongo find method gives collection data
exports.getLocations = (req, res) => {
    Locations.find()
        .then(response => {
            res.status(200).json({
                message: "Locations Fetched succesfully",
                locations: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};