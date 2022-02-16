import React, { Fragment, useEffect } from 'react'

// Import installed react MDBdatatable to display products below
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, deleteProduct, clearErrors } from '../../actions/productActions'

// Display all products
// We extract and assign the parameter props.history with just { history }
const ProductsList = ({ history }) => {

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed.
    const dispatch = useDispatch();

    // We extract data from the state products and product with the useSelector hook,
    // To be passed in the table below.
    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components.
    // This hook will run everytime the page loads or reloads before everything else,
    // So we will check if the user is authenticated as soon as the page loads.
    useEffect(() => {

        // We load the products as soon as the page loads
        dispatch(getAdminProducts());

        if (error) {

            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {

            alert.error(deleteError);
            dispatch(clearErrors())
        }

        // If isDeleted is true in the store, meaning the product was deleted successfully,
        // redirect the admin to the all products page, show the success alert and dispatch 
        // the DELETE_PRODUCT_RESET action which will reset the isDeleted
        // to false since at this point the new product will have been deleted.
        if (isDeleted) {

            alert.success('Product deleted successfully');
            history.push('/admin/products');
            dispatch({ type: 'DELETE_PRODUCT_RESET' })
        }

    }, [dispatch, alert, error, deleteError, isDeleted, history])

    // This function will dispatch the delete product action on clicking the delete button
    // on the product table row.
    const deleteProductHandler = (id) => {

        dispatch(deleteProduct(id))
    }

    // This function contains all products data to pass in the react table below
    const setProducts = () => {

        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc',
                    width: 130
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc',
                    width: 130
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    width: 130
                },
            ],
            // Table rows data (to be pushed in)
            rows: []
        }

        // For each product push data in the table rows
        products.forEach(product => {
            
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions: <Fragment>
                    <div className='d-flex'>
                        {/* We use "a" instead of "Link" here as we want to page to reload to reflect the 
                            updated data */}
                        <a href={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </a>
                        <button className="btn btn-danger py-1 px-2 ms-2" onClick={() => deleteProductHandler(product._id)}>
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
            <MetaData title={'All Products'} />
            <div className="row">

                {/* Sidebar */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                {/* Display installed react table with the setProducts function above as data */}
                <div className="col-12 col-xl-10 px-4">
                    <Fragment>
                        <h1 className="my-5">All Products</h1>

                        {/* If products have been loaded */}
                        {loading === false && (
                            <MDBDataTable
                                data={setProducts()}
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

export default ProductsList