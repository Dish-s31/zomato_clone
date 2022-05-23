import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

// filter component 

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            mealtype: undefined,
            cuisine: [],
            location: undefined,
            lcost: undefined,
            hcost: undefined,
            sort: 1,
            page: 1,
            pageCount: []
        }
    }

    // call filter.location api's after mounting

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);  // "mealtype=1"  -->  {mealtype : 1}
        const { mealtype, location } = qs;

        const filterObj = {
            mealtype: Number(mealtype),
            location
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8478/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({
                    restaurants: response.data.restaurant, mealtype, location, pageCount: response.data.pageCount
                })
            })
            .catch(err => console.log(err));

        axios({
            method: 'GET',
            url: 'http://localhost:8478/locations',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ locations: response.data.locations })
            })
            .catch(err => console.log(err));
    }

    // sort change function

    handleSortChange = (sort) => {
        const { mealtype, location, cuisine, lcost, hcost, page } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length == 0 ? undefined : cuisine,

            location,
            hcost,
            lcost,
            page,
            sort
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8478/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, sort, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));
    }

    // radio button for price change

    handleCostChange = (lcost, hcost) => {
        const { mealtype, location, cuisine, sort, page } = this.state;
        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length == 0 ? undefined : cuisine,

            location,
            lcost,
            hcost,
            page,
            sort
        }
        axios({
            method: 'POST',
            url: 'http://localhost:8478/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({
                    restaurants: response.data.restaurant, lcost, hcost, pageCount: response.data.pageCount
                })
            })
            .catch(err => console.log(err));


    }

    // location change dropdown, make api call to location change

    handleLocationChange = (event) => {
        const location = event.target.value;

        const { mealtype, cuisine, lcost, hcost, page, sort } = this.state;
        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length == 0 ? undefined : cuisine,

            location,
            hcost,
            lcost,
            page,
            sort
        }
        axios({
            method: 'POST',
            url: 'http://localhost:8478/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({
                    restaurants: response.data.restaurant, location, pageCount: response.data.pageCount
                })
            })
            .catch(err => console.log(err));


    }

    // change cuisine checkbox, display restuarant based on cuisine

    handleCuisineChange = (cuisineId) => {

        const { mealtype, cuisine, location, lcost, hcost, page, sort } = this.state;


        const index = cuisine.indexOf(cuisineId);

        if (index >= 0) {
            cuisine.splice(index, 1);
        } else {
            cuisine.push(cuisineId);
        }


        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length == 0 ? undefined : cuisine,

            location,
            hcost,
            lcost,
            page,
            sort
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8478/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({
                    restaurants: response.data.restaurant, cuisine, pageCount: response.data.pageCount
                })
            })
            .catch(err => console.log(err));

    }

    // handle page change on user click

    handlePageChange = (page) => {

        const { mealtype, cuisine, location, lcost, hcost, sort } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            location,
            lcost,
            hcost,
            page,
            sort
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8478/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, page, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));
    }

    // own code reset functionality under work: issue => uncheck inputs on reset
    handleReset = () => {




        const { mealtype, cuisine, location, lcost, hcost, sort, page } = this.state;
        const filterObj = {
            mealtype: Number(mealtype),
            cuisine: undefined,
            location: undefined,
            lcost: undefined,
            hcost: undefined,
            page: undefined,
            sort, page
        }
        axios({
            method: 'POST',
            url: 'http://localhost:8478/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurant, page, pageCount: response.data.pageCount })
            })
            .catch(err => console.log(err));

    }

    // navigate to details page onclick of resaturants

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }

    // rendering filter page

    render() {
        const { restaurants, locations, pageCount } = this.state;
        return (
            <div>

                <div id="myId" className="heading">Breakfast Places in Mumbai</div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                            <div className="filter-heading">Filters / Sort</div>
                            <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                                data-target="#filter"></span>
                            <div id="filter" className="collapse show">

                                {/* location change jsx */}

                                <div className="Select-Location">Select Location</div>
                                <select className="Rectangle-2236" onChange={this.handleLocationChange}>
                                    <option value={0}>Select</option>
                                    {locations.map(item => {
                                        return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                    })}
                                </select>

                                {/* cuisine change jsx */}

                                <div className="Cuisine">Cuisine</div>
                                <div >
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(1)} />
                                    <span className="checkbox-items">North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                                    <span className="checkbox-items">South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                                    <span className="checkbox-items">Chineese</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                                    <span className="checkbox-items">Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                                    <span className="checkbox-items">Street Food</span>
                                </div>

                                {/* price range jsx */}

                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                    <span className="checkbox-items">Less than &#8377; 500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                    <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                    <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                    <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 50000)} />
                                    <span className="checkbox-items">&#8377; 2000 +</span>
                                </div>

                                {/* Sort change radio buttons */}

                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(1)} />
                                    <span className="checkbox-items">Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(-1)} />
                                    <span className="checkbox-items">Price high to low</span>
                                </div>
                                <input type="reset" name="reset" value="Reset" onClick={() => this.handleReset()} />
                                <span className="checkbox-items">reset</span>

                            </div>
                        </div>

                        {/* available restaurants display jsx */}

                        <div className="col-sm-8 col-md-8 col-lg-8">

                            {restaurants.length > 0 ? restaurants.map(item => {
                                return <div className="Item" onClick={() => this.handleNavigate(item._id)}>

                                    {/* display restaurant info on filter page  */}

                                    <div>
                                        <div className="small-item vertical">
                                            <img className="img" src={`./${item.image}`} />
                                        </div>
                                        <div className="big-item">
                                            <div className="rest-name">{item.name}</div>
                                            <div className="rest-location">{item.locality}</div>
                                            <div className="rest-address">{item.city}</div>
                                        </div>
                                    </div>
                                    <hr />

                                    {/* cuisine and cost for two info */}

                                    <div>
                                        <div className="margin-left">
                                            <div className="Bakery">CUISINES : {item.cuisine.map(cuisine => `${cuisine.name}, `)}</div>
                                            <div className="Bakery">COST FOR TWO : &#8377; {item.min_price}</div>
                                        </div>
                                    </div>
                                </div>
                            })

                                // no records in case no restaurant available

                                : <div className='no-records'>
                                    No records found
                                </div>}

                            {/* pagination jsx */}

                            {
                                restaurants.length > 0 ? <div className="pagination">
                                    <span className='page-number'>&laquo;</span>
                                    {pageCount.map(item => {
                                        return <span className='page-number' onClick={() => this.handlePageChange(item)}>{item}</span>
                                    })}
                                    <span className='page-number'>&raquo;</span>
                                </div> : null
                            }



                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Filter;