import { BrowserRouter, Route } from 'react-router-dom'
// Import useEffect hook to call the loadUser function as soon as the app loads
import { useEffect, useState } from 'react'

import axios from 'axios'

// Import components
import Header from './components/layouts/Header'
import Home from './components/Home'
import ProductDetails from './components/products/productDetails'
// Auth or User imports
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'
// Cart Imports
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
// Order Imports
import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'

// Import Admin components
import Dashboard from './components/admin/Dashboard'
import ProductsList from './components/admin/ProductsList'
import NewProduct from './components/admin/NewProduct'
import UpdateProduct from './components/admin/UpdateProduct'
import OrdersList from './components/admin/OrdersList'
import ProcessOrder from './components/admin/ProcessOrder'
import UsersList from './components/admin/UsersList'
import UpdateUser from './components/admin/UpdateUser'
import ProductReviews from './components/admin/ProductReviews'


// Import ProtectedRoute component in order to attach it to whichever route needs to be 
// protected by non-authenticated users.
import ProtectedRoute from './components/route/ProtectedRoute'

// We import the loadUser action function here in the App.js as it is the best place
// as we want to call it first on every page.
// We also must import the store in order to be able to dispatch the action function.
import { loadUser } from './actions/userActions'
import store from './store'

// Import the required elements from the Stripe packages in order to wrap it 
// around the payment route.
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function App() {

    // Load the logged in user and get the stripe API key from the backend 
    // and set it to the state as soon as any page loads.
    const [stripeApiKey, setStripeApiKey] = useState('');

    useEffect(() => {

        store.dispatch(loadUser())

        async function getStripeApiKey() {

            const { data } = await axios.get('/api/v1/stripeapi');

            setStripeApiKey(data.stripeApiKey)
        }

        getStripeApiKey();

    }, [])

    return (
        <BrowserRouter>
            <div className="App">
                {/* Header */}
                <Header />
                {/* Main app container */}
                <div className="container container-fluid main-container">
                    <Route exact path="/" component={Home} />
                    <Route path="/search/:keyword" component={Home} />
                    <Route path="/product/:id" component={ProductDetails} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route exact path="/password/forgot" component={ForgotPassword} />
                    <Route exact path="/password/reset/:token" component={NewPassword} />
                    <Route exact path="/cart" component={Cart} />
                    <ProtectedRoute path="/shipping" component={Shipping} />
                    <ProtectedRoute path="/confirm" component={ConfirmOrder} />
                    <ProtectedRoute path="/success" component={OrderSuccess} />
                    <ProtectedRoute path="/orders/profile" component={ListOrders} />
                    <ProtectedRoute path="/order/:id" component={OrderDetails} />
                    {/* If there's a stripe API key in the state, pass it to the required Stripe
                        elements and wrap it around the Payment route */}
                    {stripeApiKey &&
                      <Elements stripe={loadStripe(stripeApiKey)}>
                        <ProtectedRoute path="/payment" component={Payment} />
                      </Elements>
                    }
                    <ProtectedRoute exact path="/profile" component={Profile} />
                    <ProtectedRoute exact path="/profile/update" component={UpdateProfile} />
                    <ProtectedRoute exact path="/password/update" component={UpdatePassword} />
                </div>

                {/* Admin dashboard and components outside the main container */}
                <div className="dashboard-container">
                  <ProtectedRoute exact path="/dashboard" isAdmin={true} component={Dashboard} />
                  <ProtectedRoute exact path="/admin/products" isAdmin={true} component={ProductsList} />
                  <ProtectedRoute exact path="/admin/product" isAdmin={true} component={NewProduct} />
                  <ProtectedRoute exact path="/admin/product/:id" isAdmin={true} component={UpdateProduct} />
                  <ProtectedRoute exact path="/admin/orders" isAdmin={true} component={OrdersList} />
                  <ProtectedRoute exact path="/admin/order/:id" isAdmin={true} component={ProcessOrder} />
                  <ProtectedRoute exact path="/admin/users" isAdmin={true} component={UsersList} />
                  <ProtectedRoute exact path="/admin/user/:id" isAdmin={true} component={UpdateUser} />
                  <ProtectedRoute exact path="/admin/reviews" isAdmin={true} component={ProductReviews} />
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
