import React, { Fragment, useEffect } from 'react'

import MetaData from '../layouts/MetaData'

// Import Checkout steps component in order to display it above the Shipping form
import CheckoutSteps from './CheckoutSteps'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'

import { createOrder, clearErrors } from '../../actions/orderActions'

// Import required elements from the installed react-stripe-js package to be used in the form below.
// They are useful as they have the validation already coded in
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

import axios from 'axios'

// Options variable to be passed to the stripe elements in the form below
const options = {

    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}

// We extract and assign the parameter props.history with just { history }
const Payment = ({ history }) => {

    const alert = useAlert();

    // Variables referencing stripe and its elements in order to use it
    const stripe = useStripe();
    const elements = useElements();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store user with the useSelector hook,
    // To be passed in the front end below
    const { user } = useSelector(state => state.user)
    const { cartItems, shippingInfo } = useSelector(state => state.cart);

    // Import newOrder error from the store to display it in case of error 
    const { error } = useSelector(state => state.newOrder)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        // Display newOrder error if any
        if (error) {

            alert.error(error)
            dispatch(clearErrors())
        }

    }, [dispatch, alert, error])

    // Create order object to be passed in the createOrder action function once the payment
    // is successful, more properties to be added to it below
    const order = {

        orderItems: cartItems,
        shippingInfo
    }

    // Extract the order prices info previously set in the session storage via the confirmOrder process
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    
    // Add further properties to the order object from the session storage
    if (orderInfo) {

        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }
    
    // convert the orderInfo total price to cents format, to pass in process payment the backend request
    const paymentData = {

        amount: Math.round(orderInfo.totalPrice * 100)
    }

    // On submitting the payment form
    const submitHandler = async (e) => {

        e.preventDefault();

        // Disable the submit button to prevent submitting payment twice
        document.querySelector('#pay_btn').disabled = true;

        let res;

        // If there's no errors
        try {

            // Config variable to pass in the process payment backend request
            const config = {

                headers: {
                    'Content-Type': 'application/json'
                }
            }

            // Process payment backend request with total price and config
            res = await axios.post('/api/v1/payment/process', paymentData, config)

            // Client secret coming back from the backend request, needed to confirm the 
            // card payment
            const clientSecret = res.data.client_secret;

            // If there's no stripe or elements return to prevent errors
            if (!stripe || !elements) {
                return;
            }
            // Otherwise run the confirm card payment method with the client secret,
            // and the card number element and billing details as payment method
            const result = await stripe.confirmCardPayment(clientSecret, {

                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            // If there was an error confirming the card payment, alert the user and 
            // reinable the pay button so the user can re attempt to submit payment
            if (result.error) {

                alert.error(result.error.message);
                document.querySelector('#pay_btn').disabled = false;
            } else {

                // Else if the payment is processed add payment info to the order object,
                // dispatch the createOrder action function with the order object passed in
                // , remove items from local and session storages in order to empty the cart,
                // redirect the user to the success page and reload the page also to show the updated
                // data in the cart which will be empty.
                // Otherwise alert the user
                if (result.paymentIntent.status === 'succeeded') {

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }

                    dispatch(createOrder(order))

                    localStorage.removeItem('cartItems')
                    sessionStorage.removeItem('orderInfo')

                    history.push('/success')
                    history.go(0)
                } else {

                    alert.error('There is some issue while payment processing')
                }
            }
        } catch (error) {

            // If there was an error submitting the form, alert the user and 
            // reinable the pay button so the user can re attempt to submit payment
            document.querySelector('#pay_btn').disabled = false;
            alert.error(error.response.data.message)
        }
    }

    return (
        <Fragment>
            <MetaData title={'Payment'} />

            {/* Checkout steps component with shipping as parameter (so with active classes) */}
            <CheckoutSteps shipping confirmOrder payment />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/* Payment form */}
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Card Info</h1>
                        
                        {/* Card number element */}
                        <div className="form-group mb-3">
                            <label htmlFor="card_num_field">Card Number</label>
                            <CardNumberElement
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                options={options}
                            />
                        </div>
 
                        {/* Card expiry element */}
                        <div className="form-group mb-3">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <CardExpiryElement
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        {/* Card CVC element */}
                        <div className="form-group mb-3">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <CardCvcElement
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                options={options}
                            />
                        </div>

                        {/* Pay button */}
                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn d-block py-3"
                        >
                            Pay {` - ${orderInfo && orderInfo.totalPrice}`}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Payment