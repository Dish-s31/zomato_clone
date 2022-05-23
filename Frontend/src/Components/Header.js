import React from 'react';
import '../Styles/header.css';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import axios from 'axios';





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

const accountStyle = {
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

// header component

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            isLoggedIn: false,
            user: "",
            pwd: "",
            fn: undefined,
            ln: undefined,
            accountCreateIsOpen: false,


        }
    }

    // navigate to home page onclick of logo

    handleNavigate = () => {
        this.props.history.push('/');
    }

    // set state of login modal 

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }

    // set state of account creation form

    createAccount = () => {
        this.setState({ accountCreateIsOpen: true });
    }

    // input change for login,account create
    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value });
    }

    // call api to save new user info in db

    handleSignup = (event) => {
        const { user, pwd, fn, ln } = this.state;

        const userObj = {
            user: user,
            pwd: pwd,
            fn: fn,
            ln: ln
        };
        axios({
            method: "POST",
            url: "http://localhost:8478/usersignup",
            headers: { 'Content-Type': 'application/json' },
            data: userObj
        })
            .then((response) => {
                alert(`${response.data.message} , please login to continue`);
                this.setState({
                    userName: response.data.user.username,
                    isLoggedIn: false,
                    accountCreateIsOpen: false
                });
            })

            .catch(err => console.log(err))
        event.preventDefault();
    }




    // call api to authenticate user info from db

    handleSignIn = (event) => {
        const { user, pwd } = this.state;
        const userObj = {
            user: user,
            pwd: pwd
        };
        axios({
            method: "POST",
            url: "http://localhost:8478/userlogin",
            headers:
                { 'Content-Type': 'application/json' },
            data: userObj

        }).then((response) => {

            this.setState({
                userName: response.data.user[0].username,
                isLoggedIn: response.data.isAuthenticated,
                loginModalIsOpen: false
            });

            // localStorage.setItem('logindata', JSON.stringify(response.data.response[0]))
        })
            .catch(err => console.log(err))
        event.preventDefault();
    }


    // set open/close states of modals

    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }


    // google function to set the response.close login modal,set username to response name

    responseGoogle = (response) => {
        console.log(response);
        this.setState({ isLoggedIn: true, userName: response.profileObj.name, loginModalIsOpen: false });
    }

    // onclick of btn logout user, set username to undefined, user login to false

    handleLogout = () => {
        this.setState({ isLoggedIn: false, userName: undefined, loginModalIsOpen: false });

    }

    // render header component

    render() {
        const { loginModalIsOpen, isLoggedIn, userName, accountCreateIsOpen } = this.state;
        return (
            < div className="header">
                <div className="header-logo" onClick={this.handleNavigate}>
                    <p>e!</p>
                </div>
                {
                    // if logged in show name,logout else login,signup
                    !isLoggedIn ?

                        <div className="user-account">
                            <div className="login" onClick={this.handleLogin}>
                                Login

                            </div>
                            <div className="signup" onClick={this.createAccount}>Create an Account</div>
                        </div>
                        :

                        <div className="user-account">
                            <div className="login" >
                                {userName}
                            </div>
                            <div className="signup" onClick={this.handleLogout}>Logout</div>
                        </div>
                }

                {/* modal for login,n social login */}

                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        {/* <button className='btn btn-primary'>Login with Credentials</button> */}
                        <br />

                        <div>
                            <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                                onClick={() => this.handleModal('loginModalIsOpen', false)}></div>
                            <form>
                                <label class="form-label">Username</label>

                                <input type="text" class="form-control" placeholder='enter your username' onChange={(event) => this.handleInputChange('user', event)} />

                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" placeholder='enter your password' onChange={(event) => this.handleInputChange('pwd', event)} />
                                <button class="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={(e) => this.handleSignIn(e)} >Sign in</button>
                            </form>
                        </div>
                        <GoogleLogin
                            clientId="468263661348-t2l94sjrhmilda9dhf5i6juk3uv0onvh.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />

                    </div>
                </Modal>

                {/* account creation modal */}

                <Modal
                    isOpen={accountCreateIsOpen}
                    style={customStyles}
                >

                    <div>
                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('accountCreateIsOpen', false)}></div>
                        <form>
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" placeholder='enter your email' onChange={(event) => this.handleInputChange('user', event)} />
                            <label class="form-label">Firstname</label>
                            <input type="text" class="form-control" placeholder='enter your firstname' onChange={(event) => this.handleInputChange('fn', event)} />
                            <label class="form-label">Lastname</label>
                            <input type="text" class="form-control" placeholder='enter your lastname' onChange={(event) => this.handleInputChange('ln', event)} />


                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" placeholder='enter your password' onChange={(event) => this.handleInputChange('pwd', event)} />
                            <button class="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={(e) => this.handleSignup(e)} >Create my Account</button>
                        </form>
                    </div>
                </Modal>


            </div >
        )
    }
}
export default withRouter(Header);