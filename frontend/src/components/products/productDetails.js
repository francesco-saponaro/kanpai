import React, { Fragment, useState, useEffect } from 'react'

import MetaData from './../layouts/MetaData'

import ListReviews from '../review/ListReviews'

import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux';

import { getProductDetails, newReview, clearErrors } from '../../actions/productActions';
import { addItemToCart } from '../../actions/cartActions';

// We extract and assign the parameter props.match with just { match }
const ProductDetails = ({ match }) => {

    // This useState hook will set the item quantity to be added to the cart
    // on clicking the quantity buttons below
    const [quantity, setQuantity] = useState(1)

    // This useState hook will set the rating on clicking on the modal form stars below and submitting the form 
    const [rating, setRating] = useState(0);

    // This useState hook will set the comment on filling on the modal form textarea below and submitting the form
    const [comment, setComment] = useState('');

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store productDetails and user with the useSelector hook,
    // To be passed in the front end below
    const { loading, error, product } = useSelector(state => state.productDetails)
    const { user, isAuthenticated } = useSelector(state => state.user)

    // We extract data from the store newReview with the useSelector hook,
    // To be passed in the useEffect hook below, since "error" has already been 
    // extracted above, in here we rename error to "reviewError"
    const { error: reviewError, success } = useSelector(state => state.newReview)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So in this casewe will call the getProductDetails function as soon as the page loads, 
    // which will send an action to the reducer which will update the state 
    useEffect(() => {

        // If there is an error from the productDetails or newReview store state
        // show alert from the react-alert package
        if(error) {

            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewError) {

            alert.error(reviewError);
            dispatch(clearErrors())
        }

        // If there is a success variable from the newReview store state show success alert
        if (success) {

            alert.success('Reivew posted successfully')
            dispatch({ type: 'NEW_REVIEW_RESET' })
        }

        // Otherwise get product that matches the URL ID
        dispatch(getProductDetails(match.params.id));

        // We can also add all data that we want to watch in an array as a second parameter
        // So whenever there is a change in any of the parameters below the useEffect hook will
        // be called
    }, [dispatch, alert, error, reviewError, success, match.params.id])

    // Increase desired quantity onClick 
    const increaseQty = () => {

        // Get the count element below, which is the readOnly quantity field
        // and if the count value (taken as a number since its a number type field) is equal
        // or higher than the amount of the product in stock simply return, to not allow
        // the user to select a higher quantity than what's in stock
        const count = document.querySelector('.count');
        if(count.valueAsNumber >= product.stock) {

            alert.error("Cannot exceed amount in stock");
            return
        };

        // Otherwise increase quantity by 1 
        const qty = count.valueAsNumber + 1
        setQuantity(qty)
    }

    // Decrease desired quantity onClick 
    const decreaseQty = () => {

        // Get the count element below, which is the readOnly quantity field
        // and if the count value (taken as a number since its a number type field) is equal
        // or lower than 1 simply return, to not allow the user to select less than 1 quantity
        const count = document.querySelector('.count');
        if(count.valueAsNumber <= 1) return;

        // Otherwise decrease quantity by 1 
        const qty = count.valueAsNumber - 1
        setQuantity(qty)
    }

    // This function dispatches the addItemToCart action function to the reducer onclicking 
    // the submit button
    const addToCart = () => {

        // If the user is not authenticated omit it as parameter as it would have a default value
        // to prevent a null error (check cartActions.js).
        if(isAuthenticated) {
            dispatch(addItemToCart(match.params.id, quantity, user));
        } else {
            dispatch(addItemToCart(match.params.id, quantity));
        }
       
        alert.success('Item Added To Cart')
    }

    // This function will set an index value to the rating stars in the modal form 
    // below. And add a an event listener for clicking or hovering them
    function setUserRatings() {

        const stars = document.querySelectorAll('.star');

        // For each star add an index value and add clicking and hovering event listeners.
        // For each event call the showRatings nested function below
        stars.forEach((star, index) => {

            // Add 1 to it since index is 0 based
            star.starValue = index + 1;

            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })

        // Nested function
        function showRatings(e) {
            
            stars.forEach((star, index) => {

                // On clicking adds or remove an orange color class and and sets the rating state
                // to the index star value of that star.
                if (e.type === 'click') {

                    if (index < this.starValue) {
                        star.classList.add('orange');

                        setRating(this.starValue)
                    } else {
                        star.classList.remove('orange')
                    }
                }
                // On mouseovering adds or remove a red color class depending on its index value
                if (e.type === 'mouseover') {

                    if (index < this.starValue) {
                        star.classList.add('red');
                    } else {
                        star.classList.remove('red')
                    }
                }

                if (e.type === 'mouseout') {

                    star.classList.remove('red')
                }
            })
        }
    }

    // This function will dispatch the newReview action on submitting the modal 
    // form below with the rating and comment state data, and the product ID from the URL
    const reviewHandler = () => {

        const formData = new FormData();

        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', match.params.id);

        dispatch(newReview(formData));
    }

    return (
        <Fragment>
            {/* If order details have been loaded */}
            {loading === false && (
            <Fragment>
            <MetaData title={product.name}/>
            <div className="row f-flex justify-content-around">

                {/* Product image */}
                <div className="col-12 col-xl-5 img-fluid text-center text-xl-start" id="product_image">
                    <img src={product.images[0].url} 
                    alt={product.title} className="d-block w-100" />
                </div>

                {/* Product body */}
                <div className="col-12 col-xl-5 mt-5">

                    {/* Product title and ID */}
                    <h3>{product.name}</h3>
                    <p id="product_id">Product #{product._id}</p>

                    <hr />

                    {/* Product ratings and reviews */}
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                    </div>
                    <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                    <hr />

                    {/* Product price */}
                    <p id="product_price">£{product.price}</p>

                    {/* Quantity selector and Add to cart button */}
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>
                    <button type="button" id="cart_btn" className="btn btn-primary d-inline ms-4" 
                    disabled={product.stock <= 0} onClick={addToCart}>Add to Cart</button>

                    <hr />

                    {/* Product stock status */}
                    <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span></p>

                    <hr />

                    {/* Product description */}
                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>

                    <hr />

                    {/* Submit review button */}
                    {user ? <button id="review_btn" type="button" className="btn btn-primary mt-4" data-bs-toggle="modal" 
                    data-bs-target="#ratingModal" onClick={setUserRatings}>
                                Submit Your Review
                    </button>
                        :
                        <div className="alert alert-danger mt-4" type='alert'>Login to post your review.</div>
                    }

                    {/* Submit review modal */}
                    <div className="row">
                        <div className="rating w-50">
                            <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" 
                            aria-labelledby="ratingModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">

                                        {/* Modal header */}
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                            <button type="button" className="close" data-bs-dismiss="modal" 
                                            aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        {/* Modal body */}
                                        <div className="modal-body">

                                            {/* Ratings */}
                                            <ul className="stars" >
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                            </ul>

                                            {/* Comment */}
                                            <textarea name="review" id="review" className="form-control mt-3" 
                                                      value={comment}
                                                      onChange={(e) => setComment(e.target.value)}>
                                            </textarea>
                                            
                                            {/* Submit modal form */}
                                            <button className="btn my-3 float-end review-btn px-4 text-white" data-bs-dismiss="modal" 
                                            aria-label="Close" onClick={reviewHandler}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
            
            {/* If the product has reviews, display the List reviews component with product.reviews
                as prop, which will display all product reviews */}
            {product.reviews && product.reviews.length > 0 && (
                <ListReviews reviews={product.reviews} />
            )}
            </Fragment>
            )}
        </Fragment>
    )
}

export default ProductDetails