// Authentication reducer
export const userReducer = (state = { user: {} }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch(action.type) {

        // If this action type dispatched we set the authentication to false
        case 'LOGIN_REQUEST':
        case 'REGISTER_USER_REQUEST':
        case 'LOAD_USER_REQUEST':
            return {
               loading: true,
               isAuthenticated: false
            }

        // If this action type dispatched we return the state, set the authentication
        // to true and set the user state object to the action payload
        case 'LOGIN_SUCCESS':
        case 'REGISTER_USER_SUCCESS':
        case 'LOAD_USER_SUCCESS':
            return {
               ...state,
               loading: false,
               isAuthenticated: true,
               user: action.payload
            }

        // If this action type dispatched we set the user state object to null and set the authentication
        // to false
        case 'LOGOUT_SUCCESS':
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
            }

        // If this action type dispatched we get the error returning from the action payload,
        // return the state, set the authentication to false and set the user state object to null
        case 'LOAD_USER_FAIL':
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        // If this action type dispatched we return the state and set the error to the action payload
        case 'LOGOUT_FAIL':
            return {
                ...state,
                error: action.payload
            }

        // If this action type dispatched we get the error returning from the action payload,
        // return the state, set the authentication to false and set the user state object to null
        case 'LOGIN_FAIL':
        case 'REGISTER_USER_FAIL':
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        // If this action type dispatched since we just want to clear the errors,
        // we simply return the state array and set the errors to null
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

// Update user profile reducer
export const userProfileReducer = (state = {}, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'UPDATE_PROFILE_REQUEST':
        case 'UPDATE_PASSWORD_REQUEST':
        case 'UPDATE_USER_REQUEST':
        case 'DELETE_USER_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we return the state, set the isUpdated
        // to variable to the action.payload which would be true or false
        case 'UPDATE_PROFILE_SUCCESS':
        case 'UPDATE_PASSWORD_SUCCESS':
        case 'UPDATE_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        // If this action type dispatched we return the state, set the isDeleted
        // to variable to the action.payload which would be true or false
        case 'DELETE_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        // If this action type dispatched we return the state, set the isUpdated
        // to false since at this point the user password or profile has already been updated 
        case 'UPDATE_PROFILE_RESET':
        case 'UPDATE_PASSWORD_RESET':
        case 'UPDATE_USER_RESET':
            return {
                ...state,
                isUpdated: false
            }

        // If this action type dispatched we return the state, set the isDeleted
        // to false since at this point the user password or profile has already been deleted 
        case 'DELETE_USER_RESET':
            return {
                ...state,
                isDeleted: false
            }

        // If this action type dispatched we get the error returning from the action payload,
        // and return the state
        case 'UPDATE_PROFILE_FAIL':
        case 'UPDATE_PASSWORD_FAIL':
        case 'UPDATE_USER_FAIL':
        case 'DELETE_USER_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // If this action type dispatched since we just want to clear the errors,
        // we simply return the state array and set the errors to null
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

// Reset forgotten password reducer
export const forgotPasswordReducer = (state = {}, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state and set the error to null
        case 'FORGOT_PASSWORD_REQUEST':
        case 'NEW_PASSWORD_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            }

        // If this action type dispatched we return the state, and the message equal
        // to the "email sent" success message returning from the action payload
        case 'FORGOT_PASSWORD_SUCCESS':
            return {
                ...state,
                loading: false,
                message: action.payload
            }

        // If this action type dispatched we return the state, and the success response
        // returning from the action payload
        case 'NEW_PASSWORD_SUCCESS':
            return {
                ...state,
                success: action.payload
            }

        // If this action type dispatched we get the error returning from the action payload,
        // and return the state
        case 'FORGOT_PASSWORD_FAIL':
        case 'NEW_PASSWORD_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // If this action type dispatched since we just want to clear the errors,
        // we simply return the state array and set the errors to null
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

// All users reducer - ADMIN
export const allUsersReducer = (state = { users: [] }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'ALL_USERS_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we set the users to the action payload
        case 'ALL_USERS_SUCCESS':
            return {
                ...state,
                loading: false,
                users: action.payload
            }

        // If this action type dispatched we set the error to the action payload
        case 'ALL_USERS_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // If this action type dispatched since we just want to clear the errors,
        // we simply return the state array and set the errors to null
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

// User details reducer - ADMIN
export const userDetailsReducer = (state = { user: {} }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'USER_DETAILS_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we set the user to the action payload
        case 'USER_DETAILS_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload
            }

        // If this action type dispatched we set the error to the action payload
        case 'USER_DETAILS_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
            
        // If this action type dispatched since we just want to clear the errors,
        // we simply return the state array and set the errors to null
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

