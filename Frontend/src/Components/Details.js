import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


// custom styles for modals

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown'
    },
};

// Details page component

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            restaurantId: undefined,
            menuItemsModalIsOpen: false,           /*for modals  */
            formsModalIsOpen: false,
            galleryModalIsOpen: false,
            menuItems: [],
            subTotal: 0,
            name: undefined,
            email: undefined,
            contact: undefined,
            address: undefined
        }
    }

    // find restaurant after mounting by the id from query,make api call to api, update restaurant, & id

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);  /*return object from qs */
        const { restaurant } = qs;

        axios({
            method: 'GET',
            url: `http://localhost:8478/restaurant/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurant, restaurantId: restaurant })
            })
            .catch(err => console.log(err));
    }

    // handle modal open/close

    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }

    // call api to get menuitems by rest. id & update menuItems state by setting menu items for this rest.


    GetMenuItems = () => {
        const { restaurantId } = this.state;
        axios({
            method: 'GET',
            url: `http://localhost:8478/menuitems/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ menuItems: response.data.menuItems })
            })
            .catch(err => console.log(err));
    }

    // add items in cart/ or delete after adding, calc total, update menuItems and total

    addItems = (index, operationType) => {
        let total = 0;
        // Spread Operator - Copy of Reference Types
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty++;
        }
        else {
            item.qty--;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value });
    }


    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:8478/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = (event) => {

        const { subTotal, email } = this.state;

        if (!email) {
            alert('Please fill this field and then Proceed...');
        }
        else {
            // Payment API Call 
            const paymentObj = {
                amount: subTotal,
                email: email
            };

            this.getData(paymentObj).then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
        event.preventDefault();
    }

    // render details page

    render() {
        const { restaurant, menuItemsModalIsOpen, formsModalIsOpen, galleryModalIsOpen, menuItems, subTotal } = this.state;
        return (
            // single container to return 

            <div>
                <div>
                    {/* add image of restaurant */}

                    <img src={`./${restaurant.image}`} alt="No Image, Sorry for the Inconvinience" width="100%" height="350px" />

                    {/* open gallery modal on click of image,update state */}

                    <button className="button" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
                </div>

                {/* display name of rest. and open menu cart modal, get items on click of place order btn */}

                <div className="heading">{restaurant.name}</div>
                <button className="btn-order" onClick={() => {
                    this.handleModal('menuItemsModalIsOpen', true)
                    this.GetMenuItems()
                }}>Place Online Order</button>

                {/* resturant info for cuisine,cost, radio tabs to toggle for contact tab */}
                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(cuisine => `${cuisine.name}, `)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>

                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">Address</div>
                            <div className="value">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>

                {/* modal of menu item cart */}

                <Modal
                    isOpen={menuItemsModalIsOpen}
                    style={customStyles}
                >
                    {/* parent container -modal */}
                    <div>

                        {/* X bootstrap close btn, update state*/}

                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></div>

                        {/* display content on modal, close onclick of pay btn, open form modal */}

                        <div >

                            {/* top portion, name, totAL, pay, close , opne/close modals*/}

                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total">SubTotal : {subTotal}</h3>
                            <button className="btn btn-danger order-button"
                                onClick={() => {
                                    this.handleModal('menuItemsModalIsOpen', false);
                                    this.handleModal('formsModalIsOpen', true);
                                }}> Pay Now</button>

                            {/*map items  and display info */}

                            {menuItems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>

                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>

                                        {/* container to display bottom data */}

                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>

                                            {/* left side column for name, price, description */}

                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <p className="item-descp">{item.description}</p>
                                                </span>
                                            </div>

                                            {/*  right side column, image,calc btns*/}

                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                <img className="card-img-center title-img" src={`../${item.image}`} style={{
                                                    height: '75px',
                                                    width: '75px',
                                                    borderRadius: '20px',
                                                    marginTop: '12px',
                                                    marginLeft: '3px'
                                                }} />
                                                {item.qty == 0 ? <div>
                                                    <button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                                </div> :

                                                    // add/subtract items, btns for -_+
                                                    <div className="add-number">
                                                        <button onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                        <span class="qty">{item.qty}</span>
                                                        <button onClick={() => this.addItems(index, 'add')}>+</button>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}

                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </div>
                </Modal>

                {/* form modal */}

                <Modal
                    isOpen={formsModalIsOpen}
                    style={customStyles}
                >
                    {/* parent container */}
                    <div>
                        {/* x close btn */}
                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('formsModalIsOpen', false)}></div>

                        {/* form for input, handle input */}
                        <form>
                            <label class="form-label">Name</label>
                            <input style={{ width: '370px' }} type="text" class="form-control" onChange={(event) => this.handleInputChange('name', event)} />
                            <label class="form-label">Email</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('email', event)} />
                            <label class="form-label">Contact Number</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('contact', event)} />
                            <label class="form-label">Address</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('address', event)} />
                            <button class="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={this.handlePayment}>Proceed</button>
                        </form>
                    </div>
                </Modal>

                {/* gallery modal  */}

                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles}
                >

                    {/* parent container */}

                    <div>
                        {/* close btn  */}

                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('galleryModalIsOpen', false)}></div>

                        {/* carousel for images */}
                        <Carousel
                            showIndicators={false}
                            showThumbs={false}>
                            {restaurant && restaurant.thumb && restaurant.thumb.map(item => {
                                return <div>
                                    <img height="350px" width="550px"
                                        src={`./${item}`} />
                                </div>
                            })}
                        </Carousel>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default Details;