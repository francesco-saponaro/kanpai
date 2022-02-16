import React, { Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useSelector } from 'react-redux'

// We get the whichever component the route has props with "Component" and also
// "exact" and "path"/profile"" with "...rest" (See App.js)  
const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {

    // We extract data from the store state user with the useSelector hook
    const { isAuthenticated, loading, user } = useSelector(state => state.user)

    return (
        <Fragment>
            {loading === false && (
                <Route

                    // So we extract the "exact" and "path"/profile"" with "...rest"
                    {...rest}

                    // And then we have to decide which component we want to render
                    // props equals whatever is passed above so in this case "component: Component"
                    // So if the user is logged out we want to redirect it to the login page
                    render={props => {

                        if (isAuthenticated === false) {

                            return <Redirect to='/login' />
                        }

                        // If the user is not an admin when on admin route, redirect to home page
                        if (isAdmin === true && user.role !== 'admin') {
                            
                            return <Redirect to="/" />
                        }

                        // Else we render the component passed above as props 
                        return <Component {...props} />
                    }}
                />
            )}
        </Fragment>
    )
}

export default ProtectedRoute