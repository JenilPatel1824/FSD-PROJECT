import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/UserHistory.css';
import NavBar from "./NavBar"; // Import your CSS file
import { useNavigate } from 'react-router-dom';


function UserHistory() {
    const location = useLocation();
    const { userData } = location.state;
    const navigate = useNavigate();
    const [userHistory, setUserHistory] = useState([]);
    const [username, setUsername] = useState('');


    const [sells, setSells] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const [username, expirationTimestamp] = token.split('|');
        setUsername(username);
    }, []);

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
        setdata();
    }, []);

    const formatBidTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const formatTimestamp = (timestampComponents) => {
        if (!timestampComponents || timestampComponents.length !== 7) {
            return "Invalid Timestamp Components";
        }

        const [year, month, day, hour, minute, second, milliseconds] = timestampComponents;

        const date = new Date(year, month - 1, day, hour, minute, second, milliseconds / 1e6);

        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };


    const setdata = async () => {
        await setSells(userData);
    };

    const handlePayment = async (sellId) => {
        try {
            const paymentAmount = window.prompt('Enter Payment amount');
            const user = userData.find((user) => user.id === sellId);
            const payableAmount = user ? user.bid.amount : 0;

            if (payableAmount === parseInt(paymentAmount, 10)) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sell/pay?sellId=${sellId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const responseData = await response.text();
                    console.log(responseData);
                    handleHistory();
                    window.alert(responseData);
                } else {
                    const errorData = await response.json();
                    console.error('Payment failed:', errorData.message);
                }
            } else {
                window.alert('Not a valid amount');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddItem = () => {
        console.log('Adding a new item');
        navigate('/add-item');
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

    const handleMyItems = () => {
        console.log('Viewing my items');
        navigate('/my-items');
    };



    return (
        <div>
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
            <div className="user-history-container">


                <h1>History</h1>
                <table className="history-table">
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Amount</th>
                        <th>Bid Time</th>
                        <th>Contact Email</th>
                        <th>Payment Status</th>
                        <th>Payment Time</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userData && userData.map((sell) => (
                        <tr key={sell.id}>
                            <td>{sell.bid.item.itemName}</td>
                            <td>{sell.bid.item.description}</td>
                            <td>{sell.bid.amount}</td>
                            <td>{formatBidTime(sell.bid.bidTime)}</td>
                            <td>{sell.bid.item.user.email}</td>
                            <td>{sell.payment ? 'Done' : 'Pending'}</td>
                            <td>{formatTimestamp(sell.paymentTimestamp)}</td>


                            <td>
                                {!sell.payment && (
                                    <button onClick={() => handlePayment(sell.id)}>Pay</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserHistory;
