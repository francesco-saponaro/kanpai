import React, { Fragment, useState, useEffect } from 'react'

// We import the react router Link components to use instead of anchor links
// as unlike <a> it will redirect to another page without reloading the page
import { Link } from 'react-router-dom'

import MetaData from './../layouts/MetaData'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux';

import { login, clearErrors } from '../../actions/userActions';

// We extract and assign the parameter props.history and props.location with just { history, location }
const Login = ({history, location}) => {

    // This useState hooks will set the state of each of them onChanging their value in the form below
    // They will both be passed in the login action function below 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store user with the useSelector hook,
    // To be passed in the front end and useEffect hook below
    const { error, isAuthenticated, loading, user } = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.cart)

    // Check if there is a location.search prop in the URL and if so redirect the user to it
    // Otherwise redirect to the home page
    const redirect = location.search ? location.search.split('=')[1] : '/'

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        // If user is logged in he will be redirected to the either the home page or shipping page
        // depending on if there is a location.search prop in the URL
        if(isAuthenticated) {

            // Check if any of the cartItems in the local storage have a user ID corresponding
            // to the ID of the user just logged in. If not remove the items from local storage.
            // First though check that some of the items dont have a "not authenticated" value for the user
            // as if they all have it would recognise the second condition as true anyway.
            // Also reload the page when redirecting as we want to show the updated cart, which will
            // be empty. However wait one second since we want to give the alert.success time to show.
            if(cartItems.some(item => item.user !== "not authenticated")) {
                if(cartItems.some(item => item.user._id !== user._id)) {
                    localStorage.removeItem('cartItems')
                    history.go()
                }
            }

            history.push(redirect)

            alert.success('Logged in successfully.');
        }
        
        // If there is an error show alert from the react-alert package
        if(error) {

            // Don't show the error alert if its equal to the below text, since this error is generated
            // by the loadUser action that loads from the app and therefore on every page, but it is
            // irrelevant in the login page
            if(error !== 'Login to access this page') {

                alert.error(error);
            }

            dispatch(clearErrors());
        }

        // We can also add all data that we want to watch in an array as a second parameter
        // So whenever there is a change in any of the parameters below the useEffect hook will
        // be called
    }, [dispatch, alert, error, isAuthenticated, history, redirect])

    // This function will run on submitting the form
    // It will dispatch the login action function to the reducer with the email and 
    // password parameters from the state
    const submitHandler = (e) => {

        e.preventDefault();
        dispatch(login(email,password))
    }

    return (
        <Fragment>
            {loading === false && (
            <Fragment>
                <MetaData title={'Login'}/>
                <div className="row wrapper"> 
                    <div className="col-10 col-lg-5">

                        {/* Login form */}
                        <form className="shadow-lg" onSubmit={submitHandler}>
                            <h1 className="mb-3">Login</h1>
                            
                            {/* Email */}
                            <div className="form-group mb-3">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                
                            {/* Password */}
                            <div className="form-group mb-3">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type="password"
                                    id="password_field"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Forgot password link */}
                            <Link to="/password/forgot" className="float-end mb-4 text-decoration-none">Forgot Password?</Link>
                
                            {/* Submit button */}
                            <button
                                id="login_button"
                                type="submit"
                                className="btn d-block w-100 py-3"
                                >
                                LOGIN
                            </button>

                            {/* Register link */}
                            <Link to="/register" className="float-end pb-3 mt-3 text-decoration-none">New User?</Link>
                        </form>
                    </div>
                </div>
            </Fragment>
            )}
        </Fragment>
    )
}

export default Login