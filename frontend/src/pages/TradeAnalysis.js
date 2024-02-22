// In TradeAnalysis.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { TeamContext } from '../TeamContext'; // Adjust the path as necessary

import './PlayerComparer.css';
import './TradeAnalysis.css';

// Gather players in each side of trade stage
const extractPlayerNamesFromTrade = (tradeData) => {
    let teamAGetPlayerNames = [];
    let teamBGivePlayerNames = [];

    // Extract player names from 'get' array (teamA)
    tradeData.get.forEach(player => {
        if (player.name) teamAGetPlayerNames.push(player.name);
    });

    // Extract player names from 'give' array (teamB)
    tradeData.give.forEach(player => {
        if (player.name) teamBGivePlayerNames.push(player.name);
    });

    return {
        teamA: teamAGetPlayerNames,
        teamB: teamBGivePlayerNames
    };
};

// Function to send 'players for trade' names to the backend
const sendTradesToBackend = async (teamAPlayers, teamBPlayers, setFeedbackFn) => {
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
    }
};

const TradeAnalysis = () => {
    const navigate = useNavigate();
    const { trade } = useContext(TeamContext); // Accessing trade state
    const { teamA, teamB } = extractPlayerNamesFromTrade(trade);
    const [feedback, setFeedback] = useState(null);  // State to hold feedback

    const handleTradeAnalysis = async () => {
        await sendTradesToBackend(teamA, teamB, setFeedback);
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
            {feedback ? (
                <div className="feedback-container">
                    <h2>Trade Analysis Feedback</h2>
                    <p>{feedback}</p>
                </div>
            ) : (
                <button className="add-player" onClick={handleTradeAnalysis}>Analyze</button>
            )}
        </div>
    );
};

export default TradeAnalysis;