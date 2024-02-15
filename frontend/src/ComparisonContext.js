import React, { createContext, useState } from 'react';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
    const [comparisonPlayers, setComparisonPlayers] = useState([null, null]); // Initialize with two slots

    const updatePlayerInComparison = (slotIndex, player) => {
        setComparisonPlayers(prevPlayers => {
            const updatedPlayers = [...prevPlayers];
            updatedPlayers[slotIndex] = player;
            return updatedPlayers;
        });
    };

    return (
        <ComparisonContext.Provider value={{ comparisonPlayers, updatePlayerInComparison }}>
            {children}
        </ComparisonContext.Provider>
    );
};