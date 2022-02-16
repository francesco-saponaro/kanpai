import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'

import { getOrderDetails, clearErrors } from '../../actions/orderActions'

// Display user order details
// We extract and assign the parameter props.match with just { match }
const OrderDetails = ({ match }) => {

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the state orderDetails with the useSelector hook,
    // To be passed in the front-end below
    const { loading, error, order = {} } = useSelector(state => state.orderDetails)
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        // Get product that matches the URL ID
        dispatch(getOrderDetails(match.params.id));

        if (error) {


            alert.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error, match.params.id])

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    return (
        <Fragment>
            <MetaData title={'Order Details'} />

            {/* If order details have been loaded */}
            {loading === false && (
            <Fragment>
                <div className="row d-flex justify-content-between">

                    {/* Order details */}
                    <div className="col-12 col-lg-8 px-4 order-details">

                        {/* Order ID */}
                        <h1 className="mb-5">Order # {order._id}</h1>

                        {/* Shipping info */}
                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {user && user.name}</p>
                        <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                        <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                        <p><b>Amount:</b> ${totalPrice}</p>

                        <hr />

                        {/* Payment status */}
                        <h4 className="my-4">Payment</h4>
                        <p className={isPaid ? "greenColor" : "redColor"}><b>{isPaid ? "PAID" : "NOT PAID"}</b></p>
                        
                        {/* Delivery status */}
                        <h4 className="my-4">Order Status:</h4>
                        <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" : "redColor"} ><b>{orderStatus}</b></p>

                        {/* Order items */}
                        <h4 className="my-4">Order Items:</h4>

                        <hr />

                        <div className="cart-item my-1">
                            {orderItems && orderItems.map(item => (
                                <div key={item.product} className="row my-5 align-items-center">

                                    {/* Item image */}
                                    <div className="col-2">
                                        <img src={item.image} alt={item.name} height="45" />
                                    </div>

                                    {/* Item name and link */}
                                    <div className="col-4">
                                        <Link to={`/product/${item.product}`} className="text-decoration-none">{item.name}</Link>
                                    </div>

                                    {/* Item price */}
                                    <div className="col-2">
                                        <p className='mb-0'>${item.price}</p>
                                    </div>
                                    
                                    {/* Item quantity */}
                                    <div className="col-4">
                                        <p className='mb-0'>{item.quantity} Piece(s)</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr />
                        
                    </div>
                </div>
            </Fragment>
            )}
        </Fragment>
    )
}

export default OrderDetails