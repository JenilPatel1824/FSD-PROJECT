import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/UserHistory.css'; // Import your CSS file

function UserHistory() {
    const location = useLocation();
    const { userData } = location.state;

    const [sells, setSells] = useState([]);

    useEffect(() => {
        setdata();
    }, []);

    const formatBidTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const formatTimestamp = (timestampArray) => {
        if (!timestampArray) {
            return 'N/A';
        }

        const formattedTimestamp = new Date(
            timestampArray[0],
            timestampArray[1] - 1, // Months are 0-indexed in JavaScript Date object
            timestampArray[2],
            timestampArray[3],
            timestampArray[4],
            timestampArray[5],
            timestampArray[6]
        );

        // Formatting to "DD/MM/YYYY HH:mm:ss"
        const day = formattedTimestamp.getDate().toString().padStart(2, '0');
        const month = (formattedTimestamp.getMonth() + 1).toString().padStart(2, '0');
        const year = formattedTimestamp.getFullYear();
        const hours = formattedTimestamp.getHours().toString().padStart(2, '0');
        const minutes = formattedTimestamp.getMinutes().toString().padStart(2, '0');
        const seconds = formattedTimestamp.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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

    return (
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
    );
}

export default UserHistory;
