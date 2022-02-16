import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../actions/userActions';

import Search from './Search'

import '../../App.css'

const Header = () => {

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the state user with the useSelector hook,
    // To be passed in the front end below
    const { user, loading } = useSelector(state => state.user)

    // We extract the cart items from the store cart state to use the length of
    // the cart items in the header shopping bag icon
    const { cartItems } = useSelector(state => state.cart)

    // This function will dispatch the logout action to the reducer in order to log user out
    const logoutHandler = () => {

        dispatch(logout());
        alert.success('Logged out successfully.')
    }

    return (
        // Fragment is just an empty tag used to wrap elements
        // It wont appear in the HTML document
        <Fragment>
            <nav className="navbar row px-sm-4 ms-0"> 

                {/* Nav brand */}
                <div className="col-8">
                    <div className="navbar-brand">
                        <Link to="/">
                            <h1>Kanpai</h1>
                        </Link>
                    </div>
                </div>

                {/* Nav links */}
                <ul className="col-4 d-flex justify-content-end align-items-center list-unstyled text-end mb-0 pe-0">

                     {/* Search button collapsible */}
                    <li className="d-inline-flex">
                        <button className="navbar-toggler nav-link py-1 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="icon">
                                <i className="fas fa-search"></i>
                            </span>
                        </button>
                    </li>

                    {/* Shopping bag */}
                    <li className="d-inline-flex">
                        <Link to="/cart" className="nav-link">
                            <div className="text-center">
                                <p className="my-0 d-flex align-items-baseline">
                                    <i className="fas fa-shopping-bag"></i> 
                                    <span className="ms-1">{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)}</span>
                                </p>
                            </div>
                        </Link>
                    </li>

                    {/* Log in or User profile */}
                    {/* User profile */}
                    {user ? (
                        <div className="d-inline-flex dropdown">

                            {/* Avatar dropdown toggle */}
                            <Link to="/" className="nav-link dropdown-toggle me-md-4" type="button"
                            id="dropDownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                                <figure className="avatar avatar-nav">
                                    <img 
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                            </Link>

                            {/* Dropdown menu */}
                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                                {user && user.role === 'admin' && (
                                    <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                                )}
                                <Link className="dropdown-item" to="/orders/profile">Orders</Link>
                                <Link className="dropdown-item" to="/profile">Profile</Link>
                                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                                    Logout
                                </Link>

                            </div>
                        </div>
                        
                    ) : loading === false && 
                        // Log in link
                        <li className="d-inline-flex">
                            <Link to="/login" className="nav-link ms-sm-2" id="login_btn">
                                <i className="fas fa-sign-in-alt"></i>
                            </Link>
                        </li>
                    }
                </ul>
    
                {/* Search form input */}
                <div className="collapse" id="navbarToggleExternalContent">
                    {/* Destructure and pass in the function the react-router history object 
                    which is used to redirect to another URL */}
                    {/* In the function return the Search component with the history object 
                    as props */}
                    {/* We have to use render because unlike the Home component for example
                    it is not imported in the app (see App.js) */}
                    <Route render={({ history }) => <Search history={history} />} />
                </div>
            </nav>
        </Fragment>
    )
}

export default Header