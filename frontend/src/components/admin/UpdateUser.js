import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { updateUser, getUserDetails, clearErrors } from '../../actions/userActions'

// Update user
// We extract and assign the parameter props.match and props.history with just { history, match }
const UpdateUser = ({ history, match }) => {

    // These useState hooks will set the name, email and role states onChanging their value in the form below
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed.
    const dispatch = useDispatch();

    // We extract data from the state userDetails and user with the useSelector hook,
    // To be passed in the front-end below
    const { user } = useSelector(state => state.userDetails)
    const { error, isUpdated } = useSelector(state => state.userProfile);

    // Get userId from the URL
    const userId = match.params.id;

    useEffect(() => {

        // We check if the user exists and that the user._id
        // matches the user ID in the URL, if it doesnt get the user details using the ID in the URL.
        if (user && user._id !== userId) {

            dispatch(getUserDetails(userId))
        } else {

            setName(user.name);
            setEmail(user.email);
            setRole(user.role)
        }

        if (error) {

            alert.error(error);
            dispatch(clearErrors());
        }

        // If isUpdated is true in the store, meaning the user was updated successfully,
        // redirect the admin to the all users page, show the success alert and dispatch 
        // the UPDATE_USER_RESET action which will reset the isUpdated
        // to false since at this point the user will have been Updated.
        if (isUpdated) {

            history.push('/admin/users')
            alert.success('User updated successfully')
            dispatch({
                type: 'UPDATE_USER_RESET'
            })
        }

    }, [dispatch, alert, error, history, isUpdated, userId, user])

    // This function will dispatch the update user action with the formData from the form below 
    // on clicking its update button.
    const submitHandler = (e) => {
        
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);

        dispatch(updateUser(user._id, formData))
    }

    return (
        <Fragment>
            <MetaData title={`Update User`} />
            <div className="row">

                {/* Sidebar */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-xl-10">
                    <div className="row wrapper">

                        {/* Update user form */}
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mt-2 mb-5">Update User</h1>

                                {/* User name */}
                                <div className="form-group mb-3">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="name"
                                        id="name_field"
                                        className="form-control"
                                        name='name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {/* User email */}
                                <div className="form-group mb-3">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {/* User role */}
                                <div className="form-group mb-3">
                                    <label htmlFor="role_field">Role</label>
                                    <select
                                        id="role_field"
                                        className="form-control"
                                        name='role'
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>

                                {/* Submit button */}
                                <button type="submit" className="update-btn btn d-block w-100 py-3" >Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateUser