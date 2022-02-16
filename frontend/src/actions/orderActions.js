import axios from 'axios'

// This function will dispatch actions to create a new order in the backend,
// it takes the order object coming from Payment.js as a parameter
export const createOrder = (order) => async (dispatch, getState) => {

    try {

        // We first dispatch the CREATE_ORDER_REQUEST action type, which 
        // will simply return the state
        dispatch({ type: 'CREATE_ORDER_REQUEST' })

        // Then we set the headers config variable to be sent into the POST request
        // to tell the request what kind of data is coming in
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform the POST request to the backend with the order object and config passed in
        const { data } = await axios.post('/api/v1/order/new', order, config)

        // Then we dispatch the CREATE_ORDER_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the order store state to the 
        // action payload
        dispatch({
            type: 'CREATE_ORDER_SUCCESS',
            payload: data
        })

    } catch (error) {

        // If there is an error we dispatch the CREATE_ORDER_FAIL action type with
        // a payload of the error errMessage, which will simply return the error 
        dispatch({
            type: 'CREATE_ORDER_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get the user orders in the backend
export const myOrders = () => async (dispatch) => {

    try {

        // We perform the GET request to the backend to get user orders
        const { data } = await axios.get('/api/v1/orders/profile')

        // Then we dispatch the MY_ORDERS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the myOrders store state to the 
        // action payload
        dispatch({
            type: 'MY_ORDERS_SUCCESS',
            payload: data.orders
        })

    } catch (error) {

        // If there is an error we dispatch the CREATE_ORDER_FAIL action type with
        // a payload of the error errMessage, which will simply return the error 
        dispatch({
            type: 'MY_ORDERS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get the user order details in the backend
export const getOrderDetails = (id) => async (dispatch) => {

    try {

        // We perform the GET request to the backend to get user order details
        const { data } = await axios.get(`/api/v1/order/${id}`)

        // Then we dispatch the ORDER_DETAILS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the orderDetails store state to the 
        // action payload
        dispatch({
            type: 'ORDER_DETAILS_SUCCESS',
            payload: data.order
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the CREATE_ORDER_FAIL action type with
            // a payload of the error errMessage, which will simply return the error 
            type: 'ORDER_DETAILS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get all orders from the backend - ADMIN
export const allOrders = () => async (dispatch) => {
    try {

        // We perform the GET request to the backend to get all orders
        const { data } = await axios.get(`/api/v1/admin/orders`)

        // Then we dispatch the ALL_ORDERS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the allOrders store state to the 
        // action payload
        dispatch({
            type: 'ALL_ORDERS_SUCCESS',
            payload: data
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the ALL_ORDERS_FAIL action type with
            // a payload of the error errMessage, which will simply return the error 
            type: 'ALL_ORDERS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to update an order from the backend - ADMIN
export const updateOrder = (id, orderData) => async (dispatch) => {

    try {

        // We first dispatch the UPDATE_ORDER_REQUEST action type, which 
        // will simply return the state
        dispatch({ type: 'UPDATE_ORDER_REQUEST' })

        // Then we set the headers config variable to be sent into the POST request
        // to tell the request what kind of data is coming in
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform the PUT request to the backend with the orderData form coming from the 
        // frontend and config passed in
        const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData, config)

        // Then we dispatch the UPDATE_ORDER_SUCCESS action type with a payload of the
        // data.success extracted from the backend, which will set the order store state to the 
        // action payload
        dispatch({
            type: 'UPDATE_ORDER_SUCCESS',
            payload: data.success
        })

    } catch (error) {
        console.log(error.response)
        dispatch({
            // If there is an error we dispatch the UPDATE_ORDERS_FAIL action type with
            // a payload of the error errMessage, which will simply return the error
            type: 'UPDATE_ORDER_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to delete order from the backend - ADMIN
export const deleteOrder = (id) => async (dispatch) => {

    try {

        // We first dispatch the DELETE_ORDER_REQUEST action type, which 
        // will simply return the state
        dispatch({ type: 'DELETE_ORDER_REQUEST' })

        // Then we perform the DELETE request to the backend
        const { data } = await axios.delete(`/api/v1/admin/order/${id}`)

        // Then we dispatch the DELETE_ORDER_SUCCESS action type with a payload of the
        // data.success extracted from the backend, which will set the order store state to the 
        // action payload
        dispatch({
            type: 'DELETE_ORDER_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the DELETE_ORDER_FAIL action type with
            // a payload of the error errMessage, which will simply return the error
            type: 'DELETE_ORDER_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// To clear errors we dispatch the CLEAR_ERRORS action type which will simply 
// return the state and set the error to null
export const clearErrors = () => async (dispatch) => {
    
    dispatch({
        type: 'CLEAR_ERRORS'
    })
}