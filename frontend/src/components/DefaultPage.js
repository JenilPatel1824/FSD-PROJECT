// LoginPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import '../styles/DefaultPage.css';

const DefaultPage = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Welcome to our App!</h1>

                <div className="option">
                    <Link to="/login">
                        <button>
                            <FontAwesomeIcon icon={faSignInAlt} />
                            <span>Login</span>
                        </button>
                    </Link>
                </div>

                <div className="option">
                    <Link to="/signup">
                        <button>
                            <FontAwesomeIcon icon={faUserPlus} />
                            <span>Sign Up</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DefaultPage;
