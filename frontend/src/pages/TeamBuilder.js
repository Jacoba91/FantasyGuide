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
        const playerPhoto = player && player.photo ? player.photo : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg';

        return (
            <div className="roster-slot" onClick={() => handleSlotClick(position, index)}>
                <div className="profile-photo">
                    <img className="profile-photo" src={playerPhoto} alt={playerName} />
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
                    <button class="cta">
                        <span class="hover-underline-animation"> Generate Insights </span>
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
                </div>
            </div>
        </div>
    );
};

export default TeamBuilder;