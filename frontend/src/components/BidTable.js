// components/BidTable.js

import React from 'react';
import '../styles/BidTable.css';

const BidTable = ({ bids, highlightedBidId }) => {
    return (
        <div className="bid-table-container">
            <h4>Bids for Item</h4>
            <table className="bid-table">
                <thead>
                <tr>
                    <th>Bid Amount</th>
                    <th>Bid Time</th>
                    <th>Bidder</th>
                    <th>Email</th>
                    {/* Add more headers if needed */}
                </tr>
                </thead>
                <tbody>
                {bids.map((bid) => (
                    <tr key={bid.id} className={bid.id === highlightedBidId ? 'highlighted-bid' : ''}>
                        <td>${bid.amount.toFixed(2)}</td>
                        <td>{new Date(bid.bidTime).toLocaleString()}</td>
                        <td>{bid.bidder.username}</td>
                        <td>{bid.bidder.email}</td>
                        {/* Add more cells if needed */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BidTable;
