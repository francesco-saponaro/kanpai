import axios from 'axios';

// This function will dispatch actions to get products from the backend,
// it takes the current page, keyword, price, category and rating as parameters and 
// some have default value. So it will fetch the products based on whatever the paramaters values are.
export const getProducts = (keyword = "", currentPage = 1, price, category, ratings = 0) => async (dispatch) => {

    try {

        // We first dispatch the ALL_PRODUCTS_REQUEST action type, which 
        // will set products to an empty array.
        dispatch({ type: 'ALL_PRODUCTS_REQUEST' })

        // Then we perform a get request with the URL to the backend and extract the data from it
        // This is why we need thunk.
        let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}
                    &price[gte]=${price[0]}&ratings[gte]=${ratings}`

        // If a category is passed in the function add it to the URL for the get request
        if(category) {
            link = `/api/v1/products?keyword=${keyword}&page=${currentPage}
                    &price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${ratings}`
        }

        const { data } = await axios.get(link)

        // Then we dispatch the ALL_PRODUCTS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the products state to the 
        // action payload.
        dispatch({
            type: 'ALL_PRODUCTS_SUCCESS',
            payload: data
        })
    } catch(error) {

        // If there is an error we dispatch the ALL_PRODUCTS_FAIL action type with
        // a payload of the error errMessage, which will simply return the error .
        dispatch({
            type: 'ALL_PRODUCTS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to add a new product
export const newProduct = (productData) => async (dispatch) => {

    try {

        // We first dispatch the NEW_PRODUCT_REQUEST action type, which 
        // will simply return the state array.
        dispatch({ type: 'NEW_PRODUCT_REQUEST' })

        // Then we set the headers config variable to be sent into the PUT request
        // to tell the request what kind of data is coming in.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform a POST request to the backend with the product data, and the config, 
        // and extract the product data.
        // This is why we need thunk
        const { data } = await axios.post(`/api/v1/admin/product/new`, productData, config)

        // Then we dispatch the NEW_PRODUCT_SUCCESS action type with a payload of the
        // data extracted from the backend.
        dispatch({
            type: 'NEW_PRODUCT_SUCCESS',
            payload: data
        })

    } catch (error) {

        console.log(error.response)
        // If there is an error we dispatch the NEW_PRODUCT_FAIL action type with
        // a payload of the error errMessage, which will simply return the error.
        dispatch({
            type: 'NEW_PRODUCT_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// Delete product (Admin)
// This function will dispatch the action to delete a product from the backend
export const deleteProduct = (id) => async (dispatch) => {

    try {

        // We first dispatch the DELETE_PRODUCT_REQUEST action type, which 
        // will simply return the state array
        dispatch({ type: 'DELETE_PRODUCT_REQUEST' })

        // Then we perform a DELETE request to the backend and extract the data.
        const { data } = await axios.delete(`/api/v1/admin/product/${id}`)

        // Then we dispatch the DELETE_PRODUCT_SUCCESS action type with a payload of the
        // data extracted from the backend
        dispatch({
            type: 'DELETE_PRODUCT_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        console.log(error.response)
        // If there is an error we dispatch the DELETE_PRODUCT_FAIL action type with
        // a payload of the error errMessage, which will simply return the error.
        dispatch({
            type: 'DELETE_PRODUCT_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// Update Product (ADMIN)
// This function will dispatch the action to update an existing product in the backend
export const updateProduct = (id, productData) => async (dispatch) => {

    try {

        // We first dispatch the UPDATE_PRODUCT_REQUEST action type, which 
        // will simply return the state array
        dispatch({ type: 'UPDATE_PRODUCT_REQUEST' })

        // Then we set the headers config variable to be sent into the PUT request
        // to tell the request what kind of data is coming in
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform a PUT request to the backend with the product data passed in
        // and the config, and extract the product data.
        const { data } = await axios.put(`/api/v1/admin/product/${id}`, productData, config)

        // Then we dispatch the UPDATE_PRODUCT_SUCCESS action type with a payload of the
        // data extracted from the backend
        dispatch({
            type: 'UPDATE_PRODUCT_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        // If there is an error we dispatch the UPDATE_PRODUCT_FAIL action type with
        // a payload of the error errMessage, which will simply return the error
        dispatch({
            type: 'UPDATE_PRODUCT_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get a single product dteails from the backend
export const getProductDetails = (id) => async (dispatch) => {

    try {
        
        // We first dispatch the SINGLE_PRODUCT_REQUEST action type, which 
        // will simply return the state array.
        dispatch({ type: 'SINGLE_PRODUCT_REQUEST' })

        // Then we perform a get request to the backend and extract the product data 
        // matching the ID from it.
        // This is why we need thunk
        const { data } = await axios.get(`/api/v1/product/${id}`)

        // Then we dispatch the SINGLE_PRODUCT_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the products state to the 
        // action payload.
        dispatch({
            type: 'SINGLE_PRODUCT_SUCCESS',
            payload: data.product
        })
    } catch(error) {

        // If there is an error we dispatch the SINGLE_PRODUCT_FAIL action type with
        // a payload of the error errMessage, which will simply return the error 
        dispatch({
            type: 'SINGLE_PRODUCT_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get add a new review, it will perform a PUT
// request since the user might have already reviewed the product and in which case the
// previous review will be changed
export const newReview = (reviewData) => async (dispatch) => {

    try {

        // We first dispatch the NEW_REVIEW_REQUEST action type, which 
        // will simply return the state array.
        dispatch({ type: 'NEW_REVIEW_REQUEST' })

        // Then we set the headers config variable to be sent into the PUT request
        // to tell the request what kind of data is coming in.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Then we perform a PUT request to the backend with the review data, which will
        // contain the ratings and the review, and the config, and extract the product data.
        // This is why we need thunk
        const { data } = await axios.put(`/api/v1/review`, reviewData, config)

        // Then we dispatch the NEW_REVIEW_SUCCESS action type with a payload of the
        // data.success value extracted from the backend.
        dispatch({
            type: 'NEW_REVIEW_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        // If there is an error we dispatch the NEW_REVIEW_FAIL action type with
        // a payload of the error errMessage, which will simply return the error .
        dispatch({
            type: 'NEW_REVIEW_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get all products from the backend
export const getAdminProducts = () => async (dispatch) => {

    try {

        // We first dispatch the ADMIN_PRODUCTS_REQUEST action type, which 
        // will set products to an empty array.
        dispatch({ type: 'ADMIN_PRODUCTS_REQUEST' })

        // Then we perform a get request with the URL to the backend and extract the data from it.
        // This is why we need thunk
        const { data } = await axios.get(`/api/v1/admin/products`)

        // Then we dispatch the ADMIN_PRODUCTS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set the products state to the 
        // action payload.
        dispatch({
            type: 'ADMIN_PRODUCTS_SUCCESS',
            payload: data.products
        })

    } catch (error) {

        // If there is an error we dispatch the ADMIN_PRODUCTS_FAIL action type with
        // a payload of the error errMessage, which will simply return the error 
        dispatch({
            type: 'ADMIN_PRODUCTS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to get all product reviews from the backend
export const getProductReviews = (id) => async (dispatch) => {

    try {

        // We first dispatch the GET_REVIEWS_REQUEST action type, which 
        // will simply return the state.
        dispatch({ type: 'GET_REVIEWS_REQUEST' })

        // We perform the GET request to the backend to get all product reviews
        const { data } = await axios.get(`/api/v1/reviews?id=${id}`)

        // Then we dispatch the GET_REVIEWS_SUCCESS action type with a payload of the
        // data extracted from the backend, which will set reviews store state to the 
        // action payload.
        dispatch({
            type: 'GET_REVIEWS_SUCCESS',
            payload: data.reviews
        })

    } catch (error) {

        dispatch({
            // If there is an error we dispatch the GET_REVIEWS_FAIL action type with
            // a payload of the error errMessage, which will simply return the error.
            type: 'GET_REVIEWS_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// This function will dispatch actions to delete a review from the backend - ADMIN
export const deleteReview = (id, productId) => async (dispatch) => {

    try {

        // We first dispatch the DELETE_REVIEW_REQUEST action type, which 
        // will simply return the state.
        dispatch({ type: 'DELETE_REVIEW_REQUEST' })

        // Then we perform the DELETE request to the backend
        const { data } = await axios.delete(`/api/v1/reviews?id=${id}&productId=${productId}`)

        // Then we dispatch the DELETE_REVIEW_SUCCESS action type with a payload of the
        // data.success extracted from the backend, which will set the review store state to the 
        // action payload.
        dispatch({
            type: 'DELETE_REVIEW_SUCCESS',
            payload: data.success
        })

    } catch (error) {

        console.log(error.response);
        dispatch({
            // If there is an error we dispatch the DELETE_REVIEW_FAIL action type with
            // a payload of the error errMessage, which will simply return the error.
            type: 'DELETE_REVIEW_FAIL',
            payload: error.response.data.errMessage
        })
    }
}

// To clear errors we dispatch the CLEAR_ERRORS action type which will simply 
// return the state and set the error to null.
export const clearErrors = () => async (dispatch) => {

    dispatch({ type: 'CLEAR_ERRORS' })
}