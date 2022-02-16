import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData'

import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux'

import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'

// We extract and assign the parameter props.history with just { history }
const Cart = ({ history }) => {

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    const alert = useAlert();

    // We extract data from the state cart with the useSelector hook,
    // To be passed in the front end below
    const { cartItems } = useSelector(state => state.cart)

    // This function will dispatch the removeItemFromCart action onClick below
    const removeCartItemHandler = (id) => {

        dispatch(removeItemFromCart(id))
    }

    // Increase desired quantity onClick
    // It taked the product ID, quantity and product stock as parameters
    const increaseQty = (id, quantity, stock) => {

        // Increase the existing quantity by 1
        const newQty = quantity + 1;

        // if the quantity value is equal or higher than the amount of the product in stock simply return, 
        //to not allow the user to select a higher quantity than what's in stock
        if (newQty > stock) {
            
            alert.error("Cannot exceed amount in stock");
            return
        };;

        // Otherwise dispatch the addItemToCart action to add the product with the updated
        // quantity to the cart
        dispatch(addItemToCart(id, newQty))
    }

    // Decrease desired quantity onClick 
    const decreaseQty = (id, quantity) => {

        // Decrease the existing quantity by 1
        const newQty = quantity - 1;

        // if the quantity value is equal or less than 0 simply return, 
        // to not allow the user to select less than 0 quantity
        if (newQty <= 0) return;

        // Otherwise dispatch the addItemToCart action to add the product with the updated
        // quantity to the cart
        dispatch(addItemToCart(id, newQty))
    }

    // So if the user is logged out when clicking the checkout button below, it will be 
    // redirected to the login page with a location URL of redirect=shipping.
    // So that when we are on the login page then we will check if there is a location in the URL and if so
    // when we log in we redirect to that location (redirect=shipping) which will be the shipping page
    // See Login.js.
    const checkoutHandler = () => {

        history.push('/login?redirect=shipping')
    }

    return (
        <Fragment>
            <MetaData title={'Your Cart'} />
            {/* If the cart is not empty display its items */}
            {cartItems.length === 0 ? <h2 className="mt-5">Your Cart is Empty</h2> : (
                <Fragment>

                    {/* Cart length header */}
                    <h2 className="mt-5">Your Cart: <b>{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} items</b></h2>

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8">

                            <Fragment>                               
                                {/* Map through all cart items and display them */}
                                {cartItems.map(item => (
        
                                    <div className="cart-item" key={item.product}>
                                    
                                        <div className="row align-items-center">

                                            {/* Item image */}
                                            <div className="col-4 col-lg-3">
                                                <img src={item.image} alt={item.name} height="90" />
                                            </div>

                                            {/* Item name and link */}
                                            <div className="col-5 col-lg-3">
                                                <Link to={`/product/${item.product}`} className="text-decoration-none">{item.name}</Link>
                                            </div>

                                            {/* Item price */}
                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p id="card_item_price">${item.price}</p>
                                            </div>

                                            {/* Item quantity and quantity selectors */}
                                            <div className="col-5 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    <span className="btn btn-danger minus" onClick={() => decreaseQty(item.product, item.quantity)}>-</span>

                                                    <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

                                                    <span className="btn btn-primary plus" onClick={() => increaseQty(item.product, item.quantity, item.stock)}>+</span>
                                                </div>
                                            </div>

                                            {/* Item remove button */}
                                            <div className="col-3 col-lg-1 mt-4 mt-lg-0">
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeCartItemHandler(item.product)} ></i>
                                            </div>
                                        </div>
                                        
                                        <hr></hr>
                                    </div>
                                ))}
                            </Fragment>
                        </div>

                        {/* Order summary anc checkout button */}
                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal:  <span className="order-summary-values">{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Units)</span></p>
                                <p>Est. total: <span className="order-summary-values">${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span></p>

                                <hr />
                                <button id="checkout_btn" className="btn btn-primary d-block" onClick={checkoutHandler}>Check out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Cart