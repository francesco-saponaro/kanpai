import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Import installed react MDBdatatable to display orders below
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { allOrders, deleteOrder, clearErrors } from '../../actions/orderActions'

// Display all orders
// We extract and assign the parameter props.history with just { history }
const OrdersList = ({ history }) => {

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the state allOrders and order with the useSelector hook,
    // To be passed in the table below.
    const { loading, error, orders } = useSelector(state => state.allOrders);
    const { isDeleted } = useSelector(state => state.order)

    useEffect(() => {

        // We load the orders as soon as the page loads
        dispatch(allOrders());

        if (error) {

            alert.error(error);
            dispatch(clearErrors())
        }

        // If isDeleted is true in the store, meaning the product was deleted successfully,
        // redirect the admin to the all orders page, show the success alert and dispatch 
        // the DELETE_ORDER_RESET action which will reset the isDeleted
        // to false since at this point the order will have been deleted.
        if (isDeleted) {

            alert.success('Order deleted successfully');
            history.push('/admin/orders');
            dispatch({ type: 'DELETE_ORDER_RESET' })
        }

    }, [dispatch, alert, error, isDeleted, history])

    // This function will dispatch the delete order action on clicking the delete button
    // on the product table row.
    const deleteOrderHandler = (id) => {

        dispatch(deleteOrder(id))
    }

    // This function contains all orders data to pass in the react table below
    const setOrders = () => {
        
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'No of Items',
                    field: 'numofItems',
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
                    width: 100
                },
            ],
            // Table rows data (to be pushed in)
            rows: []
        }

        // For each order push data in the table rows
        orders.forEach(order => {

            data.rows.push({
                id: order._id,
                numofItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions: <Fragment>
                    <div className='d-flex'>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-eye"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ms-2" onClick={() => deleteOrderHandler(order._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>
                </Fragment>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'All Orders'} />
            <div className="row">
                
                {/* Sidebar */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                {/* Display installed react table with the setOrders function above as data */}
                <div className="col-12 col-xl-10 px-4">
                    <Fragment>
                        <h1 className="my-5">All Orders</h1>

                        {/* If orders have been loaded */}
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
                </div>
            </div>
        </Fragment>
    )
}

export default OrdersList