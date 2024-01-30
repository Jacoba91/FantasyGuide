import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamBuilder.css';

const TeamBuilder = () => {
    const [roster, setRoster] = useState({
        QB: { name: null, photo: null },
        WR: [{ name: null, photo: null }, { name: null, photo: null }],
        RB: [{ name: null, photo: null }, { name: null, photo: null }],
        TE: { name: null, photo: null },
        Flex: { name: null, photo: null },
        Bench: Array(6).fill({ name: null, photo: null }),
    });

    const navigate = useNavigate();

    const handleAddPlayerClick = (position) => {
        // Redirect to MainContent with a filter for the position
        navigate(`/home?position=${position}`);
    };

    const renderRosterSlot = (position, index = null) => {
        const player = index !== null ? roster[position][index] : roster[position];
        return (
            <div className="roster-slot" onClick={() => handleAddPlayerClick(position)}>
                <div className="profile-photo">
                    {player.photo ? (
                        <img src={player.photo} alt={player.name || 'Player Photo'} />
                    ) : (
                        <div className="photo-placeholder"></div>
                    )}
                </div>
                <div className="player-info">
                    {position} {index !== null ? index + 1 : ''}: {player.name ? player.name : 'Empty'}
                </div>
            </div>
        );
    };

    return (
        <div className='team-builder-wrap'>
            <div className="team-sheet">
                <h1 className='roster-title'>My Roster</h1>
                <div className="roster">
                    {renderRosterSlot('QB')}
                    {roster.WR.map((_, index) => renderRosterSlot('WR', index))}
                    {roster.RB.map((_, index) => renderRosterSlot('RB', index))}
                    {renderRosterSlot('TE')}
                    {renderRosterSlot('Flex')}
                    {roster.Bench.map((_, index) => renderRosterSlot('Bench', index))}
                </div>
                {/* Add UI for player selection */}
            </div>
            <div className="team-sheet">
                <h1 className='roster-title'>Team Report</h1>
                <div className="team-report">
                </div>
                {/* Add UI for player selection */}
            </div>
        </div>
    );
};

export default TeamBuilder;