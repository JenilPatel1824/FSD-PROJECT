// Signup.js

import React, { useState } from 'react';
import '../styles/Signup.css';


const Signup = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("sending server with: ", user);

        try {
            // Make a POST request to the signup endpoint
            const response = await fetch(`${process.env.REACT_APP_API_URL}`+"/api/users/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // You can add other headers if needed
                },
                body: JSON.stringify(user),
            });

            console.log(response.data);

            if (response.ok) {
                // Handle success
                const responseData = await response.json();
                console.log(responseData.data);
                window.alert("Registered Successfully!");

            } else {
                // Handle error
                const errorData = await response.json();

                console.error('Error during signup:', errorData.error);
            }

        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error during signup:', error.message);
            window.alert("Error During Signup");

        }
    };


    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" value={user.username} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={user.password} onChange={handleChange} />
                </label>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
