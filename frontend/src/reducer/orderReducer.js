// New order reducer
export const newOrderReducer = (state = {}, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'CREATE_ORDER_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we set the order to the action payload
        case 'CREATE_ORDER_SUCCESS':
            return {
                loading: false,
                order: action.payload
            }

        // If this action type dispatched we set the error to the action payload
        case 'CREATE_ORDER_FAIL':
            return {
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

// User orders reducer
export const myOrdersReducer = (state = { orders: [] }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        case 'MY_ORDERS_REQUEST':
            return {
                loading: true
            }

        // If this action type dispatched we set the orders to the action payload
        case 'MY_ORDERS_SUCCESS':
            return {
                loading: false,
                orders: action.payload
            }

        // If this action type dispatched we set the error to the action payload
        case 'MY_ORDERS_FAIL':
            return {
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

//  Order details reducer
export const orderDetailsReducer = (state = { order: {} }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        case 'ORDER_DETAILS_REQUEST':
            return {
                loading: true
            }

        // If this action type dispatched we set the order to the action payload
        case 'ORDER_DETAILS_SUCCESS':
            return {
                loading: false,
                order: action.payload
            }

        // If this action type dispatched we set the error to the action payload
        case 'ORDER_DETAILS_FAIL':
            return {
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

// All orders reducer - ADMIN
export const allOrdersReducer = (state = { orders: [] }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        case 'ALL_ORDERS_REQUEST':
            return {
                loading: true
            }

        // If this action type dispatched we set the order and totalAmount to the action payload
        case 'ALL_ORDERS_SUCCESS':
            return {
                loading: false,
                orders: action.payload.orders,
                totalAmount: action.payload.totalAmount
            }

        // If this action type dispatched we set the error to the action payload
        case 'ALL_ORDERS_FAIL':
            return {
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

// Update and delete order reducer - ADMIN
export const orderReducer = (state = {}, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'UPDATE_ORDER_REQUEST':
        case 'DELETE_ORDER_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we return the state, set the isUpdated
        // to variable to the action.payload which would be true
        case 'UPDATE_ORDER_SUCCESS':
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        // If this action type dispatched we return the state, set the isDeleted
        // to variable to the action.payload which would be true
        case 'DELETE_ORDER_SUCCESS':
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        // If this action type dispatched we return the state and set the error to the action payload
        case 'UPDATE_ORDER_FAIL':
        case 'DELETE_ORDER_FAIL':
            return {
                ...state,
                error: action.payload
            }

        // If this action type dispatched we return the state, set the isUpdated
        // to false since at this point the user order has already been updated 
        case 'UPDATE_ORDER_RESET':
            return {
                ...state,
                isUpdated: false
            }

        // If this action type dispatched we return the state, set the isDeleted
        // to false since at this point the user order has already been deleted
        case 'DELETE_ORDER_RESET':
            return {
                ...state,
                isDeleted: false
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