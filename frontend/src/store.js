import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
// We import the reducers to be passed into the reducer variable
import { productReducer, productDetailsReducer, newProductReducer, adminProductReducer, newReviewReducer, productReviewsReducer, reviewReducer } from './reducer/productReducer';
import { userReducer, userProfileReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './reducer/userReducer';
import { cartReducer } from './reducer/cartReducer';
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, orderReducer } from './reducer/orderReducer';

// This variable contains all reducers combined
// The reducers update the store with whatever action was dispatched
const reducer = combineReducers({
    // Product reducers
    products: productReducer,
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    product: adminProductReducer,
    newReview: newReviewReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
    // User reducers
    user: userReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    userProfile: userProfileReducer,
    forgotPassword: forgotPasswordReducer,
    // Cart reducer
    cart: cartReducer,
    // Order reducers
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    allOrders: allOrdersReducer,
    orderDetails: orderDetailsReducer,
    order: orderReducer
})

// Add to the initial store state the cart items and shippingInfo saved in the local storage if any.
// So if the page reloads we want to load the cart items from the local storage
let initialState = {
    
    cart: {
        cartItems: localStorage.getItem('cartItems') 
                   ? JSON.parse(localStorage.getItem('cartItems'))
                   : [],
        shippingInfo: localStorage.getItem('shippingInfo') 
                   ? JSON.parse(localStorage.getItem('shippingInfo'))
                   : {}
    }
};

// We need to pass thunk into the store to be able to perform async requests when 
// dispatching actions to the reducer, like for example grabbing data from the backend or API
const middleware = [thunk];

// We associated the reducer with the store
// We pass thunk as a middleware to the store
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;