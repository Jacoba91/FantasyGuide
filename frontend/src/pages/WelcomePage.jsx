import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './WelcomePage.css';

import TestConnection from '../TestConnection';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleEnter = () => {
        navigate('/home'); // Navigate to the home page
    };

    return (
        <div className="welcome-container">
            <div className="content">
                <h1>Welcome to Fantasy Guide</h1>
                <p>Your ultimate companion in Fantasy Football.</p>
                <button class="cssbuttons-io-button" onClick={handleEnter} >
                    Get started
                    <div class="icon">
                        <svg
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path
                            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            fill="currentColor"
                        ></path>
                        </svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;