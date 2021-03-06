import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layouts/MetaData'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { newProduct, clearErrors } from '../../actions/productActions'

// Create new product
// We extract and assign the parameter props.history with just { history }
const NewProduct = ({ history }) => {

    // Category array to populate select element in form below
    const categories = [
        'Single Malt',
        'Blend',
        'Single Grain',
        'Pure Malt',
        'Single Cask',
        'New Malt'
    ]

    // These useState hooks will set the state fields onChanging their value in the form below
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [strength, setStrength] = useState(0);
    const [volume, setVolume] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function.
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store newProduct with the useSelector hook,
    // To be passed in the useEffect hook below
    const { loading, error, success } = useSelector(state => state.newProduct);

    useEffect(() => {

        // If there is an error show alert from the react-alert package
        if (error) {
            
            alert.error(error);
            dispatch(clearErrors())
        }

        // If success is true in the store, meaning the product was created successfully,
        // redirect the admin to the all products page, show the success alert and dispatch 
        // the NEW_PRODUCT_RESET action which will reset the success
        // to false since at this point the new product will have been created.
        if (success) {

            history.push('/admin/products');
            alert.success('Product created successfully');
            dispatch({ type: 'NEW_PRODUCT_RESET' })
        }

    }, [dispatch, alert, error, success, history])

    // This function will run on submitting the form.
    // It will dispatch the newProduct action function to the reducer with the form data
    // set below.
    const submitHandler = (e) => {

        e.preventDefault();

        // Check if these product fields are empty, if so alert user to fill them
        if(name === '') {
            alert.error(`Please add product name`);
        }

        if(description === '') {
            alert.error(`Please add product description`);
        }

        if(price <= 0) {
            alert.error(`Price needs to be higher than 0`);
        }

        if(images.length === 0) {
            alert.error(`Please add product image`);
        }

        // If both are filled, submit the form by dispatching the newProduct action
        if(name !== '' && description !== '' && price > 0 && images.length !== 0) {

            const formData = new FormData();
            formData.set('name', name);
            formData.set('price', price);
            formData.set('strength', strength);
            formData.set('volume', volume);
            formData.set('description', description);
            formData.set('category', category);
            formData.set('stock', stock);

            images.forEach(image => {
                formData.append('images', image)
            })

            dispatch(newProduct(formData))
        }
    }

    const onChange = e => {

        const files = Array.from(e.target.files)

        // Onchange always empty the ImagesPreview and Images state as the user might be
        // changing existing images
        setImagesPreview([]);
        setImages([])

        // For each uploaded file add it to both the ImagesPreview and Images state
        // "oldArray" stands for the files being uploaded on previous iterations, so 
        // for each iteration set the state to the previous iterations plus the current one
        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }


    return (
        <Fragment>
            <MetaData title={'New Product'} />
            <div className="row">

                {/* Sidebar */}
                <div className="col-12 col-xl-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-xl-10">
                    <Fragment>
                        <div className="wrapper my-5">

                            {/* New product form */}
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">New Product</h1>

                                {/* Product name */}
                                <div className="form-group mb-3">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {/* Product price */}
                                <div className="form-group mb-3">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="number"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                {/* Product strength */}
                                <div className="form-group mb-3">
                                    <label htmlFor="strength_field">Strength</label>
                                    <input
                                        type="number"
                                        id="strength_field"
                                        className="form-control"
                                        value={strength}
                                        onChange={(e) => setStrength(e.target.value)}
                                    />
                                </div>

                                {/* Product volume */}
                                <div className="form-group mb-3">
                                    <label htmlFor="volume_field">Volume</label>
                                    <input
                                        type="number"
                                        id="volume_field"
                                        className="form-control"
                                        value={volume}
                                        onChange={(e) => setVolume(e.target.value)}
                                    />
                                </div>

                                {/* Product description */}
                                <div className="form-group mb-3">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>

                                {/* Product category */}
                                <div className="form-group mb-3">
                                    <label htmlFor="category_field">Category</label>
                                    <select className="form-control" id="category_field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        {categories.map(category => (
                                            <option key={category} value={category} >{category}</option>
                                        ))}

                                    </select>
                                </div>

                                {/* Product stock */}
                                <div className="form-group mb-3">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>
                                
                                {/* Product images */}
                                <div className='form-group mb-3 d-flex align-items-center'>

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="me-3" height="70" />
                                    ))}

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label btn mt-0' htmlFor='customFile'>
                                            Choose Image
                                        </label>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn d-block w-100 py-3"
                                    disabled={loading ? true : false}
                                >
                                    CREATE
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default NewProduct