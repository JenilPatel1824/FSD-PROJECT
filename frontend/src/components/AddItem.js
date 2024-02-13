// components/AddItem.js

import React, {useEffect, useState} from 'react';

const AddItem = () => {
    let gusername;

    const [username,setUsername]=useState();
    const [itemData, setItemData] = useState({
        itemName: '',
        description: '',
        currentBid: '5',
        startingPrice: '',
        user:'',
    });
    const [user,setUser]=useState({});


    useEffect(() => {
        const fetchUserByUsername = async () => {
            try {
                console.log("Before send "+username);
                const response = await fetch(`http://localhost:8080/api/users/${username}`);

                if (response.ok) {
                    const userData = await response.json();
                    console.log("actual response ",userData);
                    setUser(userData);
                    console.log("set to user: ",user);
                } else {
                    // Handle error response
                    const errorData = await response.json();
                    console.error('Error:', errorData.error);
                }
            } catch (error) {
                // Handle network errors or other exceptions
                console.error('Error:', error.message);
            }
        };

        fetchUserByUsername();
    }, [username]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        const [username, expirationTimestamp] = token.split('|');
        setUsername(username);

        // Set the username in the state
        setItemData((prevItemData) => ({
            ...prevItemData,
            user: user,  // Here, using the updated state value
        }));

        console.log('Username:', username);
    }, [user]);  // Add 'user' to the dependency array


    const handleChange = (e) => {
        setItemData({
            ...itemData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddItem = async () => {
        // Convert startingPrice to a number
        //const numericStartingPrice = Number(itemData.startingPrice);
       // const numericCurrentBid = parseFloat(itemData.currentBid);





        console.log("sending with: ", itemData);
        console.log("User object", itemData.user);
        try {
            const response = await fetch('http://localhost:8080/api/add-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });

            if (response.ok) {
                // Handle success
                const responseData = await response.json();
                console.log(responseData.data);
            } else {
                // Handle error
                const errorData = await response.json();
                console.error('Error during add-item:', errorData.error);
            }

            console.log('Adding item:', itemData);

        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error during add-item:', error.message);
        }
    };

    return (
        <div className="box">
            <div className="add-item-container">
                <h2>Add Item</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="itemName">Item Name:</label>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            value={itemData.itemName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={itemData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startingPrice">Starting Price:</label>
                        <input
                            type="text"
                            id="startingPrice"
                            name="startingPrice"
                            value={itemData.startingPrice}
                            onChange={handleChange}
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