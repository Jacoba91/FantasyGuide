import React from 'react';
import { useNavigate } from 'react-router';

import './PlayerComparer.css'
import './TradeAnalysis.css';

const TradeAnalysis = () => {
    const navigate = useNavigate();

    const handleTradePlayers = (slot) => {
        navigate(`/home?slot=${slot}`);
    }

    return (
        <div className='main-content-container'>
            <h1 className='compare-title'>Trade Analysis</h1>
            <div className='comparison-container'>
                <div class="comparison-row">
                    <div className='player-comp-box1' onClick={() => handleTradePlayers('Receiving')}>
                        <p>Select Players To Receive</p>
                    </div>
                    <div className='player-comp-box2' onClick={() => handleTradePlayers('Giving')}>
                        <p>Select Players To Give</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeAnalysis;