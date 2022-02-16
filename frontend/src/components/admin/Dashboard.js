import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useDispatch, useSelector } from 'react-redux'

import { getAdminProducts } from '../../actions/productActions'
import { allOrders } from '../../actions/orderActions'
import { allUsers } from '../../actions/userActions'

const Dashboard = () => {

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed.
    const dispatch = useDispatch();

    // We extract data from the various store states with the useSelector hook,
    // To be passed in the front end below
    const { products } = useSelector(state => state.products)
    const { users } = useSelector(state => state.allUsers)
    const { orders, totalAmount, loading } = useSelector(state => state.allOrders)

    // Out of stock variable to be passed in dashboard below
    let outOfStock = 0;
    products.forEach(product => {

        if (product.stock === 0) {
            outOfStock += 1;
        }
    })

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components.
    // This hook will run everytime the page loads or reloads before everything else,
    // So we will check if the user is authenticated as soon as the page loads.
    useEffect(() => {
        
        // We load all products, orders and users as soon as the page loads
        dispatch(getAdminProducts())
        dispatch(allOrders())
        dispatch(allUsers())
    }, [dispatch])

    return (
        <Fragment>
            <div className="row">

                {/* Sidebar component */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                {/* Dashboard */}
                <div className="col-12 col-xl-10 px-4 ps-xl-1 pe-xl-4 pt-3">
                    <h1 className="my-4">Dashboard</h1>

                    {/* If orders have been loaded */}
                    {loading === false && (
                    <Fragment>
                        <MetaData title={'Admin Dashboard'} />

                        {/* Total amount */}
                        <div className="row">
                            <div className="col-xl-12 col-sm-12 mb-3">
                                <div className="card text-white bg-primary o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Total Amount<br /> <b>${totalAmount && totalAmount.toFixed(2)}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shop data */}
                        <div className="row">

                            {/* Products data */}
                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-success o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Products<br /> <b>{products && products.length}</b></div>
                                    </div>
                                    <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                        <span className="float-start">View Details</span>
                                        <span className="float-end">
                                            <i className="fa fa-angle-end"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* Orders data */}
                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-danger o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Orders<br /> <b>{orders && orders.length}</b></div>
                                    </div>
                                    <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                        <span className="float-start">View Details</span>
                                        <span className="float-end">
                                            <i className="fa fa-angle-end"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* Users data */}
                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-info o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Users<br /> <b>{users && users.length}</b></div>
                                    </div>
                                    <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                        <span className="float-start">View Details</span>
                                        <span className="float-end">
                                            <i className="fa fa-angle-end"></i>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Stock data */}
                            <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="card text-white bg-warning o-hidden h-100">
                                    <div className="card-body">
                                        <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                    )}
                </div>
            </div>
        </Fragment >
    )
}

export default Dashboard