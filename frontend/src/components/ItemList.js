// components/ItemList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ItemList.css';

const ItemList = ({ user }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/items');
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const handlePlaceBid = (itemId) => {
        if (user) {
            console.log(`Placing bid for item ${itemId} as user ${user.username}`);
            // Implement logic to place a bid
        } else {
            console.log('Redirecting to login page');
            // Implement logic to redirect to the login page
        }
    };

    const handleAddItem = () => {
        console.log('Adding a new item');
        navigate('/add-item');
    };

    const handleMyItems = () => {
        console.log('Viewing my items');
        // Implement logic to navigate to the user's own items page
        navigate('/my-items');
    };

    return (
        <div className="item-list-container">
            <nav className="navbar">
                <h2>Item List</h2>
                <div className="navbar-actions">
                    <button className="navbar-button" onClick={handleAddItem}>
                        Add Item
                    </button>
                    <button className="navbar-button" onClick={handleMyItems}>
                        My Items
                    </button>
                </div>
            </nav>

            <ul>
                {items.map((item) => (
                    <li key={item.id} className="item-card">
                        <h3>{item.itemName}</h3>
                        <p>Description: {item.description}</p>
                        <p>Current Bid: {item.currentBid}</p>
                        <p>Starting Price: {item.startingPrice}</p>

                        <button onClick={() => handlePlaceBid(item.id)}>Place Bid</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
