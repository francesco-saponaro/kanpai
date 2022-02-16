// Add to cart reducer
export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {

    // So we check which action has been dispatched to the reducer and update
    // the state depending on the action type
    switch (action.type) {

        // If this action type dispatched we get the item from the action.payload, which will be the item and 
        // all its details and quantity we want to add to the cart, then check if the item is already in the cart
        case 'ADD_TO_CART':
            const item = action.payload;

            const isInCart = state.cartItems.find(i => i.product === item.product);

            // If is already in the cart, return the state and add the item to the same item already in the cart.
            // Otherwise return the state and add the new item to the cart
            if (isInCart) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i => i.product === isInCart.product ? item : i)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        // If this action type dispatched we return the state and only the cart items whose ID dont
        // match the product ID in the action payload
        case 'REMOVE_ITEM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(i => i.product !== action.payload)
            }

        // If this action type dispatched we return the state and the shipping info in the action payload
        case 'SAVE_SHIPPING_INFO':
            return {
                ...state,
                shippingInfo: action.payload
            }

        default:
            return state
    }
}