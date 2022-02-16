import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

import MetaData from '../layouts/MetaData'

const Profile = () => {

    // We extract data from the store state user with the useSelector hook
    const { user, loading } = useSelector(state => state.user)

    let capitalizedName = []

    for(let word of user.name.split(" ")) {
        capitalizedName.push(word.charAt(0).toUpperCase() + word.slice(1))
    }

    return (
        <Fragment>
            {loading === false && (
            <Fragment>
                <MetaData title={'My Profile'} />

                <h2 className="mt-5 text-center">{capitalizedName.join(" ")} Profile</h2>
                <div className="row justify-content-around mt-5 user-info mx-4 mx-md-0">

                    {/* User avatar and edit profile button */}
                    <div className="col-12 col-md-3 text-center mb-4">
                        <figure className='avatar avatar-profile'>
                            <img className="rounded-circle img-fluid" src={user.avatar.url} alt={user.name} />
                        </figure>
                    </div>

                    {/* User details */}
                    <div className="col-12 col-md-5 mb-5">
                        <h4>Full Name</h4>
                        <p>{capitalizedName.join(" ")}</p>

                        <h4>Email Address</h4>
                        <p>{user.email}</p>

                        <h4>Joined On</h4>
                        
                        {/* Only get first 10 chars of date field */}
                        <p>{String(user.createdAt).substring(0, 10)}</p>

                        {/* Action buttons */}
                        <div className="d-grid">
                            {/* If user is not an admin display its orders */}
                            {user.role !== 'admin' && (
                                <Link to="/orders/profile" className="btn btn-danger btn-block mt-5 w-50">
                                    My Orders
                                </Link>
                            )}

                            {/* Edit profile */}
                            <Link to="/profile/update" id="edit_profile" className="btn btn-primary btn-block mt-3 w-50">
                                Edit Profile
                            </Link>

                            {/* Change password link */}
                            <Link to="/password/update" className="btn btn-primary btn-block mt-3 w-50">
                                Change Password
                            </Link>
                        </div>
                    </div>
                </div>
            </Fragment>
            )}
        </Fragment>
    )
}

export default Profile