import React, { Fragment, useEffect, useState } from 'react'

import MetaData from './layouts/MetaData'

import Product from './products/Product'

import '../App.css'

// Import installed react pagination package
import Pagination from 'react-js-pagination'

// Import Slider, its range and its default css file from the rc-slider 
// package installed for the filter by price functionality
import { Range } from 'rc-slider'
import 'rc-slider/assets/index.css';

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux';

import { getProducts } from '../actions/productActions';

// Home component
// Pass the props.match object in order to be used to capture URL keyword params 
const Home = ({ match }) => {

    // This useState hook is needed to set the current page below
    // By default is set at page 1
    const [currentPage, setCurrentPage] = useState(1)

    // This useState hook is needed to set price in the Slider range
    // By default is set to an array of the minimum and max value of the range
    const [price, setPrice] = useState([1,1000])

    // This useState hook is needed to set the category below
    const [category, setCategory] = useState('')

    // This useState hook is needed to set the ratings below below
    // By default is set to 0
    const [ratings, setRatings] = useState(0)

    const categories = [
        'Single Malt',
        'Blend',
        'Single Grain',
        'Pure Malt',
        'Single Cask',
        'New Malt'
    ]

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the state products with the useSelector hook,
    // To be passed in the front end below
    const { products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)

    // Capture keyword from the URL sent from the search bar (Search.js), it'll be 
    // empty by default if nothing was searched
    const keyword = match.params.keyword;

    console.log(match.params)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will call the getProducts function as soon as the page loads, which will send an
    // action to the reducer which will update the state 
    useEffect(() => {

        // If there is an error show alert from the react-alert package
        if(error) {

            return alert.error(error)
        }

        // Otherwise dispatch the get products action based on the parameters passed in.
        // Keyword and category will be empty by default, currentPage will be set to 1 by default,
        // price will be set to an array of [1,1000], and rating to 0
        dispatch(getProducts(keyword, currentPage, price, category, ratings));

        // We can also add all data that we want to watch in an array as a second parameter
        // So whenever there is a change in any of the parameters below the useEffect hook will
        // be called
    }, [dispatch, alert, error, keyword, currentPage, price, category, ratings])

    // This function is called onChange(ing) the pagination dashboard below
    // it will call the the setCurrentPage function from the useState hook above
    // to change the current page
    function setCurrentPageNo(pageNumber) {

        setCurrentPage(pageNumber)
    }

    // Set the count variable to all products count
    // And if there is a keyword in the params so if we are in the search page
    // set it to filteredProductsCount so the count of all found products based on the query.
    // This is needed below to show the pagination only when enough products are found
    let count = productsCount;
    
    if(keyword) {

        count = filteredProductsCount
    }

    return (
        <Fragment>
            <MetaData title={'The Japanese Whiskey Hub'}/>

            {/* Products heading */}
            <h1 id="products_heading">Our Japanese Whiskeys</h1>

            {/* Products cards */}
            <section id="products" className="container mt-5">
                <div className="row">
                    
                    {/* If keyword is not empty (if youre in the search page) display the 
                    price slider and the category list along with the products. Otherwise just the products*/}
                    {keyword ? (
                        <Fragment>
                            <div className="col-6 col-md-3 my-5">
                                {/* Slider */}
                                <div className="px-5">
                                    <Range 
                                        // Add all required slider properties
                                        marks={{1:"$1", 1000:"$1000"}}  
                                        min={1}
                                        max={1000}
                                        defaultValue={[1,1000]}
                                        // Set the value of the price in the state on change
                                        value={price}
                                        onChange={price => setPrice(price)}
                                    />
                                </div>

                                <hr className="my-5" />

                                {/* Category list */}
                                <div className="mt-5">
                                    <h4 className="mb-3">
                                        Categories
                                    </h4>

                                    <ul className="ps-0">
                                        {/* Onclicking any of this categories set the state
                                        to the selected category in order to find the products
                                        belonging to this category */}
                                        {categories.map(category => (
                                            <li style={{cursor: 'pointer',
                                                        listStyleType: 'none'}}
                                                key={category}
                                                onClick={() => setCategory(category)}
                                            >
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <hr className="my-3" />

                                {/* Ratings */}
                                <div className="mt-5">
                                    <h4 className="mb-3">
                                        Ratings
                                    </h4>

                                    <ul className="ps-0">
                                        {/* Onclicking any of the rating number row set the state
                                        to the selected rating number in order to find the products
                                        equal or higher to the selected rating */}
                                        {[5,4,3,2,1].map(star => (
                                            <li style={{cursor: 'pointer',
                                                        listStyleType: 'none'}}
                                                key={star}
                                                onClick={() => setRatings(star)}
                                            >
                                                <div className="rating-outer">
                                                    <div className="rating-inner"
                                                         style={{width: `${star * 20}%`}}
                                                    >

                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="col-6 col-md-9">
                                <div className="row">
                                    {/* Map through each product extracted from the state and assign it as 
                                    a prop to a Product component */
                                    products.map(product => (
                                        
                                        // Whenever we iterate through components in react we have 
                                        // to assign the component a unique ID
                                        // We assign a "col" props in order to change the columns display
                                        // in large desktop to 4 since we are in the search page
                                        <Product key={product._id} product={product} col={4} />
                                    ))}
                                </div>
                            </div>
                        </Fragment>
                    ) : (

                        /* Map through each product extracted from the state and assign it as 
                        a prop to a Product component */
                        products.map(product => (

                            // Whenever we iterate through components in react we have 
                            // to assign the component a unique ID
                            // We assign a "col" props in order to change the columns display
                            // in large desktop to 3 since we are not in the search page
                            <Product key={product._id} product={product} col={3} />
                        ))
                    )}
                </div>
            </section>

            {/* Add imported pagination package with all its required properties */}
            {/* Show this only if resPerPage is less than the found products */}
            {resPerPage <= count && (
                <div className="d-flex justify-content-center mt-5">
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resPerPage}
                        totalItemsCount={count}
                        onChange={setCurrentPageNo}
                        nextPageText={'Next'}
                        prevPageText={'Prev'}
                        firstPageText={'First'}
                        lastPageText={'Last'}
                        itemClass={'page-item'}
                        linkClass={'page-link'}
                    />
                </div>
            )}
        </Fragment>
    )
}

export default Home