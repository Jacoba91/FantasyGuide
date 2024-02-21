// All data retrieved from www.pro-football-reference.com

import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TeamContext } from '../TeamContext';
import { ComparisonContext } from '../ComparisonContext';
import playerPhotoUrls from '../components/playerPhotos';


import './MainContent.css';

const columnOrder = ['Rank', 'Player', 'Tm', 'FantPos', 'Age', 'G', 'GS', 'Cmp', 'PAtt', 'PYds', 'PTDs', 'Int', 'RAtt', 'RYds', 'Y/A', 'RTDs', 'Tgt', 'Rec', 'RecYds', 'Y/R', 'RecTDs', 'Fmb', 'FL', 'TotTDs', '2PM', '2PP', 'FantPt', 'PPR', 'DKPt', 'FDPt', 'VBD', 'PosRank', 'OvRank'];

const MainContent = () => {
    // Use useLocation to access query parameters
    const location = useLocation();
    const navigate = useNavigate();

    const [players, setPlayers] = useState(null); // state for player data
    const [visibleChunks, setVisibleChunks] = useState(1); // state to track the number of visible chunks
    const [searchQuery, setSearchQuery] = useState(''); // state for the search query
    const [selectedPosition, setSelectedPosition] = useState('All'); // state for selected position
    const [selectedTeam, setSelectedTeam] = useState('All') // state for selected team
    const [lockedPosition, setLockedPosition] = useState(null); // state for URL-based position
    const [isTeamBuilding, setIsTeamBuilding] = useState(false); // state for team build
    const [isTrading, setIsTrading] = useState(false); // state for trading
    const [indexFromURL, setIndexFromURL] = useState(null);
    
    const searchParams = new URLSearchParams(location.search);
    const slotForComparison = searchParams.get('slot');


    const cleanPlayerName = (name) => {
        // This regex rids of +,* which appear due to original data format
        const regex = /[^a-zA-Z .'-]/g;
    
        // Replace these characters with an empty string
        return name.replace(regex, '');
    };
    
    // Team context
    const { dispatch } = useContext(TeamContext);

    // Compare context
    const { updatePlayerInComparison } = useContext(ComparisonContext);

    // Function to handle the selection of a player for comparison
    const selectPlayerForComparison = (player) => {
        const cleanedName = cleanPlayerName(player.Player);
        const playerForComparison = {
            name: cleanedName,
            photoUrl: playerPhotoUrls[cleanedName] || 'default-placeholder-url',
            team: player.Tm,
            position: player.FantPos,
            age: player.Age,
            games: player.G,
            gamesStarted: player.GS,
            completions: player.Cmp,
            attempts: player.PAtt,
            passingYards: player.PYds,
            passingTDs: player.PTDs,
            interceptions: player.Int,
            rushingAttempts: player.RAtt,
            rushingYards: player.RYds,
            yardsPerAttempt: player['Y/A'],
            rushingTDs: player.RTDs,
            targets: player.Tgt,
            receptions: player.Rec,
            receivingYards: player.RecYds,
            yardsPerReception: player['Y/R'],
            receivingTDs: player.RecTDs,
            fumbles: player.Fmb,
            fumblesLost: player.FL,
            totalTDs: player.TotTDs,
            twoPointConversionsMade: player['2PM'],
            twoPointConversionsPass: player['2PP'],
            fantasyPoints: player.FantPt,
            PPRPoints: player.PPR,
            DKPoints: player.DKPt,
            FDPoints: player.FDPt,
            VBD: player.VBD,
            positionRank: player.PosRank,
            overallRank: player.OvRank
        };
        
        const slotIndex = slotForComparison === 'playerOne' ? 0 : 1; // Convert slot to index
        updatePlayerInComparison(slotIndex, playerForComparison);
        navigate('/compare');
    };

    useEffect(() => {
        // Function to parse query parameters while roster building
        const positionFromURL = searchParams.get('position');

        // Index for player comparisons
        let indexFromURL = searchParams.get('index'); // This will be a string or null

       // Extract 'slotNumber' and 'tradeSlot' from URL parameters
        const slotNumberFromURL = parseInt(searchParams.get('slotNumber'));
        const tradeSlot = searchParams.get('tradeSlot');
        
        if (tradeSlot && !isNaN(slotNumberFromURL)) {
            // enable trading mode if trade slot is clicked, has an index
            setIsTrading(true);
        }
    
        // Resetting the lockedPosition and isTeamBuilding states
        setLockedPosition(null);
        setIsTeamBuilding(false);
    
        if (positionFromURL) {
            if (positionFromURL === 'Flex') {
                setLockedPosition('{"flexPositions":["WR","TE","RB","FB"]}');
            } else if (positionFromURL !== 'Bench') {
                // Apply position lock only if it's not 'Bench'
                setLockedPosition(positionFromURL);
            }
            // Enable team building mode if a position is specified
            setIsTeamBuilding(true);
        }
    
        // Convert index to integer if it's not null
        indexFromURL = indexFromURL !== null ? parseInt(indexFromURL) : null;
        setIndexFromURL(indexFromURL);
    
        // Fetch players data
        fetch('/players')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setPlayers(data)) // Update here
            .catch(error => console.error('Error:', error));
    }, [location]);

    // Function to filter players based on the search query
    const filterPlayers = (players) => {
        return players.filter(player => {
            const fullName = player['Player'].toLowerCase();
            const position = player['FantPos'];
            const team = player['Tm'];
            const matchesName = fullName.includes(searchQuery.toLowerCase());
            const matchesTeam = selectedTeam === 'All' || team === selectedTeam;
    
            // Determine effective position
            const effectivePosition = lockedPosition || selectedPosition;
            let matchesPosition = false;
    
            if (effectivePosition === 'All') {
                matchesPosition = true;
            } else if (effectivePosition.includes('{')) {
                // If effectivePosition is a JSON string (for 'Flex'), parse it
                const flexPositions = JSON.parse(effectivePosition).flexPositions;
                matchesPosition = flexPositions.includes(position);
            } else {
                // Standard position check
                matchesPosition = position === effectivePosition;
            }
    
            return matchesName && matchesPosition && matchesTeam;
        });
    };

    // Handle add player to trade interface
    const handleAddToTrade = (player) => {
        let slotNumberFromURL = parseInt(searchParams.get('slotNumber'));
        let tradeSlot = searchParams.get('tradeSlot');

         // Logic to determine the correct index and dispatch the action
         dispatch({
            type: 'ADD_TO_TRADE',
            payload: {
                 slotType: tradeSlot,
                 player: { name: cleanPlayerName(player.Player), photo: playerPhotoUrls[cleanPlayerName(player.Player)] },
                 index: slotNumberFromURL
            }
        });

        navigate('/trade-analysis');
    };

    // Function for adding player
    const handleAddPlayer = (player) => {
        let targetPosition = player.FantPos;
        let index = indexFromURL !== null ? parseInt(indexFromURL) : null;
        let isFlexLocked = false;
    
        // Check if lockedPosition is a JSON string
        if (lockedPosition && lockedPosition.startsWith('{')) {
            try {
                const lockedPosObj = JSON.parse(lockedPosition);
                if (lockedPosObj.flexPositions && lockedPosObj.flexPositions.includes(player.FantPos)) {
                    isFlexLocked = true;
                }
            } catch (error) {
                console.error('Error parsing lockedPosition:', error);
            }
        } else if (lockedPosition && ['WR', 'RB'].includes(lockedPosition)) {
            // Handle direct string positions like WR or RB
            targetPosition = lockedPosition;
        }
    
        // Handling Flex position
        if (isFlexLocked) {
            targetPosition = 'Flex';
        } 
        
        // Bench slots have an index but no position lock
        else if (index !== null && lockedPosition === null) {
            targetPosition = 'Bench';
        }

        const photoUrl = playerPhotoUrls[cleanPlayerName(player.Player)] || 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';
    
        dispatch({
            type: 'ADD_PLAYER',
            payload: {
                targetPosition,
                player: { name: cleanPlayerName(player.Player), photo: photoUrl },
                index
            }
        });
    
        navigate('/team-builder');
    };

    // Function to get chunks of players
    const getChunks = (array, chunkSize) => {
        let results = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            results.push(array.slice(i, i + chunkSize));
        }
        return results;
    };

    // Function to load more chunks
    const loadMoreChunks = () => {
        setVisibleChunks(prevVisibleChunks => prevVisibleChunks + 1);
    };

    // Render table header
    const renderTableHeader = () => (
        <thead>
            <tr>
                {columnOrder.map((column, index) => (
                    <th key={index}>{column}</th>
                ))}
                {isTeamBuilding && <th>Add Player</th>} {/* Conditionally render add player header */}
                {(slotForComparison === 'playerOne' || slotForComparison === 'playerTwo') && <th>Compare</th>} {/* Conditional header for Compare */}
                {(slotForComparison === 'Receiving' || slotForComparison === 'Giving') && <th>Trade</th>} {/* Conditional header for Trades*/}
            </tr>
        </thead>
    );

    if (players && players.length > 0) {
        const filteredPlayers = filterPlayers(players);
        const chunks = getChunks(filteredPlayers, 20);
        return (
            <div className='table-container'>
                <h1 className='home-header'>2023 Fantasy Results</h1>
                <div className='form-container'>
                    <div className='form'>
                        <input 
                            type="text" 
                            className='input'
                            placeholder="Search by player name..."
                            required=""
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span class="input-border"></span>
                    </div>

                    <select 
                        className='select-dropdown' 
                        value={lockedPosition || selectedPosition} 
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        disabled={!!lockedPosition}
                    >
                        <option value="All">All Positions</option>
                        <option value="QB">QB</option>
                        <option value="RB">RB</option>
                        <option value="FB">FB</option>
                        <option value="TE">TE</option>
                        <option value="WR">WR</option>
                        <option value='{"flexPositions":["WR","TE","RB","FB"]}'>Flex</option>
                    </select>

                    <select 
                        className='select-dropdown' 
                        value={selectedTeam} 
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        <option value="All">All Teams</option>
                        <option value="ARI">ARI</option>
                        <option value="ATL">ATL</option>
                        <option value="BAL">BAL</option>
                        <option value="BUF">BUF</option>
                        <option value="CAR">CAR</option>
                        <option value="CHI">CHI</option>
                        <option value="CIN">CIN</option>
                        <option value="CLE">CLE</option>
                        <option value="DAL">DAL</option>
                        <option value="DEN">DEN</option>
                        <option value="DET">DET</option>
                        <option value="GNB">GNB</option>
                        <option value="HOU">HOU</option>
                        <option value="IND">IND</option>
                        <option value="JAX">JAX</option>
                        <option value="KAN">KAN</option>
                        <option value="LAC">LAC</option>
                        <option value="LAR">LAR</option>
                        <option value="LVR">LVR</option>
                        <option value="MIA">MIA</option>
                        <option value="MIN">MIN</option>
                        <option value="NOR">NOR</option>
                        <option value="NWE">NWE</option>
                        <option value="NYG">NYG</option>
                        <option value="NYJ">NYJ</option>
                        <option value="PHI">PHI</option>
                        <option value="PIT">PIT</option>
                        <option value="SEA">SEA</option>
                        <option value="SFO">SFO</option>
                        <option value="TAM">TAM</option>
                        <option value="TEN">TEN</option>
                        <option value="WAS">WAS</option>
                    </select>
                </div>
                
                {chunks.slice(0, visibleChunks).map((chunk, chunkIndex) => (
                    <table key={chunkIndex}>
                        {renderTableHeader()}
                        <tbody>
                            {chunk.map((player, playerIndex) => (
                                <tr key={playerIndex}>
                                    {columnOrder.map((column, columnIndex) => (
                                        <td key={columnIndex}>{player[column]}</td>
                                    ))}
                                    {isTeamBuilding && (
                                        <td>
                                            <button className='add-player' onClick={() => handleAddPlayer(player)}>
                                                Add Player
                                            </button>
                                        </td>
                                    )}
                                    {(slotForComparison === 'playerOne' || slotForComparison === 'playerTwo') && (
                                        <td>
                                            <button className='add-player' onClick={() => selectPlayerForComparison(player)}>
                                                Compare
                                            </button>
                                        </td>
                                    )}
                                    {isTrading && (
                                        <td>
                                            <button className='add-player' onClick={() => handleAddToTrade(player)}>
                                                Trade Player
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}      
                        </tbody>
                    </table>
                ))}
                {visibleChunks * 15 < players.length && (
                    <button className='load-more' onClick={loadMoreChunks}>Load More</button>
                )}
            </div>
        );
    } else {
        return <div>Loading data...</div>;
    }
};

export default MainContent;