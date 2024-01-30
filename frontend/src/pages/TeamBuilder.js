import React, { useState } from 'react';
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

    const addPlayerToRoster = (player) => {
        // Implement logic to add player based on position and roster rules
        // Example: Check if the position is already filled, add to Flex if applicable, etc.
    };

    const dropPlayerFromRoster = (position, index) => {
        // Implement logic to remove player from roster
        // Example: Remove player from specified position
    };

    const renderRosterSlot = (position, index = null) => {
        const player = index !== null ? roster[position][index] : roster[position];
        return (
            <div className="roster-slot">
                <div className="profile-photo">
                    {player.photo ? (
                        <img src={player.photo} alt={player.name} />
                    ) : (
                        <div></div> // Placeholder if no photo is available
                    )}
                </div>
                {position} {index !== null ? index + 1 : ''}: {player.name ? player.name : 'Empty'}
                {/* Add buttons or links for adding/dropping players */}
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