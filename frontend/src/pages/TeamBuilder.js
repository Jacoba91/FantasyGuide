import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamContext } from '../TeamContext';
import './TeamBuilder.css';

// Get player names from TeamContext
const extractPlayerNames = (teamData) => {
    let playerNames = [];

    // Gather player names to pass to backend
    Object.keys(teamData).forEach(position => {
        const players = teamData[position];

        if (Array.isArray(players)) {
            // For positions with multiple players (like WR, RB, Bench)
            players.forEach(player => {
                if (player.name) playerNames.push(player.name);
            });
        } else {
            // For single player positions (like QB, TE, Flex)
            if (players.name) playerNames.push(players.name);
        }
    });
    return playerNames;
};

// Function to send player names to the backend
const sendRosterToBackend = async (playerNames) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/update-roster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerNames }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Main component
const TeamBuilder = () => {
    const navigate = useNavigate();
    const { team } = useContext(TeamContext);
    const playerNames = extractPlayerNames(team);
    const [playerResponse, setPlayerResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const [isButtonVisible, setIsButtonVisible] = useState(true); // State for button visibility

    // Get ai insights from backend
    const fetchInsights = async () => {
        try {
            const response = await fetch('/api/update-roster', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerNames }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            let data = await response.json();
    
            if (Array.isArray(data.feedback) && data.feedback.length > 0) {
                let feedbackText = data.feedback[0];
    
                if (typeof feedbackText === 'string') {
                    // First, wrap section headers in <h3> tags
                    let formattedText = feedbackText.replace(/(\d+\..+?)(?=\n|$)/gi, '<h3>$1</h3>');
                
                    // Define an array of subheadings to target, in any case variation
                    const subheadings = [
                        'Strengths:', 
                        'Weaknesses:', 
                        'Potential Player Pickup:', 
                        'Player to Drop:',
                        'Strength 1:',
                        'Strength 2:',
                        'Weakness 1:',
                        'Weakness 2:',
                        '- Handcuff Option #1:',
                        '- Handcuff Option #2:',
                        '- Strength #1:',
                        '- Strength #2:',
                        '- Weakness #1:',
                        '- Weakness #2:'
                    ];
                
                    // Create a regex pattern to match any case variation of the subheadings
                    subheadings.forEach(subheading => {
                        // Escape special characters and allow for any amount of whitespace
                        const escapedSubheading = subheading.replace(/([:.])/g, '\\$1');
                        const regexPattern = `(${escapedSubheading}\\s*)(?=\n|$)`;
                
                        const regex = new RegExp(regexPattern, 'gi');
                        formattedText = formattedText.replace(regex, '<h4>$1</h4>');
                    });
                
                    // Replace newline characters with <br> tags
                    formattedText = formattedText.replace(/\n/g, '<br>');
                    // Replace non hyphen '-'
                    formattedText = formattedText.replace(/ - /g, '<br>• ');

                
                    // Display the formatted text
                    document.getElementById('output').innerHTML = formattedText;
                } else {
                    console.log('First element in feedback array is not a string:', feedbackText);
                    // Handle non-string feedback appropriately
                }
            } else {
                console.log('Feedback is not an array or is empty:', data.feedback);
                // Handle empty or non-array feedback appropriately
            }
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    };


    // Handler for slot clicks
    const handleSlotClick = (position, index) => {
        const positionsRequiringIndex = ['Bench', 'WR', 'RB'];
        let queryParams = new URLSearchParams({ position });

        if (positionsRequiringIndex.includes(position) && index !== undefined) {
            queryParams.set('index', index.toString());
        }

        navigate(`/home?${queryParams}`);
    };

    const handleSendData = () => {
        sendRosterToBackend(playerNames);
    };

    // Render single and multiple spot positions
    const renderRosterSlot = (position, player, index = null) => {
        const displayPosition = index !== null ? `${position} ${index + 1}` : position;
        const playerName = player && player.name ? player.name : 'Empty';
        const playerPhoto = player && player.photo ? player.photo : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';

        return (
            <div>
                <div className="roster-slot" onClick={() => handleSlotClick(position, index)}>
                    <div className="profile-photo">
                        <img className="profile-photo" src={playerPhoto} alt={playerName} />
                    </div>
                    <div className="player-info">
                        {displayPosition}: {playerName}
                    </div>
                </div>
            </div>
            
            
        );
    };

    const renderArrayRosterSlots = (position) => {
        if (!team || !team[position] || !Array.isArray(team[position])) {
            return <div>{position} Position not available</div>;
        }

        return team[position].map((player, index) => renderRosterSlot(position, player, index));
    };

    const handleClick = async () => {
        setIsLoading(true);
        setIsButtonVisible(false); // Hide the button
        await handleSendData();
        await fetchInsights();
        setIsLoading(false);
      };

    return (
        <div className='team-builder-wrap'>
            <div className="team-sheet">
                <h1 className='roster-title'>Lineup</h1>
                <div className="roster">
                    {team && team.QB ? renderRosterSlot('QB', team.QB) : <div>QB Position not available</div>}
                    {renderArrayRosterSlots('WR')}
                    {renderArrayRosterSlots('RB')}
                    {team && team.TE ? renderRosterSlot('TE', team.TE) : <div>TE Position not available</div>}
                    {team && team.Flex ? renderRosterSlot('Flex', team.Flex) : <div>Flex Position not available</div>}
                    {renderArrayRosterSlots('Bench')}
                </div>
            </div>
            <div className="team-report-sheet">
                <h1 className='roster-title'>Team Report</h1>
                <div className="report-content">
                    <div className='report-text'>
                        {isButtonVisible && (
                            <button className="cta" onClick={handleClick}>
                                <span className="hover-underline-animation"> Generate Insights </span>
                                    <svg
                                        id="arrow-horizontal"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="10"
                                        viewBox="0 0 46 16"
                                    >
                                        <path
                                            id="Path_10"
                                            data-name="Path 10"
                                            d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                                            transform="translate(30)"
                                        ></path>
                                    </svg>
                            </button>
                        )}
                        {isLoading && <div className="loader"></div>}
                        <div id="output">
                            {playerResponse && <div>{playerResponse}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamBuilder;