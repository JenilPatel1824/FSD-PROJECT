import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountdownTimer = ({ endTime, itemId }) => {
    const fetchBidByItemId = async (itemId) => {
        try {
            console.log('finding bid for: ' + itemId);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bids/${itemId}`);
            if (response.ok) {
                const bidData = await response.json();
                console.log('item set: ', bidData);
                return bidData;
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleSell = async (itemId) => {
        try {
            const bidData = await fetchBidByItemId(itemId);
            console.log('Bid data: ', bidData);

            const sell = {
                bid: bidData,
                sold: true,
            };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/sell/sellitem`, sell);
            // Update the items after selling
        } catch (error) {
            console.error('Error selling item:', error.response?.status, error.response?.data);
        }
    };

    const calculateTimeLeft = async () => {
        const now = new Date();
        const end = new Date(endTime);

        if (now < end) {
            const timeDiff = Math.max(end - now, 0);
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

            return { hours, minutes };
        } else {
            console.log('Auction ended. Item can be sold at any time.');
            return { canBeSold: true };
        }
    };

    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const calculateInitialTimeLeft = async () => {
            const initialTimeLeft = await calculateTimeLeft();
            setTimeLeft(initialTimeLeft);
        };

        calculateInitialTimeLeft();

        const timer = setInterval(async () => {
            const updatedTimeLeft = await calculateTimeLeft();
            setTimeLeft(updatedTimeLeft);
        }, 60000); // Update every 1 minute

        return () => clearInterval(timer);
    }, []);

    const timerComponents = [];

    if (timeLeft.canBeSold) {
        return <div>Item can be sold at any time.</div>;
    }

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{' '}
            </span>
        );
    });

    return <div>{timerComponents.length ? timerComponents : <span>Item ended</span>}</div>;
};

export default CountdownTimer;
