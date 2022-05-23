// importing the menuitems from the models

const MenuItems = require('../Models/MenuItems');

// Function for getting menu items by the restaurant

/*
FUNCTIONALITY:
1. Saving the restaurant id in variables from the request parameters by the frontend.
2. Finding the menuItems in our collection from the id requested.
3. Returning the response if  success else catching the error. 
*/

exports.getMenuItemsByRes = (req, res) => {
    const { resId } = req.params;
    MenuItems.find({ restaurantId: resId })
        .then(response => {
            res.status(200).json({
                message: "menu items by id Fetched succesfully",
                menuItems: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};