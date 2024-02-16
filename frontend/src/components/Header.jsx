import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="header-container">
            <div className="nav-left">
                <a href="/home">Home</a>
                <a href="/compare">Compare</a>
                <a href="/team-builder">Team Builder</a>
                <a href="/trade-analysis">Trade Analysis</a>
                <a href="/news">News</a>
            </div>
            <div className="nav-right">
                <a href="/" className="site-title">Fantasy Guide</a>
                {/* Placeholder for logo */}
            </div>
        </div>
    );
};

export default Header;