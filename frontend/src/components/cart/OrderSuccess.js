import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData'

const OrderSuccess = () => {
    return (
        <Fragment>
            <MetaData title={'Order Success'} />

            <div className="row justify-content-center">

                {/* Success message */}
                <div className="col-6 mb-5 text-center">
                    <img className="my-4 img-fluid d-block mx-auto" src="/images/order_success.png" alt="Order Success" width="200" height="200" />
                    <h2>Your Order has been placed successfully.</h2>
                    
                    {/* User orders link */}
                    <Link to="/orders/profile" className='btn btn-primary'>Go to Orders</Link>
                </div>
            </div>
        </Fragment>
    )
}

export default OrderSuccess