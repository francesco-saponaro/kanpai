import React, { Fragment, useState, useEffect } from 'react'

// Import installed react MDBdatatable to display reviews below
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { getProductReviews, deleteReview, clearErrors } from '../../actions/productActions'

// Display all reviews
const ProductReviews = () => {

    // This useState hook will set the productId to be passed in the getProductReviews
    // action function, to whatever the user types in the search form below.
    const [productId, setProductId] = useState('')

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed.
    const dispatch = useDispatch();

    // We extract data from the state productReviews and review with the useSelector hook,
    // To be passed in the table below
    const { error, reviews } = useSelector(state => state.productReviews);
    const { isDeleted, error: deleteError } = useSelector(state => state.review)

    useEffect(() => {

        if (error) {

            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {

            alert.error(deleteError);
            dispatch(clearErrors())
        }

        // If the form as been filled (productId not empty),
        // We load the product reviews as soon as the page loads.
        if (productId !== '') {

            dispatch(getProductReviews(productId))
        }

        // If isDeleted is true in the store, meaning the review was deleted successfully,
        // show the success alert and dispatch the DELETE_USER_RESET action which will reset 
        // the isDeleted to false since at this point the review will have been deleted.
        if (isDeleted) {

            alert.success('Review deleted successfully');
            dispatch({ type: 'DELETE_REVIEW_RESET' })
        }

    }, [dispatch, alert, error, productId, isDeleted, deleteError])

    // This function will dispatch the delete review action on clicking the delete button
    // on the product table row.
    const deleteReviewHandler = (id) => {

        dispatch(deleteReview(id, productId))
    }

    // This function will dispatch the get product review action on clicking the submit button
    // on the search form below.
    const submitHandler = (e) => {

        e.preventDefault();
        dispatch(getProductReviews(productId))
    }

    // This function contains all reviews data to pass in the react table below
    const setReviews = () => {

        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc',
                    width: 250
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc',
                    width: 300
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc',
                    width: 250
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

        // For each review push data in the table rows
        reviews.forEach(review => {
            
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,
                actions:
                    <button className="btn btn-danger py-1 px-2 ms-2" onClick={() => deleteReviewHandler(review._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'Product Reviews'} />
            <div className="row">

                {/* Sidebar */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-xl-10 px-4">
                    <Fragment>
                        
                        {/* Product reviews search form */}
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group mb-3">
                                        {/* Input to enter productId of product to search reviews for */}
                                        <label htmlFor="productId_field">Enter Product ID</label>
                                        <input
                                            type="text"
                                            id="productId_field"
                                            className="form-control"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary d-block w-100 py-3"
                                    >
                                        Search
								    </button>
                                </ form>
                            </div>
                        </div>

                        {/* If reviews exist, as in if the user searched for a product reviews in the search form
                            and the product has any reviews, display installed react table with the setReviews 
                            function above as data */}
                        {reviews && reviews.length > 0 ? (
                            <MDBDataTable
                                data={setReviews()}
                                className="px-3"
                                bordered
                                striped
                                hover
                                scrollX
                            />
                        ) : (
                                <p className="mt-5 text-center">No Reviews.</p>
                            )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default ProductReviews