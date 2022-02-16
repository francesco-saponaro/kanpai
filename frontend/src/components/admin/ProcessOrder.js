import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, updateOrder, clearErrors } from '../../actions/orderActions'

// Update order status
// We extract and assign the parameter props.match with just { match }
const ProcessOrder = ({ match }) => {

    // We extract data from the state orderDetails and order with the useSelector hook,
    // To be passed in the front-end below.
    const { loading, order = {} } = useSelector(state => state.orderDetails)
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    const { error, isUpdated } = useSelector(state => state.order)

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // Get orderId from the URL
    const orderId = match.params.id;

    useEffect(() => {

        // Get order that matches the URL ID
        dispatch(getOrderDetails(orderId))

        if (error) {

            alert.error(error);
            dispatch(clearErrors())
        }

        // If isUpdated is true in the store, meaning the product was updated successfully,
        // show the success alert and dispatch the UPDATE_ORDER_RESET action which will reset isUpdated
        // to false since at this point the order will have been updated.
        if (isUpdated) {

            alert.success('Order updated successfully');
            dispatch({ type: 'UPDATE_ORDER_RESET' })
        }

    }, [dispatch, alert, error, isUpdated, orderId])

    // This function will dispatch the update order action with a status of 'Delivered'
    // as formData on clicking its update button.
    const updateOrderHandler = (id) => {

        const formData = new FormData();
        formData.set('status', 'Delivered');

        dispatch(updateOrder(id, formData))
        
    }

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    return (
        <Fragment>
            <MetaData title={`Process Order # ${order && order._id}`} />
            <div className="row">

                {/* Sidebar */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-xl-10 px-5">
                    <Fragment>

                        {/* If order details have been loaded */}
                        {loading === false && (
                        <div className="row d-flex">

                            {/* Order details */}
                            <div className="col-12 col-lg-7 order-details">

                                {/* Order ID */}
                                <h2 className="my-5">Order # {order._id}</h2>

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

                                {/* Stripe transaction ID */}
                                <h4 className="my-4">Stripe ID</h4>
                                <p><b>{paymentInfo && paymentInfo.id}</b></p>

                                {/* Delivery status */}
                                <h4 className="my-4">Order Status:</h4>
                                <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" : "redColor"} ><b>{orderStatus}</b></p>

                                {/* Order items */}
                                <h4 className="my-4">Order Items:</h4>

                                <hr />

                                <div className="cart-item my-1">
                                    {orderItems && orderItems.map(item => (
                                        <div key={item.product} className="row align-items-center my-5">

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

                            {/* Update status to 'Delivered' form */}
                            {/* Only show this section is orderStatus is not 'Delivered' */}
                            {orderStatus === 'Processing' && 
                                <div className="col-12 col-lg-3 mt-5">

                                    <button className="btn btn-success btn-block" 
                                            onClick={() => updateOrderHandler(order._id)}
                                    >
                                        Update status to 'Delivered'
                                    </button>
                                </div>
                            }
                        </div>
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default ProcessOrder