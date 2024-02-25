import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useNavigate} from "react-router-dom";


const AddItem = () => {

    const [userHistory, setUserHistory] = useState([]);

    const navigate = useNavigate();

    const [username, setUsername] = useState();
    const [itemData, setItemData] = useState({
        itemName: '',
        description: '',
        currentBid: '',
        startingPrice: '',
        user: '',
        endTime: null, // Use null for initial value
    });
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const [username, expirationTimestamp] = token.split('|');
        setUsername(username);

        setItemData((prevItemData) => ({
            ...prevItemData,
            user: user,
        }));
    }, [user]);

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
        const fetchUserByUsername = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${username}`);

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    const errorData = await response.json();
                    console.error('Error:', errorData.error);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        fetchUserByUsername();
    }, [username]);

    const handleChange = (e) => {
        setItemData({
            ...itemData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEndTimeChange = (date) => {
        setItemData({
            ...itemData,
            endTime: date,
        });
    };

    const handleAddItem = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auctionitems/add-item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                window.alert('Item Added Successfully!');
                const responseData = await response.json();
                console.log(responseData.data);
            } else {
                window.alert('Error in adding Item!!!');
                const errorData = await response.json();
                console.error('Error during add-item:', errorData.error);
            }

            console.log('Adding item:', itemData);
        } catch (error) {
            console.error('Error during add-item:', error.message);
        }
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
        <div className="box">
            <div className="add-item-container">
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
                <h2>Add Item</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="itemName" style={{ display: 'block' }}>Item Name:</label>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            value={itemData.itemName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" style={{ display: 'block' }}>Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={itemData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startingPrice" style={{ display: 'block' }}>Starting Price:</label>
                        <input
                            type="text"
                            id="startingPrice"
                            name="startingPrice"
                            value={itemData.startingPrice}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endTime" style={{ display: 'block' }}>End Time:</label>
                        <DatePicker
                            selected={itemData.endTime}
                            onChange={handleEndTimeChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="Pp"
                        />
                    </div>

                    <button type="button" onClick={handleAddItem}>
                        Add Item
                    </button>
                </form>
            </div>
        </div>
    );

};

export default AddItem;
