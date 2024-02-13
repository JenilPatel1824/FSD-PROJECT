// components/ItemList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BidTable from './BidTable';
import '../styles/MyItem.css';

const MyItems = ({ user }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [bid, setBid] = useState({ itemId: null, bids: [] });
    const [username, setUsername] = useState();
    const [displayBids, setDisplayBids] = useState({});

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const [username, expirationTimestamp] = token.split('|');
        setUsername(username);
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/my-items?username=${username}`);
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching items:', error.response?.status, error.response?.data);
        }
    };

    const handleCheckBid = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/bids/getbids?itemId=${itemId}`);
            setBid({ itemId, bids: response.data.data });
            setDisplayBids((prevDisplayBids) => ({
                ...prevDisplayBids,
                [itemId]: !prevDisplayBids[itemId],
            }));
        } catch (error) {
            console.error('Error fetching bids:', error.response?.status, error.response?.data);
        }
    };

    const handleSale = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/bids/getbids?itemId=${itemId}`);
            setBid({ itemId, bids: response.data.data });
            setDisplayBids((prevDisplayBids) => ({
                ...prevDisplayBids,
                [itemId]: !prevDisplayBids[itemId],
            }));
        } catch (error) {
            console.error('Error fetching bids:', error.response?.status, error.response?.data);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [username]);

    return (
        <div className="item-list-container">
            <nav className="navbar">
                <h2>Item List</h2>
                <div className="navbar-actions">
                    <button className="navbar-button" onClick={() => navigate('/add-item')}>
                        Add Item
                    </button>
                    <button className="navbar-button" onClick={() => navigate('/my-items')}>
                        My Items
                    </button>
                </div>
            </nav>

            <ul className="item-list">
                {items.map((item) => (
                    <li key={item.id} className={`item-card ${displayBids[item.id] ? 'selected' : ''}`}>
                        <h3>{item.itemName}</h3>
                        <p>Description: {item.description}</p>
                        <p>Current Bid: {item.currentBid}</p>
                        <p>Starting Price: {item.startingPrice}</p>

                        <button onClick={() => handleCheckBid(item.id)}>
                            {displayBids[item.id] ? 'Hide Bids' : 'Check Bids'}
                        </button>

                        {displayBids[item.id] && bid.itemId === item.id && bid.bids.length > 0 && (
                            <BidTable bids={bid.bids}/>
                        )}
                        <button onClick={handleSale(item.itemId)}>Sell</button>

                    </li>

                ))}
            </ul>
        </div>
    );
};

export default MyItems;
