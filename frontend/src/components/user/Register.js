import React, { Fragment, useState, useEffect } from 'react'

import MetaData from './../layouts/MetaData'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux';

import { register, clearErrors } from '../../actions/userActions';

// We extract and assign the parameter props.history with just { history }
const Register = ({history}) => {

    // This useState hooks will set the user state field onChanging their value in the form below
    // See onChange function below
    const [user, setUser] = useState({
        name:'',
        email:'',
        password:'',
    });

    // Extract fields from the state to be passed in the form data to be dispatched below
    const { name, email, password } = user;

    // This useState hook will set the avatar state field onChanging its value in the form below
    const [avatar, setAvatar] = useState('')

    // This useState hooks will set the avatar preview state field onChanging its value in the form below
    // It has a default image
    const [avatarPreview, setAvatarPreview] = useState('/images/avatar-img.jpg')
    
    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store user with the useSelector hook,
    // To be passed in the front end below and useEffect hook below
    const { error, isAuthenticated, loading } = useSelector(state => state.user)
    const { cartItems } = useSelector(state => state.cart)


    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        // If user is already logged in he will be redirected to the home page
        if(isAuthenticated) {

            // Check if any of the cartItems in the local storage have a user ID corresponding
            // to the ID of the user just logged in. If not remove the items from local storage.
            // First though check that some of the items dont have a "not authenticated" value for the user
            // as if they all have it would recognise the second condition as true anyway. 
            if(cartItems.some(item => item.user !== "not authenticated")) {
                if(cartItems.some(item => item.user._id !== user._id)) {
                    localStorage.removeItem('cartItems')
                }
            }
            
            alert.success('Registered successfully.');

            // Also reload the page when redirecting as we want to show the updated cart, which will
            // be empty. However wait one second since we want to give the alert.success time to show.
            setTimeout(() => history.push('/'),1000)
            setTimeout(() => history.go(),1000)
        }

        // If there is an error show alert from the react-alert package
        if(error) {

            // Don't show the error alert if its equal to the below text, since this error is generated
            // by the loadUser action that loads from the app and therefore on every page, but it is
            // irrelevant in the login page
            if(error !== 'Login to access this page') {
                alert.error(error);
            }
            
            dispatch(clearErrors());
        }

        // We can also add all data that we want to watch in an array as a second parameter
        // So whenever there is a change in any of the parameters below, the useEffect hook will
        // be called
    }, [dispatch, alert, error, isAuthenticated, history])

    // This function will run on submitting the form
    // It will dispatch the register action function to the reducer with the form data
    // set below
    const submitHandler = (e) => {

        e.preventDefault();

        // Check if any user fields are empty, if so alert user to fill them
        for(let field in user) {
            if(user[field] === '') {

                alert.error(`Please add a ${field}`);
            }
        }

        // Check if avatar field is empty, if so alert user to add it
        if(avatar === '') {

            alert.error("Please add an avatar")
        }

        // Function to be passed in the "every" method, to check if all user fields are filled
        const isFilled = (value) => value !== '';
        
        // If they are submit the form by dispatching the register action 
        // Object.values turn object values into an array, so we can use the every method on it
        if(Object.values(user).every(isFilled) && avatar !== '') {

            // Set the form data with the the user state fields
            const formData = new FormData();
            formData.set('name', name);
            formData.set('email', email);
            formData.set('password', password);
            formData.set('avatar', avatar);

            dispatch(register(formData))
        } 
    }

    // onChange function to set all states
    const onChange = e => {

        // If the field being changed is the avatar set both the avatar and
        // the avatar preview to the uploaded file
        if(e.target.name === 'avatar') {

            const reader = new FileReader();

            reader.onload = () => {

                if(reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {

            // Else return all non targeted user state fields and change the 
            // targeted field (grab it by its name) and set it to its value
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    return (
        <Fragment>
            <MetaData title={'Register'}/>
            <div className="row wrapper"> 
                <div className="col-10 col-lg-5">

                    {/* Register form */}
                    <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                        <h1 className="mb-3">Register</h1>
                        
                        {/* Name */}
                        <div className="form-group mb-3">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group mb-3">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={onChange}
                            />
                        </div>
            
                        {/* Password */}
                        <div className="form-group mb-3">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={onChange}
                            />
                        </div>

                        {/* Avatar */}
                        <div className='form-group mb-3'>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar me-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept='images/*'
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label btn mt-0' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>
            
                        {/* Submit button */}
                        <button
                            id="register_button"
                            type="submit"
                            className="btn d-block w-100 py-3"
                            disabled={loading ? true : false}
                            >
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default Register