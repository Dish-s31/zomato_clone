import React from "react";
import '../Styles/home.css';
import axios from "axios";

// Home component for wallpaper, quick search items rendering


import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';
class Home extends React.Component {
    constructor() {
        super();                            /* extending parent class constructor properties */
        this.state = {                      /* state variables initiliaze */
            locations: [],
            mealtypes: []
        }

    }

    // Making api calls to get values of  locations & mealtypes by axios after component mounting
    // Setting state of initiliazed variables

    componentDidMount() {
        sessionStorage.clear();
        axios({
            method: 'GET',
            url: 'http://localhost:8478/locations',
            headers: { 'Content-type': 'application/json' }
        })

            .then(response => {

                this.setState({ locations: response.data.locations })
            })
            .catch(err => console.log(err));

        axios({
            method: 'GET',
            url: 'http://localhost:8478/mealtypes',
            headers: { 'Content-type': 'application/json' }
        })
            .then(response => {

                this.setState({ mealtypes: response.data.mealTypes })
            })
            .catch(err => console.log(err));

    }

    // destructuring values from state,rendering components & passing props to child components

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <div>
                <Wallpaper locationsData={locations} />
                <QuickSearch mealtypesData={mealtypes} />
            </div>
        )
    }
}

export default Home;