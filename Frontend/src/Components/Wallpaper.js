import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';


// component for wallpaper containing location dropdown, restaurant search bar


class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            suggestions: [],
            inputText: undefined
        }
    }

    // function for getting click value, passing locId, get restaurants by locId , updating restaurants state 

    handleDDChange = (event) => {
        const locationId = event.target.value;                  /* value set in dd option values */
        sessionStorage.setItem('locationId', locationId);

        /* set session storage with location id , or sessionStorage.locId= locId*/

        axios({
            method: 'GET',
            url: `http://localhost:8478/restaurants/${locationId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {


                this.setState({ restaurants: response.data.restaurant })

            })
            .catch(err => console.log(err));
    }

    // function to check input text n give suggestions based on that from the restaurants, set states of suggestions, input text

    handleSearch = (event) => {
        const inputText = event.target.value;

        const { restaurants } = this.state;

        // includes return true if string contains a specified string, to lower case for typos as includes is case senstive

        const suggestions = restaurants.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));

        this.setState({ suggestions, inputText });
    }

    // on restaurant click, change url, go to restaurant details page

    selectingRestaurant = (resObj) => {
        this.props.history.push(`/details?restaurant=${resObj._id}`);
    }

    // show suggestion based on input text,fire details page on restaurant click

    showSuggestion = () => {
        const { suggestions, inputText } = this.state;

        if (suggestions.length == 0 && inputText == undefined) {
            return null;
        }
        if (suggestions.length > 0 && inputText == '') {
            return null;
        }
        if (suggestions.length == 0 && inputText) {
            return <ul>
                <li> No Search Results Found </li>
            </ul >
        }

        return (<ul> {

            suggestions.map((item, index) => (<li key={index}
                onClick={
                    () => this.selectingRestaurant(item)
                } > {`${item.name} -   ${item.locality},${item.city}`} </li>))
        } </ul>

        );



    }

    // destructuring props from Home ,

    render() {
        const { locationsData } = this.props;
        return (
            <div>
                { /* Adding Wallpaper  */} <
                    img src="./Assets/homepageimg.png"
                    width="100%"
                    height="450" />
                <div>

                    {/* Wallpaper content */}

                    <div className="logo" >
                        <p> e! </p>
                    </div >

                    <div className="headings" >
                        Find the best restaurants, cafes, bars
                    </div>

                    <div className="locationSelector" >
                        <select className="locationDropdown" onChange={this.handleDDChange} >
                            < option value="0" hidden> Select </option>
                            {
                                locationsData.map(item => {
                                    return <option value={item.location_id} > {`${item.name}, ${item.city}`} </option>
                                })
                            }
                        </select>
                        <div >
                            <span className="search" > </span>
                            <div id="notebooks" >
                                <
                                    input type="text"
                                    id="query"
                                    className="restaurantsinput"
                                    placeholder="Please Enter Restaurant Name"

                                    onChange={this.handleSearch}
                                />
                                {this.showSuggestion()}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

// use withRouter as Wallpaper is not part of main route path

export default withRouter(Wallpaper);