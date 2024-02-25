import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import '../styles/ItemList.css';

const ItemList = ({ user }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [username, setUsername] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [userHistory, setUserHistory] = useState([]);

    useEffect(() => {
        fetchItems();
    }, [username]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const [username, expirationTimestamp] = token.split('|');
        setUsername(username);
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctionitems/items?username=${username}`);
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchUserByUsername = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${username}`);
            if (response.ok) {
                const userData = await response.json();
                return userData;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
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

    const fetchItemByItemId = async (itemId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auctionitems/${itemId}`);
            if (response.ok) {
                const itemData = await response.json();
                return itemData;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handlePlaceBid = async (itemId) => {
        try {
            const userData = await fetchUserByUsername();
            const itemData = await fetchItemByItemId(itemId);

            console.log(`Sending Request for bid with user: ${userData} amount: ${bidAmount} for item: ${itemData}`);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auctionitems/placebid`, {
                item: itemData,
                amount: bidAmount,
                bidder: userData,
            });
            window.alert(`Bid placed successfully for item ${itemId}.`);


            fetchItems();
            if (response.ok) {
                console.log(`Bid placed successfully for item ${itemId}. Response:`, response.data);
                window.alert(`Bid placed successfully for item ${itemId}.`);
            } else {
                console.log('Error:', response.data);
            }

            setBidAmount('');
            setSelectedItem(null);
        } catch (error) {
            console.error('Error placing bid:', error);
            window.alert(error.response.data);
        }
    };

    const handleAddItem = () => {
        console.log('Adding a new item');
        navigate('/add-item');
    };

    const handleMyItems = () => {
        console.log('Viewing my items');
        navigate('/my-items');
    };

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
                    <button className="navbar-button" onClick={handleAddItem}>
                        Add Item
                    </button>
                    <button className="navbar-button" onClick={handleMyItems}>
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
                {items
                    .filter((item) => item.status !== true)
                    .map((item) => (
                        <div key={item.id} className="item-card">
                            <h3>{item.itemName}</h3>

                            <p>Description: {item.description}</p>
                            <p>Current Bid: {item.currentBid}</p>
                            <p>Starting Price: {item.startingPrice}</p>
                            <p>Time Left: <CountdownTimer endTime={item.endTime} itemId={item.id} /></p>

                            {selectedItem === item.id ? (
                                <div>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Enter Bid Amount"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                    />
                                    <button onClick={() => handlePlaceBid(item.id)}>Place Bid</button>
                                </div>
                            ) : (
                                <button onClick={() => setSelectedItem(item.id)}>Place Bid</button>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ItemList;
