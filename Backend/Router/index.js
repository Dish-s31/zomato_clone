const express = require('express');

const route = express.Router();

const locationController = require('../Controller/Locations');
const mealtypeController = require('../Controller/MealTypes');
const restaurantController = require('../Controller/Restaurants');
const userController = require('../Controller/Users');
const menuItemsController = require('../Controller/MenuItems');
const ordersController = require('../Controller/Orders');
const paymentGatewayController = require('../Controller/Payments');


route.get('/locations', locationController.getLocations);
route.get('/mealtypes', mealtypeController.getMealtypes);
route.get('/restaurants/:locId', restaurantController.getRestaurantByLocId);
route.post('/userlogin', userController.userLogin);
const newLocal = '/usersignup';
route.post(newLocal, userController.userSignUp);

route.get('/restaurant/:resId', restaurantController.getRestaurantDetailsById);
route.get('/menuitems/:resId', menuItemsController.getMenuItemsByRes);
route.post('/order', ordersController.saveOrderDetails);
route.get('/orders/:userId', ordersController.getOrdersByUserId);
route.post('/filter', restaurantController.restaurantsFilter);
route.post('/payment', paymentGatewayController.payment);
route.post('/callback', paymentGatewayController.callback);



module.exports = route;