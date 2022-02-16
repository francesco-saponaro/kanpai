import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Import installed react MDBdatatable to display orders below
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layouts/MetaData'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'

import { myOrders, clearErrors } from '../../actions/orderActions'

// Display all user orders
const ListOrders = () => {

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the state myOrders with the useSelector hook,
    // To be passed in the table below
    const { loading, error, orders } = useSelector(state => state.myOrders);

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        // We load the user orders as soon as the page loads
        dispatch(myOrders());

        if (error) {

            alert.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error])

    // This function contains all orders data to pass in the react table below
    const setOrders = () => {

        const data = {
            // Table columns data
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Num of Items',
                    field: 'numOfItems',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc',
                    width: 100

                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc',
                    width: 100
                },
            ],
            // Table rows data (to be pushed in)
            rows: []
        }

        // For each user order push data in the table rows
        orders.forEach(order => {
            
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions:
                    <Link to={`/order/${order._id}`} className="btn btn-primary">
                        <i className="fa fa-eye"></i>
                    </Link>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'My Orders'} />

            <h1 className="my-5">My Orders</h1>

            {/* If users have been loaded, Display installed react table with 
                the setOrders function above as data */}
            {loading === false && (
                <MDBDataTable
                    data={setOrders()}
                    className="px-3"
                    bordered
                    striped
                    hover
                    scrollX
                />
            )}
        </Fragment>
    )
}

export default ListOrders