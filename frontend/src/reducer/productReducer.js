// All products reducer
export const productReducer = (state = { products: [] }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch(action.type) {

        // If this action type dispatched we set the state products to an empty array
        case 'ALL_PRODUCTS_REQUEST':
        case 'ADMIN_PRODUCTS_REQUEST':
            return {
               loading: true,
               products: []
            }

        // If this action type dispatched we set the state products to the products 
        // ,productsCount, resPerPage and filteredProductsCount in the action payload
        case 'ALL_PRODUCTS_SUCCESS':
            return {
               loading: false,
               products: action.payload.products,
               productsCount: action.payload.productsCount,
               resPerPage: action.payload.resPerPage,
               filteredProductsCount: action.payload.filteredProductsCount
            }

        case 'ADMIN_PRODUCTS_SUCCESS':
            return {
                loading: false,
                products: action.payload
             }

        // If this action type dispatched we get the error returning from the action payload
        case 'ALL_PRODUCTS_FAIL':
        case 'ADMIN_PRODUCTS_FAIL':
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
            return state
    }
}

// New product reducer
export const newProductReducer = (state = { product: {} }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'NEW_PRODUCT_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we set the success and product to their action payload
        case 'NEW_PRODUCT_SUCCESS':
            return {
                loading: false,
                success: action.payload.success,
                product: action.payload.product
            }

        // If this action type dispatched we return the state and get the error returning from the action payload
        case 'NEW_PRODUCT_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // If this action type dispatched we return the state, set the success
        // to false since at this point the new product will have been created
        case 'NEW_PRODUCT_RESET':
            return {
                ...state,
                success: false
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

// Delete and update product reducer
export const adminProductReducer = (state = {}, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'DELETE_PRODUCT_REQUEST':
        case 'UPDATE_PRODUCT_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we return the state and set the isDeleted and 
        // product to the action payload    
        case 'DELETE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        // If this action type dispatched we return the state and set the isUpdated and 
        // product to the action payload
        case 'UPDATE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        // If this action type dispatched we return the state and get the error returning from the action payload
        case 'DELETE_PRODUCT_FAIL':
        case 'UPDATE_PRODUCT_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        // If this action type dispatched we return the state, set the isDeleted
        // to false since at this point the new product will have been deleted    
        case 'DELETE_PRODUCT_RESET':
            return {
                ...state,
                isDeleted: false
            }

        // If this action type dispatched we return the state, set the isUpdated
        // to false since at this point the new product will have been updated
        case 'UPDATE_PRODUCT_RESET':
            return {
                ...state,
                isUpdated: false
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

// Single product reduceer
export const productDetailsReducer = (state = { product: {} }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch(action.type) {

        // If this action type dispatched we simply return the state
        case 'SINGLE_PRODUCT_REQUEST':
            return {
               ...state,
               loading: true
            }

        // If this action type dispatched we set the state product to the product in the action payload
        case 'SINGLE_PRODUCT_SUCCESS':
            return {
               loading: false,
               product: action.payload
            }

        // If this action type dispatched we get the error returning from the action payload
        case 'SINGLE_PRODUCT_FAIL':
            return {
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

// New review reducer
export const newReviewReducer = (state = {}, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'NEW_REVIEW_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we set the success to the action payload
        case 'NEW_REVIEW_SUCCESS':
            return {
                loading: false,
                success: action.payload
            }

        // If this action type dispatched we return the state and get the error returning from the action payload
        case 'NEW_REVIEW_FAIL':
            return {
                ...state,
                error: action.payload
            }

        // If this action type dispatched we return the state, set the success
        // to false since at this point the new review will have been submitted
        case 'NEW_REVIEW_RESET':
            return {
                ...state,
                success: false
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

// Product reviews reducer
export const productReviewsReducer = (state = { review: [] }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'GET_REVIEWS_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we set the reviews to the action payload
        case 'GET_REVIEWS_SUCCESS':
            return {
                loading: false,
                reviews: action.payload
            }

        // If this action type dispatched we return the state and get the error returning from the action payload
        case 'GET_REVIEWS_FAIL':
            return {
                ...state,
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

// Delete review reducer - ADMIN
export const reviewReducer = (state = {}, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we simply return the state
        case 'DELETE_REVIEW_REQUEST':
            return {
                ...state,
                loading: true
            }

        // If this action type dispatched we return the state, set the isDeleted
        // to variable to the action.payload which would be true
        case 'DELETE_REVIEW_SUCCESS':
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        // If this action type dispatched we return the state and get the error returning from the action payload
        case 'DELETE_REVIEW_FAIL':
            return {
                ...state,
                error: action.payload
            }

        // If this action type dispatched we return the state, set the isDeleted
        // to false since at this point the user order has already been deleted
        case 'DELETE_REVIEW_RESET':
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