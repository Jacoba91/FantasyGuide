// In TradeAnalysis.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { TeamContext } from '../TeamContext'; // Adjust the path as necessary

import './PlayerComparer.css';
import './TradeAnalysis.css';

const TradeAnalysis = () => {
    const navigate = useNavigate();
    const { trade } = useContext(TeamContext); // Accessing trade state

    const handleSelectPlayers = (slotType, index) => {
        navigate(`/home?tradeSlot=${slotType}&slotNumber=${index}`);
    };

    const renderTradeSlots = (slotType) => {
        return (
            <ul className="trade-list">
                {trade[slotType].map((player, index) => {
                    const playerName = player.name || 'Click to Add';
                    const playerPhoto = player.photo || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';
    
                    return (
                        <li key={index} className="trade-list-item" onClick={() => handleSelectPlayers(slotType, index)}>
                            <img className="profile-photo" src={playerPhoto} alt={playerName} />
                            <div className="player-info">
                                {`${playerName}`}
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className='trade-content-container'>
            <h1 className='compare-title'>Trade Analysis</h1>
            <div className='trade-analysis-container'>
                <div className="trade-column">
                    <div className="trade-column-header">Players To Give</div>
                    {renderTradeSlots('give')}
                </div>
                <div className="trade-column">
                    <div className="trade-column-header">Players To Get</div>
                    {renderTradeSlots('get')}
                </div>
            </div>
            <button className="add-player">Analyze</button>
        </div>
    );
};

export default TradeAnalysis;