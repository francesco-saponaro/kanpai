import React from 'react'
import { Link } from 'react-router-dom'

// Checkout steps component which displays where the user is in the checkout process
const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {

    return (
        <div className="checkout-progress d-flex justify-content-center mt-5">

            {/* Based on where the user is in the checkout process we change the classes 
                to active from incomplete to indicate where the user is and also disable links
                accordingly */}

            {/* Shipping step */}
            {shipping ? <Link to='shipping' className="float-end">
                <div className="triangle2-active"></div>
                <div className="step active-step">Shipping</div>
                <div className="triangle-active"></div>
            </Link> : <Link to="#!" disabled>
                    <div className="triangle2-incomplete"></div>
                    <div className="step incomplete">Shipping</div>
                    <div className="triangle-incomplete"></div>
                </Link>}

            {/* Confirm order step */}
            {confirmOrder ? <Link to='/confirm' className="float-end">
                <div className="triangle2-active"></div>
                <div className="step active-step">Confirm Order</div>
                <div className="triangle-active"></div>
            </Link> : <Link to="#!" disabled>
                    <div className="triangle2-incomplete"></div>
                    <div className="step incomplete">Confirm Order</div>
                    <div className="triangle-incomplete"></div>
                </Link>}

            {/* Payment step */}
            {payment ? <Link to='/payment' className="float-end">
                <div className="triangle2-active"></div>
                <div className="step active-step">Payment</div>
                <div className="triangle-active"></div>
            </Link> : <Link to="#!" disabled>
                    <div className="triangle2-incomplete"></div>
                    <div className="step incomplete">Payment</div>
                    <div className="triangle-incomplete"></div>
                </Link>}
        </div>
    )
}

export default CheckoutSteps