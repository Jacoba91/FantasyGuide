import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComparisonContext } from '../ComparisonContext';

import PlayerStatBar from '../components/PlayerStatBar';

import './PlayerComparer.css';


const PlayerComparer = ({ player }) => {
    const { comparisonPlayers } = useContext(ComparisonContext);
    const navigate = useNavigate();

    const playerOne = comparisonPlayers[0];
    const playerTwo = comparisonPlayers[1];

    const handleSlotClick = (slot) => {
        navigate(`/home?slot=${slot}`);
    };

    const maxStats = {
        age: 45, // Assuming a range up to 45 years for players
        games: 17, // Regular NFL season games
        gamesStarted: 17, // Maximum games a player can start in regular season
        completions: 500, // Upper limit for completions in a season
        attempts: 700, // Maximum passing attempts
        passingYards: 5500, // Record-setting passing yards in a season
        passingTDs: 50, // Upper limit for passing touchdowns
        interceptions: 30, // Higher range for interceptions
        rushingAttempts: 350, // Upper limit for rushing attempts
        rushingYards: 2100, // Record-setting rushing yards in a season
        yardsPerAttempt: 15, // High average yards per attempt
        rushingTDs: 30, // Upper limit for rushing touchdowns
        targets: 200, // Higher range for targets in a season
        receptions: 150, // Record-setting receptions in a season
        receivingYards: 2000, // Upper limit for receiving yards
        yardsPerReception: 30, // High average yards per reception
        receivingTDs: 25, // Upper limit for receiving touchdowns
        fumbles: 15, // High number of fumbles in a season
        fumblesLost: 10, // High number of lost fumbles
        totalTDs: 30, // Total touchdowns (including rushing, receiving, etc.)
        twoPointConversionsMade: 5, // Reasonable upper limit for two-point conversions
        twoPointConversionsPass: 5, // Similar to above
        fantasyPoints: 400, // High scoring for a fantasy season
        PPRPoints: 500, // Points in a PPR league
        DKPoints: 500, // DraftKings fantasy points
        FDPoints: 500, // FanDuel fantasy points
        VBD: 200, // Value-Based Drafting points
        positionRank: 1, // Rank (1 is highest)
        overallRank: 1 // Overall rank (1 is highest)
    };

    const statDisplayNames = {
        age: 'Age',
        games: 'GP', // Games Played
        gamesStarted: 'GS', // Games Started
        completions: 'Cmp', // Completions
        attempts: 'Att', // Passing Attempts
        passingYards: 'Pass Yds', // Passing Yards
        passingTDs: 'Pass TD', // Passing Touchdowns
        interceptions: 'Int', // Interceptions
        rushingAttempts: 'Rush Att', // Rushing Attempts
        rushingYards: 'Rush Yds', // Rushing Yards
        yardsPerAttempt: 'Y/A', // Yards Per Attempt
        rushingTDs: 'Rush TD', // Rushing Touchdowns
        targets: 'Tgt', // Targets
        receptions: 'Rec', // Receptions
        receivingYards: 'Rec Yds', // Receiving Yards
        yardsPerReception: 'Y/R', // Yards Per Reception
        receivingTDs: 'Rec TD', // Receiving Touchdowns
        fumbles: 'Fum', // Fumbles
        fumblesLost: 'Fum Lst', // Fumbles Lost
        totalTDs: 'Total TD', // Total Touchdowns
        twoPointConversionsMade: '2PM', // Two-Point Conversions Made
        twoPointConversionsPass: '2PP', // Two-Point Conversions Pass
        fantasyPoints: 'Fant Pts', // Fantasy Points
        PPRPoints: 'PPR Pts', // PPR Points
        DKPoints: 'DK Pts', // DraftKings Points
        FDPoints: 'FD Pts', // FanDuel Points
        VBD: 'VBD', // Value-Based Drafting
        positionRank: 'Pos Rank', // Position Rank
        overallRank: 'Ov Rank' // Overall Rank
    };

    const renderStatBars = (player) => {
        return Object.entries(player).map(([key, value]) => {
          if (maxStats[key]) {
            const label = statDisplayNames[key] || key; // Use the display name or default to the key
            return (
              <div key={key} className='statbar-row'>
                <label>{label}: {value != null ? value : 'N/A'}</label>
                <PlayerStatBar value={value} max={maxStats[key]} />
              </div>
            );
          }
          return null;
        });
      };

    const PlayerDetails = ({ player }) => (
        <div>
            <h3>{player.name} ({player.position}), {player.team}</h3>
            <img className='player-comp-photo' src={player.photoUrl} alt={player.name} />
            <div className='statbar-container'>
                {renderStatBars(player)}
            </div>
        </div>
    );
    
    return (
        <div className='main-content-container'>
            <h1 className='compare-title'>Player Comparison</h1>
            <div className='comparison-container'>
                <div class="comparison-row">
                    <div className='player-comp-box1' onClick={() => handleSlotClick('playerOne')}>
                        {playerOne ? <PlayerDetails player={playerOne} /> : <p>Select Player 1</p>}
                    </div>
                    <div className='player-comp-box2' onClick={() => handleSlotClick('playerTwo')}>
                        {playerTwo ? <PlayerDetails player={playerTwo} /> : <p>Select Player 2</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerComparer;