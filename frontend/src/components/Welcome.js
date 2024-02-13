import React from 'react';

const Welcome = () => {
    // Retrieve the user information from sessionStorage or state, depending on your implementation
    const username = 'User'; // Replace with actual user information

    return (
        <div>
            <h2>Welcome, {username}!</h2>
            <p>This is your welcome page. Customize it as needed.</p>
        </div>
    );
};

export default Welcome;
