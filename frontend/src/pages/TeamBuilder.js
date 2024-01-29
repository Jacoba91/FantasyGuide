import React, { useState } from 'react';
import './TeamBuilder.css';

const TeamBuilder = () => {
    const [roster, setRoster] = useState({
        QB: null,
        WR: [null, null],
        RB: [null, null],
        TE: null,
        Flex: null,
        Bench: [null, null, null, null, null, null]
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
                {position} {index !== null ? index + 1 : ''}: {player ? player : 'Empty'}
                {/* Add buttons or links for adding/dropping players */}
            </div>
        );
    };

    return (
        <div className="team-builder">
            <h1>Team Builder</h1>
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
    );
};

export default TeamBuilder;