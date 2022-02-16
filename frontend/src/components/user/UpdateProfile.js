import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layouts/MetaData'

// Import necessary property from react alert to display alerts
import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'

// We also want to extract the loadUser action as we are going to want to pull out the
// fresh updated data once updated
import { updateProfile, loadUser, clearErrors } from '../../actions/userActions'

// We extract and assign the parameter props.history with just { history }
const UpdateProfile = ({ history }) => {

    // This useState hooks will set the various states onChanging their value in the form below
    // See onChange function below
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/avatar-img.jpg')

    const alert = useAlert();

    // This useDispatch hook returns a reference to the redux dispatch function
    // We will use it to dispatch functions as needed
    const dispatch = useDispatch();

    // We extract data from the store user and userprofile with the useSelector hook,
    // To be passed in the front end below
    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.userProfile)

    // The useEffect hook acts like a class lifecycle method but it can be used on
    // functional components
    // This hook will run everytime the page loads or reloads before everything else
    // So we will check if the user is authenticated as soon as the page loads
    useEffect(() => {

        // If user exists set the name, email and avatar to their existing values as soon
        // as the page loads
        if (user) {

            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url)
        }

        if (error) {

            alert.error(error);
            dispatch(clearErrors());
        }

        // If the user has been updated send success message, dispatch the loadUser action to
        // pull out the user with the fresh updated data and then direct the user to its profile page
        if (isUpdated) {

            alert.success('User updated successfully')
            dispatch(loadUser());
            history.push('/profile')

            // And finally reset the "isUpdated" variable to false since the user has already
            // been updated 
            dispatch({
                type: 'UPDATE_PROFILE_RESET'
            })
        }

    }, [dispatch, alert, error, history, isUpdated, user])

    // This function will run on submitting the form
    // It will dispatch the updateProfile action function to the reducer with the form data
    // set below
    const submitHandler = (e) => {

        e.preventDefault();

        // Set the form data with the the user state fields
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);

        dispatch(updateProfile(formData))
    }

    // onChange function to set avatar
    const onChange = e => {

        const reader = new FileReader();

        reader.onload = () => {

            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])

    }
    return (
        <Fragment>
            <MetaData title={'Update Profile'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">

                    {/* Update profile form */}
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-3">Update Profile</h1>

                        {/* Name */}
                        <div className="form-group mb-3">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                onChange={(e) => setEmail(e.target.value)}
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
                                        accept='image/*'
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label btn mt-0' htmlFor='customFile'>
                                        Choose New Avatar
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        {/* Submit button */}
                        <button 
                            type="submit" 
                            className="btn update-btn d-block w-100 py-3"
                            disabled={loading ? true : false}>
                                UPDATE
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProfile