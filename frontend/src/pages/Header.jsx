import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="header-container">
            <div className="nav-left">
                <a href="/home">Home</a>
                <a href="/teams">Teams</a>
                <a href="/positions">Positions</a>
                <a href="/team-builder">Team Builder</a>
            </div>
            <div className="nav-right">
                <a href="/" className="site-title">Fantasy Guide</a>
                {/* Placeholder for logo */}
            </div>
        </div>
    );
};

export default Header;