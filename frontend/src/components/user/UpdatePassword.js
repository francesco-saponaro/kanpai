import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layouts/MetaData'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'

import { updatePassword, clearErrors } from '../../actions/userActions'

// We extract and assign the parameter props.history with just { history }
const UpdatePassword = ({ history }) => {

    // This useState hooks will set the old and new passwords value in the form below
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store userProfile with the useSelector hook
    const { error, isUpdated, loading } = useSelector(state => state.userProfile)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        if (error) {

            alert.error(error);
            dispatch(clearErrors());
        }

        // If the user password has been updated send success message and direct the user to its profile page
        if (isUpdated) {

            alert.success('Password updated successfully')

            history.push('/profile')

            // And finally reset the "isUpdated" variable to false since the user password 
            // has already been updated 
            dispatch({
                type: 'UPDATE_PASSWORD_RESET'
            })
        }

    }, [dispatch, alert, error, history, isUpdated])

    // This function will run on submitting the form
    // It will dispatch the updatePassword action function to the reducer with the form data
    // set below
    const submitHandler = (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);

        dispatch(updatePassword(formData))
    }

    return (
        <Fragment>
            <MetaData title={'Change Password'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/* Update password form */}
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Update Password</h1>

                        {/* Old password */}
                        <div className="form-group mb-3">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        {/* New password */}
                        <div className="form-group mb-3">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        {/* Submit button */}
                        <button 
                            type="submit" 
                            className="btn update-btn d-block w-100 py-3"
                            disabled={loading ? true : false} >
                                UPDATE PASSWORD
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdatePassword