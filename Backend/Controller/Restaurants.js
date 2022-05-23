// importing collection from models.

const Restaurants = require('../Models/Restaurants');

// Function for getting restaurants from the location id of the restaurant collection in db.

/*
FUNCTIONALITY:
1. Saving location id from request parameters(axios call) given by the frontend.
2. Using find(mongoose method) to check location id as per our database.
3. Returning the restaurants from our database based on the location id.
*/

exports.getRestaurantByLocId = (req, res) => {
    const { locId } = req.params;
    Restaurants.find({ location_id: locId })
        .then(response => {
            res.status(200).json({
                message: "Restaurants by location Fetched succesfully",
                restaurant: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};


// Function for getting restaurant details by the restaurant id of particular restaurant.

/*
FUNCTIONALITY:
1. Saving restaurant id in variable from the request parameters as supplied by frontend based on user click.
2. Finding the restaurant by id and returning the response else catching the error if any.
*/


exports.getRestaurantDetailsById = (req, res) => {
    const { resId } = req.params;
    Restaurants.findById(resId)
        .then(response => {
            res.status(200).json({
                message: "Restaurants by id Fetched succesfully",
                restaurant: response
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

// Filter Function to filter the restaurants based on user selection.

/*
FUNCTIONALITY:
1. Saving filter types in variables from request body(as multiple params so body) passed from client based on user click.
2. Finding the restuarants based on the filters applied by user.

*/


exports.restaurantsFilter = (req, res) => {

    let { mealtype, location, cuisine, lcost, hcost, sort, page } = req.body;

    // default sort ascend if value comes then descend(below line)

    sort = sort ? sort : 1;

    // if no page select in ui by user so ist page will be default page(below line)

    page = page ? page : 1;

    // variables for pagination (below two lines)

    const itemsPerPage = 2;

    let startIndex, endIndex;

    // making an object for filter types

    let filterObj = {};

    // if value is coming(user click) from frontend then only save the keys in the object

    mealtype && (filterObj['mealtype_id'] = mealtype);
    location && (filterObj['location_id'] = location);

    // $in(modb) as cuisine is an array if user select either any one of the cuisine show the results if present

    cuisine && (filterObj['cuisine_id'] = { $in: cuisine });
    lcost && hcost && (filterObj['min_price'] = { $lte: hcost, $gte: lcost });



    Restaurants.find(filterObj).sort({ min_price: sort })
        .then(response => {
            console.log(response)
            startIndex = page * itemsPerPage - itemsPerPage;
            endIndex = page * itemsPerPage;

            let paginatedResponse = response.slice(startIndex, endIndex);

            // page count
            let arr = [];
            for (let i = 1; i <= Math.ceil(response.length / itemsPerPage); i++) {
                arr.push(i);
            }

            res.status(200).json({
                message: "Filters applied succesfully",
                restaurant: paginatedResponse,
                totalItems: response.length,
                pageCount: arr,
                activePage: page

            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};