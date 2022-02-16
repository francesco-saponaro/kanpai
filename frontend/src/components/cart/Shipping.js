import React, { Fragment, useState } from 'react'

// Import installed countries-list package
import { countries } from 'countries-list'

// Import Checkout steps component in order to display it above the Shipping form
import CheckoutSteps from './CheckoutSteps'

import MetaData from '../layouts/MetaData'

import { useDispatch, useSelector } from 'react-redux'

import { saveShippingInfo } from '../../actions/cartActions'

// We extract and assign the parameter props.history with just { history }
const Shipping = ({ history }) => {

    // The countries-list package comes in a key:value object format for example "US: {name: Unites States, etc..}" 
    // we only want to get the value object to display below
    const countriesList = Object.values(countries)

    // We extract the shippingInfo from the state cart with the useSelector hook,
    // to prefill the shippingInfo form with previously saved data
    const { shippingInfo } = useSelector(state => state.cart)

    // Prefill this data with data from the store if any
    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode)
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)
    const [country, setCountry] = useState(shippingInfo.country)

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // On submitting the form below we dispatch the saveShippingInfo action with the form data below
    // and redirect to the confirm page 
    const submitHandler = (e) => {

        e.preventDefault()

        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }))

        history.push('/confirm')
    }

    return (
        <Fragment>
            <MetaData title={'Shipping Info'} />

            {/* Checkout steps component with shipping as parameter (so with active classes) */}
            <CheckoutSteps shipping />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/* Shipping form */}
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Shipping Info</h1>

                        {/* Address */}
                        <div className="form-group mb-3">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        {/* City */}
                        <div className="form-group mb-3">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        {/* Phone number */}
                        <div className="form-group mb-3">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        {/* Post code */}
                        <div className="form-group mb-3">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        {/* Country */}
                        <div className="form-group mb-3">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                {countriesList.map(country => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Continue button */} 
                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn d-block w-100 py-3"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Shipping