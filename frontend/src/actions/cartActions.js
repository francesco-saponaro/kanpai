import axios from 'axios'

// This function will get the product we want to add to the cart from the backend
// and dispatch the ADD_TO_CART action with the product details, quantity of it and also
// the logged in user, as we want to associate the cart items to the user that added it in order to 
// remove the cart items from the local storage if a different user logs in.
// Give the user parameter a default value of "not authenticated" as otherwise it would throw an error
// if a product is added by a not authenticated user and then try to access the checkout page by an 
// authenticated user.
export const addItemToCart = (id, quantity, user = 'not authenticated') => async (dispatch, getState) => {

    const { data } = await axios.get(`/api/v1/product/${id}`)

    dispatch({
        type: 'ADD_TO_CART',
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity,
            user
        }
    })

    // We also want to save the store state cart cartItems in the local storage
    // as if we reload the page we want to load the cart items from the local storage
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

// This function will dispatch REMOVE_ITEM_CART to the reducer which will remove the 
// selected item from the cart
export const removeItemFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: 'REMOVE_ITEM_CART',
        payload: id
    })

    // Once again we also want to save the store state cart cartItems in the local storage
    // as if we reload the page we want to load the updated cart items from the local storage
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

// This function will dispatch the SAVE_SHIPPING_INFO action which will save the shipping data
// from the action payload in the state
export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: 'SAVE_SHIPPING_INFO',
        payload: data
    })

    // We also want to save the shipping info data in the local storage
    // as if we reload the page we want to load it from the local storage
    localStorage.setItem('shippingInfo', JSON.stringify(data))

}
