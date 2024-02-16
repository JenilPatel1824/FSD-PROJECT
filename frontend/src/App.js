// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ItemList from './components/ItemList';
import Login from './components/Login';
import Signup from './components/Signup';
import AddItem from './components/AddItem';
import Welcome from "./components/Welcome";
import DefaultPage from "./components/DefaultPage";
import MyItems from "./components/MyItems";
import UserHistory from "./components/UserHistory";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // You can implement a function here to check if the user is already logged in
    // and set the user state accordingly.
  }, []);

  const handleLogout = () => {
    // Implement a function to log out the user and update the user state
  };

  return (
      <Router>


          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/user-history" element={<UserHistory setUser={setUser} />} />

            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/add-item" element={<AddItem /> } />
            <Route path="/item" element={<ItemList user={user} />} />
            <Route path="/welcome" element={<Welcome  />} />
            <Route path="/my-items" element={<MyItems  />} />

            <Route path="/" element={<DefaultPage  />} />



          </Routes>

      </Router>
  );
};

export default App;
