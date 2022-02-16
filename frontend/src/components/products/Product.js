import React from 'react'
// We import the react router Link components to use instead of anchor links
// as unlike <a> it will redirect to another page without reloading the page
import { Link } from 'react-router-dom'

// We extract and assign the parameter product and col from props
// So when using it below we can just use for example product instead of props.product 
const Product = ({ product, col }) => {

    return (
        // For large display we use the props.col sent from Home.js which will
        // be set to a value depending on if we are on the search page or not
        <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
            <div className="card p-3 rounded">

                {/* Product image */}
                <img
                    className="card-img-top mx-auto"
                    src={product.images[0].url}
                    alt={product.name}
                />

                {/* Product body */}
                <div className="card-body ps-0 d-flex flex-column">

                    {/* Product title */}
                    <h5 className="card-title">
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h5>

                    {/* Product ratings */}
                    <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews" className="ms-2">({product.numOfReviews} Reviews)</span>
                    </div>

                    {/* Product price */}
                    <p className="card-text">£{product.price}</p>
                    
                    {/* Product details button */}
                    <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
                </div>
            </div>
        </div>
    )
}

export default Product