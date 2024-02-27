// In TradeAnalysis.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { TeamContext } from '../TeamContext'; // Adjust the path as necessary

import './PlayerComparer.css';
import './TradeAnalysis.css';

// Gather players in each side of trade stage
const extractPlayerNamesFromTrade = (tradeData) => {
    let teamBGetPlayerNames = [];
    let teamAGivePlayerNames = [];

    // Extract player names from 'get' array (teamA)
    tradeData.get.forEach(player => {
        if (player.name) teamBGetPlayerNames.push(player.name);
    });

    // Extract player names from 'give' array (teamB)
    tradeData.give.forEach(player => {
        if (player.name) teamAGivePlayerNames.push(player.name);
    });

    return {
        teamA: teamAGivePlayerNames,
        teamB: teamBGetPlayerNames
    };
};

// Function to send 'players for trade' names to the backend
const sendTradesToBackend = async (teamAPlayers, teamBPlayers, setFeedbackFn, setIsLoadingFn) => {
    setIsLoadingFn(true);
    try {
        const response = await fetch('http://127.0.0.1:5000/api/analyze-trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teamA: teamAPlayers, teamB: teamBPlayers }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFeedbackFn(data.feedback);
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
        setIsLoadingFn(false);
    }
};

const TradeAnalysis = () => {
    const navigate = useNavigate();
    const { trade } = useContext(TeamContext); // Accessing trade state
    const { teamA, teamB } = extractPlayerNamesFromTrade(trade);
    const [feedback, setFeedback] = useState(null);  // State to hold feedback
    const [isLoading, setIsLoading] = useState(false);

    const handleTradeAnalysis = async () => {
        await sendTradesToBackend(teamA, teamB, setFeedback, setIsLoading);
        setIsLoading(false);
    };

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
                            <div className="player-info">
                                <img className="profile-photo" src={playerPhoto} alt={playerName} />
                                <div className='player-details'>
                                    <div className="player-name">{playerName}</div>
                                    <div className="player-position-team">Position, Team</div>
                                </div>
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
                    <div className="trade-column-header">Players To Give (A)</div>
                    {renderTradeSlots('give')}
                </div>
                <div className="trade-column">
                    <div className="trade-column-header">Players To Get (B)</div>
                    {renderTradeSlots('get')}
                </div>
            </div>
            {isLoading ? (
                <div class="dot-spinner">
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                    <div class="dot-spinner__dot"></div>
                </div>
            ) : feedback ? (
                <div className="feedback-container">
                    <h2>Trade Analysis Feedback</h2>
                    <p>{feedback}</p>
                </div>
            ) : (
                <button className="analyze-button" onClick={handleTradeAnalysis}>Analyze</button>
            )}
        </div>
    );
};

export default TradeAnalysis;