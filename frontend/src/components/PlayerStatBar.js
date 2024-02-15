import React, { useState, useEffect } from 'react';

const PlayerStatBar = (props) => {
    const [barWidth, setBarWidth] = useState('0%');

    useEffect(() => {
        let newWidth;
        if (props.max === 1) {
            // Invert the calculation for rank-type stats
            const maxRank = 70; // Set a sensible maximum rank
            newWidth = Math.round((1 - (props.value - 1) / (maxRank - 1)) * 100) + "%";
        } else {
            // Regular calculation for other stats
            newWidth = Math.round((props.value / props.max) * 100) + "%";
        }
        setBarWidth(newWidth);
    }, [props.value, props.max]);

    return (
        <div className='statbar' style={{ '--bar-width': barWidth }}></div>
    );
}

export default PlayerStatBar;