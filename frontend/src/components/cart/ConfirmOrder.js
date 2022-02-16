import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData'

// Import Checkout steps component in order to display it above the Shipping form
import CheckoutSteps from './CheckoutSteps'

import { useSelector } from 'react-redux'

// We extract and assign the parameter props.history with just { history }
const ConfirmOrder = ({ history }) => {

    // We extract the shippingInfo and cartItemsfrom the state with the useSelector hook,
    // to display in the frontend below
    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)

    // Calculate Order Prices to display below
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    // This onClick function will save the data in the sessionStorage in order to be 
    // loaded from it in the payment page.
    // The sessionStorage its exactly like the localStorage except it resets when closing the browser
    const processToPayment = () => {

        const data = {

            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        history.push('/payment')
    }

    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />

            {/* Checkout steps component with shipping and confirmOrder as parameters (so with active classes) */}
            <CheckoutSteps shipping confirmOrder />

            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    {/* Shipping info */}
                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> {user && user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    {/* Cart Items */}
                    <h4 className="pt-4">Your Cart Items:</h4>
                    <Fragment>
                        {cartItems.map(item => (
                        
                            <div className="cart-item my-1" key={item.product}>
                                <div className="row align-items-center">

                                    {/* Item image */}
                                    <div className="col-2">
                                        <img src={item.image} alt={item.name} height="45" />
                                    </div>

                                    {/* Item name and link */}
                                    <div className="col-4">
                                        <Link to={`/product/${item.product}`} className='text-decoration-none'>{item.name}</Link>
                                    </div>
                                    
                                    {/* Item quantity and price */}
                                    <div className="col-6 mt-4 mt-lg-0">
                                        <p className="mb-0">{item.quantity} x ${item.price} = <b>${(item.quantity * item.price).toFixed(2)}</b></p>
                                    </div>
                                </div>

                                <hr></hr>
                            </div>
                        ))}
                    </Fragment>
                </div>

                {/* Order summary */}
                <div className="col-12 col-lg-3 mt-5">
                    <div id="order_summary">
                        <h4>Order Summary</h4>

                        <hr />

                        <p>Subtotal:  <span className="order-summary-values">${itemsPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />

                        {/* Payment button */}
                        <button id="checkout_btn" className="btn btn-primary d-block" onClick={processToPayment}>PROCEED TO PAYMENT</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ConfirmOrder