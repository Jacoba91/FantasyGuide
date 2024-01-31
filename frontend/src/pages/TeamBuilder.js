import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamContext } from '../TeamContext';
import './TeamBuilder.css';

const TeamBuilder = () => {
    const navigate = useNavigate();
    const { team } = useContext(TeamContext);

    // Handler for slot clicks
    const handleSlotClick = (position, index) => {
        const positionsRequiringIndex = ['Bench', 'WR', 'RB'];
        let queryParams = new URLSearchParams({ position });

        if (positionsRequiringIndex.includes(position) && index !== undefined) {
            queryParams.set('index', index.toString());
        }

        navigate(`/home?${queryParams}`);
    };

    // Render single and multiple spot positions
    const renderRosterSlot = (position, player, index = null) => {
        const displayPosition = index !== null ? `${position} ${index + 1}` : position;
        const playerName = player && player.name ? player.name : 'Empty';
        const playerPhoto = player && player.photo ? player.photo : 'path/to/default/photo.png';

        return (
            <div className="roster-slot" onClick={() => handleSlotClick(position, index)}>
                <div className="profile-photo">
                    <img src={playerPhoto} alt={playerName} />
                </div>
                <div className="player-info">
                    {displayPosition}: {playerName}
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

    return (
        <div className='team-builder-wrap'>
            <div className="team-sheet">
                <h1 className='roster-title'>My Roster</h1>
                <div className="roster">
                    {team && team.QB ? renderRosterSlot('QB', team.QB) : <div>QB Position not available</div>}
                    {renderArrayRosterSlots('WR')}
                    {renderArrayRosterSlots('RB')}
                    {team && team.TE ? renderRosterSlot('TE', team.TE) : <div>TE Position not available</div>}
                    {team && team.Flex ? renderRosterSlot('Flex', team.Flex) : <div>Flex Position not available</div>}
                    {renderArrayRosterSlots('Bench')}
                </div>
            </div>
            <div className="team-sheet">
                <h1 className='roster-title'>Team Report</h1>
                <div className="team-report">
                    {/* Content for Team Report */}
                </div>
            </div>
        </div>
    );
};

export default TeamBuilder;