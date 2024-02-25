// components/MyItems.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import BidTable from './BidTable';
import '../styles/MyItem.css';
import {isLabelWithInternallyDisabledControl} from "@testing-library/user-event/dist/utils";

const MyItems = ({ user }) => {

    const [userHistory, setUserHistory] = useState([]);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [bid, setBid] = useState({ itemId: null, bids: [] });
    const [username, setUsername] = useState();
    const [displayBids, setDisplayBids] = useState({});
    const [highestId, setHighestId] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const [username, expirationTimestamp] = token.split('|');
        setUsername(username);
    }, []);

    const fetchBidByItemId = async (itemId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bids/${itemId}`);

            if (response.ok) {
                const bidData = await response.json();
                console.log("item set: ", bidData);
                return bidData;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctionitems/my-items?username=${username}`);
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching items:', error.response?.status, error.response?.data);
        }
    };

    const handleCheckBid = async (itemId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bids/getbids?itemId=${itemId}`);
            setBid({ itemId, bids: response.data.data });
            setDisplayBids((prevDisplayBids) => ({
                ...prevDisplayBids,
                [itemId]: !prevDisplayBids[itemId],
            }));

            console.log("r done");
            let highestbid = 0;

            for (let bd of bid.bids) {
                console.log(bd);
                if (bd.amount > highestbid) {
                    highestbid = bd.amount;
                    setHighestId(bd.id);
                }
            }
            console.log("highest bid id: ", highestId);
            console.log("highest bid is: ", highestbid);
        } catch (error) {
            console.error('Error fetching bids from server:', error.response?.status, error.response?.data);
        }
    };

    const handleSell = async (itemId) => {
        try {
            const bidData = await fetchBidByItemId(itemId);
            console.log(bidData);

            const sell = {
                bid: bidData,
                sold: true,
            };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/sell/sellitem`, sell);
            window.alert("Item sold Successfully");
            // Update the items after selling
            fetchItems();
        } catch (error) {
            console.error('Error selling item:', error.response?.status, error.response?.data);
        }
    };

    const handleHistory = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bids/getSoldItemByUsername/${username}`);
            if (response.ok) {
                const userData = await response.json();
                setUserHistory(userData);
                navigate('/user-history', { state: { userData } });
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };


    useEffect(() => {
        fetchItems();
    }, [username]);

    const handleLogout = () => {

        const token = sessionStorage.getItem('token');
        if(token)
        {
            sessionStorage.removeItem('token');
        }
        console.log('Adding a new item');
        navigate('/login');
    };

    return (
        <div className="item-list-container">
            <nav className="navbar">
                <h2>Item List</h2>
                <div className="navbar-actions">
                    <button className="navbar-button" onClick={() => navigate('/item')}>
                        Home
                    </button>
                    <button className="navbar-button" onClick={() => navigate('/add-item')}>
                        Add Item
                    </button>
                    <button className="navbar-button" onClick={() => navigate('/my-items')}>
                        My Items
                    </button>
                    <button className="navbar-button" onClick={handleHistory}>
                        History
                    </button>
                    <button className="navbar-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="item-cards-container">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`item-card ${item.status ? 'sold' : ''}`}
                    >
                        <h3>
              <span style={{ color: item.status ? 'green' : 'black' }}>
                {item.itemName}
              </span>
                            {item.status && <FontAwesomeIcon icon={faCheck} className="sold-icon" />}
                        </h3>
                        <p>Description: {item.description}</p>
                        <p>Current Bid: ${item.currentBid.toFixed(2)}</p>
                        <p>Starting Price: ${item.startingPrice.toFixed(2)}</p>

                        <button onClick={() => handleCheckBid(item.id)}>
                            {displayBids[item.id] ? 'Hide Bids' : 'Check Bids'}
                        </button>

                        {displayBids[item.id] && bid.itemId === item.id && bid.bids.length > 0 && (
                            <BidTable bids={bid.bids} highlightedBidId={highestId} />
                        )}

                        {!item.status && (
                            <button onClick={() => handleSell(item.id)}>Sell</button>
                        )}


                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyItems;
