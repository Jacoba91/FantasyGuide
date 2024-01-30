import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MainContent.css';

const columnOrder = ['Rank', 'Player', 'Tm', 'FantPos', 'Age', 'G', 'GS', 'Cmp', 'Att', 'Yds', 'TD', 'Int', 'Att', 'Yds', 'Y/A', 'TD', 'Tgt', 'Rec', 'Yds', 'Y/R', 'TD', 'Fmb', 'FL', 'TD', '2PM', '2PP', 'FantPt', 'PPR', 'DKPt', 'FDPt', 'VBD', 'PosRank', 'OvRank'];

const MainContent = () => {
    const [players, setPlayers] = useState(null); // state for player data
    const [visibleChunks, setVisibleChunks] = useState(1); // state to track the number of visible chunks
    const [searchQuery, setSearchQuery] = useState(''); // state for the search query
    const [selectedPosition, setSelectedPosition] = useState('All'); // New state for selected position
    const [selectedTeam, setSelectedTeam] = useState('All') // state for selected team
    const [lockedPosition, setLockedPosition] = useState(null); // State for URL-based position

    // Use useLocation to access query parameters
    const location = useLocation();

    useEffect(() => {
        // Function to parse query parameters
        const searchParams = new URLSearchParams(location.search);
        const positionFromURL = searchParams.get('position');
    
        // Set lockedPosition based on the URL parameter
        setLockedPosition(positionFromURL ? positionFromURL : null);

        // Update lockedPosition if position is provided in the URL
        // Check if the position from URL is 'Flex' and handle accordingly
        if (positionFromURL) {
            if (positionFromURL === 'Flex' || 'Bench') {
                // Set lockedPosition for 'Flex' as JSON string
                setLockedPosition('{"flexPositions":["WR","TE","RB","FB"]}');
            } else {
                // For other positions, set as normal
                setLockedPosition(positionFromURL);
            }
        } else {
            setLockedPosition(null); // Unlock if no position in URL
        }
        
        // API data fetch for main stats table
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
            </tr>
        </thead>
    );

    if (players && players.length > 0) {
        const filteredPlayers = filterPlayers(players);
        const chunks = getChunks(filteredPlayers, 20);
        return (
            <div className='table-container'>
                <h1>2023 Fantasy Results</h1>
                <input 
                    type="text" 
                    placeholder="Search by player name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                    value={lockedPosition || selectedPosition} 
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    disabled={!!lockedPosition} // Disable if lockedPosition is set
                >
                    <option value="All">All Positions</option>
                    <option value="QB">QB</option>
                    <option value="RB">RB</option>
                    <option value="FB">FB</option>
                    <option value="TE">TE</option>
                    <option value="WR">WR</option>
                    <option value='{"flexPositions":["WR","TE","RB","FB"]}'>Flex</option>
                </select>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
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
                
                {chunks.slice(0, visibleChunks).map((chunk, chunkIndex) => (
                    <table key={chunkIndex}>
                        {renderTableHeader()}
                        <tbody>
                            {chunk.map((player, playerIndex) => (
                                <tr key={playerIndex}>
                                    {columnOrder.map((column, columnIndex) => (
                                        <td key={columnIndex}>{player[column]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ))}
                {visibleChunks * 15 < players.length && (
                    <button onClick={loadMoreChunks}>Load More</button>
                )}
            </div>
        );
    } else {
        return <div>Loading data...</div>;
    }
};

export default MainContent;