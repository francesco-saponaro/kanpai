import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layouts/MetaData'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'

import { forgotPassword, clearErrors } from '../../actions/userActions'

const ForgotPassword = () => {

    // This useState hooks will set the user email value in the form below
    const [email, setEmail] = useState('')

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store forgotPassword with the useSelector hook
    const { error, loading, message } = useSelector(state => state.forgotPassword)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        if (error) {

            alert.error(error);
            dispatch(clearErrors());
        }

        // If there's a message in the store, which informs the user the password reset URL email 
        // was sent successfully, send an alert with the message
        if (message) {

            alert.success(message)
        }

    }, [dispatch, alert, error, message])

    // This function will run on submitting the form
    // It will dispatch the updatePassword action function to the reducer with the form data
    // set below
    const submitHandler = (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.set('email', email);

        dispatch(forgotPassword(formData))
    }

    return (
        <Fragment>
            <MetaData title={'Forgot Password'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/* Update password form */}
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Forgot Password</h1>

                        {/* Email */}
                        <div className="form-group mb-3">
                            <label htmlFor="email_field">Enter email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        
                        {/* Submit button */}
                        <button 
                            id="forgot_password_button" 
                            type="submit" 
                            className="btn d-block w-100 py-3"
                            disabled={loading ? true : false} >
                                SEND EMAIL
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default ForgotPassword