// importing the menuitems from the models

const MealTypes = require('../Models/MealTypes');


// Function for getting meal types avaialble as per the restaurant

/*
FUNCTIONALITY:
1. Finding the mealtypes in our collection.
3. Returning the response if  success else catching the error. 
*/

exports.getMealtypes = (req, res) => {
    MealTypes.find()
        .then(response => {
            res.status(200).json({
                message: "MealTypes Fetched succesfully",
                mealTypes: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};