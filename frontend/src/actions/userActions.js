import axios from 'axios';

// This function will dispatch actions to POST the user log in details to the backend
// in order to login, it takes the email and password as parameters.
export const login = (email, password) => async (dispatch) => {

    try {

        // We first dispatch the LOGIN_REQUEST action type, which 
        // will set the authentication to false.
        dispatch({ type: 'LOGIN_REQUEST' })

        // Then we set the config variable to be sent into the POST request
        const config = {
            headers: {
                'Content-Type': 'application/json'
            } 
        }
   
        // Then we perform the POST request to the backend with email, password and config passed in
        const { data } = await axios.post('api/v1/login', {email, password}, config)

        // Then we dispatch the LOGIN_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the user store state to the 
        // action payload.
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: data.user
        })
  
    } catch(error) {

        // If there is an error we dispatch the LOGIN_FAIL action type with
        // a payload of the error message, which will simply return the error .
        dispatch({
            type: 'LOGIN_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to POST the user register details to the backend
// in order to register, it takes the user data as parameter.
export const register = (userData) => async (dispatch) => {

    try {

        // We first dispatch the REGISTER_USER_REQUEST action type, which 
        // will set the authentication to false.
        dispatch({ type: 'REGISTER_USER_REQUEST' })

        // Then we set the config variable to be sent into the POST request
        // Content Type this time will be multipart/form-data since we will also 
        // be posting an avatar image.
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            } 
        }
   
        // Then we perform the POST request to the backend with the user form data and config passed in
        const { data } = await axios.post('/api/v1/register', userData, config)

        // Then we dispatch the REGISTER_USER_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the user store state to the 
        // action payload
        dispatch({
            type: 'REGISTER_USER_SUCCESS',
            payload: data.user
        })
  
    } catch(error) {
        
        // If there is an error we dispatch the REGISTER_USER_FAIL action type with
        // a payload of the error errMessage, which will simply return the error .
        dispatch({
            type: 'REGISTER_USER_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get (load) the logged in user from to the backend
export const loadUser = () => async (dispatch) => {

    try {

        // We first dispatch the LOAD_USER_REQUEST action type, which 
        // will set the authentication to false.
        dispatch({ type: 'LOAD_USER_REQUEST' })
   
        // Then we perform the get request to the backend
        const { data } = await axios.get('/api/v1/profile')

        // Then we dispatch the LOAD_USER_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the user store state to the 
        // action payload.
        dispatch({
            type: 'LOAD_USER_SUCCESS',
            payload: data.user
        })
  
    } catch(error) {

        // If there is an error we dispatch the LOAD_USER_FAIL action type with
        // a payload of the error errMessage, which will simply return the error .
        dispatch({
            type: 'LOAD_USER_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will update the user profile in the backend
export const updateProfile = (userData) => async (dispatch) => {

    try {

        // We first dispatch the UPDATE_PROFILE_REQUEST action type, which 
        // simply return the state.
        dispatch({ type: 'UPDATE_PROFILE_REQUEST' })

        // Then we set the config variable to be sent into the PUT request
        // Content Type this time will be multipart/form-data since we will also 
        // be posting an avatar image.
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        // Then we perform the PUT request (to update) to the backend with the user form data and config passed in
        const { data } = await axios.put('/api/v1/profile/update', userData, config)

        // Then we dispatch the UPDATE_PROFILE_SUCCESS action type with a payload of the
        // success variable extracted from the backend which will be true or false, 
        // which will set the userProfile store state to the action payload.
        dispatch({
            type: 'UPDATE_PROFILE_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        // If there is an error we dispatch the UPDATE_PROFILE_FAIL action type with
        // a payload of the error errMessage, which will simply return the error 
        dispatch({
            type: 'UPDATE_PROFILE_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will update the password in the backend
export const updatePassword = (passwords) => async (dispatch) => {

    try {

        // We first dispatch the UPDATE_PASSWORD_REQUEST action type, which 
        // simply return the state.
        dispatch({ type: 'UPDATE_PASSWORD_REQUEST' })

        // Then we set the config variable to be sent into the PUT request.
        // Content Type this time will be application/json since its just the password and no image.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform the PUT request (to update) to the backend with the the old and new
        // passwords data and config passed in
        const { data } = await axios.put('/api/v1/password/update', passwords, config)

        // Then we dispatch the UPDATE_PASSWORD_SUCCESS action type with a payload of the
        // success variable extracted from the backend which will be true or false, 
        // which will set the userProfile store state to the action payload
        dispatch({
            type: 'UPDATE_PASSWORD_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        // If there is an error we dispatch the UPDATE_PASSWORD_FAIL action type with
        // a payload of the error errMessage, which will simply return the error 
        dispatch({
            type: 'UPDATE_PASSWORD_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will send an email to the user with forgotten password URL along with the reset password
// token (see usersController/forgotPassword).
// We pass the email needed to send the reset password URL email to the user as parameter.
export const forgotPassword = (email) => async (dispatch) => {

    try {

        // We first dispatch the FORGOT_PASSWORD_REQUEST action type, which 
        // simply return the state and sets the error to null.
        dispatch({ type: 'FORGOT_PASSWORD_REQUEST' })

        // Then we set the config variable to be sent into the POST request.
        // Content Type this time will be application/json since its just the password and no image.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform the POST request to the backend with the user email whose
        // password was forgotten and config passed in
        const { data } = await axios.post('/api/v1/password/forgot', email, config)

        // Then we dispatch the FORGOT_PASSWORD_SUCCESS action type with a payload of the
        // message extracted from the backend which will contain the "email sent" success message.
        dispatch({
            type: 'FORGOT_PASSWORD_SUCCESS',
            payload: data.message
        })

    } catch (error) {

        // If there is an error we dispatch the FORGOT_PASSWORD_FAIL action type with
        // a payload of the error errMessage, which will simply return the error .
        dispatch({
            type: 'FORGOT_PASSWORD_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will reset the forgotten password in the backend.
// It takes the reset password token in the URL sent via email by the forgotPassword action and the two passwords 
// (password and confirm password) as parameter.
export const resetPassword = (token, passwords) => async (dispatch) => {

    try {

        // We first dispatch the NEW_PASSWORD_REQUEST action type, which 
        // simply return the state and sets the error to null.
        dispatch({ type: 'NEW_PASSWORD_REQUEST' })

        // Then we set the config variable to be sent into the PUT request.
        // Content Type this time will be application/json since theres no image.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform the PUT request to the backend with the reset password URL sent via email, the 2
        // passwords input in the form (password and confirm password) and the config variable.
        const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config)

        // Then we dispatch the NEW_PASSWORD_SUCCESS action type with a payload of the
        // success response from the backend.
        dispatch({
            type: 'NEW_PASSWORD_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        // If there is an error we dispatch the NEW_PASSWORD_FAIL action type with
        // a payload of the error errMessage, which will simply return the error .
        dispatch({
            type: 'NEW_PASSWORD_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to log the user out
export const logout = () => async (dispatch) => {

    try {
    
        // get request to the backend
        await axios.get('/api/v1/logout')

        // Then we dispatch the LOAD_USER_SUCCESS action type 
        dispatch({
            type: 'LOGOUT_SUCCESS',
        })
  
    } catch(error) {

        // If there is an error we dispatch the LOAD_USER_FAIL action type with
        // a payload of the error errMessage, which will simply return the error .
        dispatch({
            type: 'LOGOUT_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get all the users - ADMIN
export const allUsers = () => async (dispatch) => {

    try {

        // We first dispatch the ALL_USERS_REQUEST action type, which 
        // simply return the state.
        dispatch({ type: 'ALL_USERS_REQUEST' })

        // We perform the GET request to the backend to get all users
        const { data } = await axios.get('/api/v1/admin/users')

        // Then we dispatch the ALL_USERS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the allusers store state to the 
        // action payload.
        dispatch({
            type: 'ALL_USERS_SUCCESS',
            payload: data.users
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the ALL_USERS_FAIL action type with
            // a payload of the error errMessage, which will simply return the error .
            type: 'ALL_USERS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to update the user - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {

    try {

        // We first dispatch the UPDATE_USER_REQUES action type, which 
        // simply return the state.
        dispatch({ type: 'UPDATE_USER_REQUEST' })

        // Then we set the config variable to be sent into the PUT request.
        // Content Type this time will be application/json since theres no image.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform the PUT request to the backend with the userData form coming from the 
        // frontend and config passed in.
        const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config)

        // Then we dispatch the UPDATE_USER_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the allusers store state to the 
        // action payload.
        dispatch({
            type: 'UPDATE_USER_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the UPDATE_USER_FAIL action type with
            // a payload of the error errMessage, which will simply return the error 
            type: 'UPDATE_USER_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get the user details - ADMIN
export const getUserDetails = (id) => async (dispatch) => {

    try {

        // We first dispatch the USER_DETAILS_REQUEST action type, which 
        // simply return the state.
        dispatch({ type: 'USER_DETAILS_REQUEST' })

        // We perform the GET request to the backend to get user details.
        const { data } = await axios.get(`/api/v1/admin/user/${id}`)

        // Then we dispatch the USER_DETAILS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the userDetails store state to the 
        // action payload.
        dispatch({
            type: 'USER_DETAILS_SUCCESS',
            payload: data.user
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the UPDATE_USER_FAIL action type with
            // a payload of the error errMessage, which will simply return the error .
            type: 'USER_DETAILS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to delete the user - ADMIN
export const deleteUser = (id) => async (dispatch) => {

    try {

        // We first dispatch the DELETE_USER_REQUEST action type, which 
        // simply return the state.
        dispatch({ type: 'DELETE_USER_REQUEST' })

        // Then we perform the DELETE request to the backend
        const { data } = await axios.delete(`/api/v1/admin/user/${id}`)

        // Then we dispatch the DELETE_USER_SUCCESS action type with a payload of the
        // data.success extracted from the backend, which will set the order store state to the 
        // action payload.
        dispatch({
            type: 'DELETE_USER_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the UPDATE_USER_FAIL action type with
            // a payload of the error errMessage, which will simply return the error. 
            type: 'DELETE_USER_FAIL',
            payload: error.response.data.errMessage
        })
    }
}


// To clear errors we dispatch the CLEAR_ERRORS action type which will simply 
// return the state and set the error to null.
export const clearErrors = () => async (dispatch) => {

    dispatch({ type: 'CLEAR_ERRORS' })
}