import React from 'react'
import { Link } from 'react-router-dom'

// Sidebar component
const Sidebar = () => {
    return (
        <div className="sidebar-wrapper">

            {/* Sidebar nav */}
            <nav id="sidebar">
                <ul className="list-unstyled components">

                    {/* Dashboard title */}
                    <li className="pt-3">
                        <Link to="/dashboard"><i className="fa fa-tachometer"></i> Dashboard</Link>
                    </li>

                    {/* Products dropdown */}
                    <li>
                        <a href="#productSubmenu" data-bs-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-product-hunt"></i> Products</a>
                        <ul className="collapse list-unstyled" id="productSubmenu">
                            <li>
                                <Link to="/admin/products"><i className="fa fa-clipboard"></i> All</Link>
                            </li>

                            <li>
                                <Link to="/admin/product"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                        </ul>
                    </li>

                    {/* Orders link */}
                    <li>
                        <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</Link>
                    </li>

                    {/* Users link */}
                    <li>
                        <Link to="/admin/users"><i className="fa fa-users"></i> Users</Link>
                    </li>

                    {/* Reviews link */}
                    <li>
                        <Link to="/admin/reviews"><i className="fa fa-star"></i> Reviews</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar