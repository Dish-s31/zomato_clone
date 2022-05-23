// importing collection from models.

const Orders = require('../Models/Orders');

// Function for saving order details as done by user

/*
FUNCTIONALITY:
1. Saving order details in variables as getting from request body by the frontend.
2. Making object(document) of Orders collection as in our database.
3. Mongoose save method to save the order details in the collection.
4. Returning the response if success else catching the error.

*/

exports.saveOrderDetails = (req, res) => {

    let { placedBy, placedByUserId, placedOn, items, Amount, restaurantId } = req.body;
    let ordersObj = new Orders({
        placedBy,
        placedByUserId,
        placedOn,
        items,
        Amount,
        restaurantId
    });

    ordersObj.save()
        .then(response => {
            res.status(200).json({
                message: "orders added succesfully",
                orders: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

// Function for getting the order details by the userId who previously ordered.

/*
FUNCTIONALITY: 
1. Saving the user id in variables as getting from request params by the frontend.
2. Finding the user order by the user id as in our database.
3. Returning the response if orders found else catching the error.

*/

exports.getOrdersByUserId = (req, res) => {

    const { userId } = req.params;
    Orders.find({ placedByUserId: userId })
        .then(response => {
            res.status(200).json({
                message: "Orders Fetched succesfully",
                orders: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};