// components/ItemList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ItemList.css';

const ItemList = ({ user }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    const [username, setUsername] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [selectedItem, setSelectedItem] = useState(null); // Track the selected item
    const [userobj, setUserobj]=useState({});
    const [itemId,setItemId]=useState('');
    const [item,setItem]=useState({});

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

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const [username, expirationTimestamp] = token.split('|');
        setUsername(username);
        console.log('Username:', username);
    }, []);


    const fetchUserByUsername = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${username}`);

            if (response.ok) {
                const userData = await response.json();
                setUserobj(userData);
                console.log("user set: ",userData);
                return userData;
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
            console.log("Item called");
            const response = await fetch(`http://localhost:8080/api/${itemId}`);

            if (response.ok) {
                const itemData = await response.json();
                setItem(itemData);
                console.log("item set: ",itemData);
                return itemData;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };


    // useEffect(() => {
    //     const fetchUserByUsername = async () => {
    //         try {
    //             console.log("Before send "+username);
    //             const response = await fetch(`http://localhost:8080/api/users/${username}`);
    //
    //             if (response.ok) {
    //                 const userData = await response.json();
    //                 setUsert(userData);
    //                 console.log("set to user: ",usert);
    //             } else {
    //                 // Handle error response
    //                 const errorData = await response.json();
    //                 console.error('Error:', errorData.error);
    //             }
    //         } catch (error) {
    //             // Handle network errors or other exceptions
    //             console.error('Error:', error.message);
    //         }
    //     };
    //     fetchUserByUsername();
    // }, [username]);

    // useEffect(() => {
    //     const fetchItemByItemname = async () => {
    //         try {
    //             console.log("Before send "+itemId);
    //             const response = await fetch(`http://localhost:8080/api/${itemId}`);
    //
    //             if (response.ok) {
    //                 const itemData = await response.json();
    //                 setItem(itemData);
    //                 console.log("set to item: ",itemData);
    //             } else {
    //                 // Handle error response
    //                 const errorData = await response.json();
    //                 console.error('Error:', errorData.error);
    //             }
    //         } catch (error) {
    //             console.error('Error:', error.message);
    //         }
    //     };
    //     fetchItemByItemname();
    // }, [itemId]);

    const handlePlaceBid = async (itemId) => {
        try {

           const userData= await fetchUserByUsername();
          const itemData=await fetchItemByItemId(itemId);


            console.log("Sending Request for bid with user: ",userData+ " amount: "+bidAmount+" for item: "+itemData);

            const response = await axios.post(`http://localhost:8080/api/placebid`, {
                item:itemData,
                amount: bidAmount,
                bidder: userData,
            });

            console.log(`Bid placed successfully for item ${itemId}. Response:`, response.data);

            // Reset the bidAmount and selected item after placing the bid
            setBidAmount('');
            setSelectedItem(null);
        } catch (error) {
            console.error('Error placing bid:', error);
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

                        {/* Display bid input only for the selected item */}
                        {selectedItem === item.id && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Bid Amount"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                />
                                <button onClick={() => handlePlaceBid(item.id)}>Place Bid</button>
                            </div>
                        )}

                        {/* Show Place Bid button only if bid input is not already displayed */}
                        {selectedItem !== item.id && (
                            <button onClick={() => setSelectedItem(item.id)}>Place Bid</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
