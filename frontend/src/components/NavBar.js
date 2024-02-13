// components/NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="navbar">

            this is nacv
            <ul>
                <li>
                    <Link to="/add-item">Add Item</Link>
                </li>
                <li>
                    <Link to="/my-items">My Items</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
