import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layouts/MetaData'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'

import { resetPassword, clearErrors } from '../../actions/userActions'

// We extract and assign the parameter props.history with just { history }
// We extract and assign the parameter props.match with just { match } in order to 
// be used to capture URL keyword params, since this component will have the reset password
// token in its parameters
const NewPassword = ({ history, match }) => {

    // This useState hooks will set the user password and confirm password values in the form below
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store forgotPassword with the useSelector hook
    const { error, success } = useSelector(state => state.forgotPassword)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        if (error) {

            alert.error(error);
            dispatch(clearErrors());
        }

        // If there's a success response coming from the store, which indicates the password has
        // been reset, send an alert with a success message and redirect user to login page
        if (success) {

            alert.success('Password updated successfully')
            history.push('/login')
        }

    }, [dispatch, alert, error, success, history])

    // This function will run on submitting the form
    // It will dispatch the resetPassword action function to the reducer with the form data
    // set below and the reset password token taken from the component URL parameters
    const submitHandler = (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(match.params.token, formData))
    }

    return (
        <Fragment>
            <MetaData title={'Reset Password'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/* Reset password form */}
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">New Password</h1>

                        {/* Password */}
                        <div className="form-group mb-3">
                            <label htmlFor="password_field">Enter new password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group mb-3">
                            <label htmlFor="confirm_password_field">Confirm password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        
                        {/* Submit button */}
                        <button id="new_password_button" type="submit" className="btn d-block w-100 py-3" >SET PASSWORD</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default NewPassword