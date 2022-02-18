import React, { Fragment, useEffect } from 'react'

// Import installed react MDBdatatable to display users below
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { allUsers, deleteUser, clearErrors } from '../../actions/userActions'

// Display all users
// We extract and assign the parameter props.history with just { history }
const UsersList = ({ history }) => {

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed.
    const dispatch = useDispatch();

    // We extract data from the state allUsers and user with the useSelector hook,
    // To be passed in the table below.
    const { loading, error, users } = useSelector(state => state.allUsers);
    const { isDeleted } = useSelector(state => state.userProfile)
    const { user: authenticatedUser } = useSelector(state => state.user)

    useEffect(() => {

        // We load the users as soon as the page loads
        dispatch(allUsers());

        if (error) {

            alert.error(error);
            dispatch(clearErrors())
        }

        // If isDeleted is true in the store, meaning the user was deleted successfully,
        // redirect the admin to the all users page, show the success alert and dispatch 
        // the DELETE_USER_RESET action which will reset the isDeleted
        // to false since at this point the order will have been deleted.
        if (isDeleted) {

            alert.success('User deleted successfully');
            history.push('/admin/users');
            dispatch({ type: 'DELETE_USER_RESET' })
        }

    }, [dispatch, alert, error, isDeleted, history])

    // This function will dispatch the delete user action on clicking the delete button
    // on the product table row.
    const deleteUserHandler = (id) => {

        dispatch(deleteUser(id))
    }

    // This function contains all orders data to pass in the react table below
    const setUsers = () => {

        const data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc',
                    width: 125
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 125
                },
            ],
            // Table rows data (to be pushed in)
            rows: []
        }

        // For each user push data in the table rows
        users.forEach(user => {
            
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: <Fragment>
                    <div className='d-flex'>
                        {/* We use "a" instead of "Link" here as we want to page to reload to reflect the 
                            updated data */}
                        <a href={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </a>
                        {/* Do not add delete button for authenticated user */}
                        {user._id !== authenticatedUser._id && 
                            <button className="btn btn-danger py-1 px-2 ms-2" onClick={() => deleteUserHandler(user._id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        }
                    </div>
                </Fragment>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">

                {/* Sidebar */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                {/* Display installed react table with the setUsers function above as data */}
                <div className="col-12 col-xl-10 px-4">
                    <Fragment>
                        <h1 className="my-5">All Users</h1>

                        {/* If users have been loaded */}
                        {loading === false && (
                            <MDBDataTable
                                data={setUsers()}
                                className="px-3"
                                bordered
                                striped
                                hover
                                scrollX
                            />
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default UsersList