// Create TeamContext for centralized roster mgmt, cross-page updates
import React, { createContext, useReducer } from 'react';

// Define your initial roster state and reducer function
const initialRosterState = {
    team: {
        QB: { name: null, photo: null },
        WR: [{ name: null, photo: null }, { name: null, photo: null }],
        RB: [{ name: null, photo: null }, { name: null, photo: null }],
        TE: { name: null, photo: null },
        Flex: { name: null, photo: null },
        Bench: Array(6).fill({ name: null, photo: null }),
    }
};

const initialTradeState = {
    trades: Array(3).fill({ name: null, position: null, team: null, photo: null }),
}

const teamReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_PLAYER':
            const { targetPosition, player, index } = action.payload;

            if (['WR', 'RB', 'Bench'].includes(targetPosition)) {
                let updatedArray = [...state.team[targetPosition]];
                if (index !== null && index >= 0 && index < updatedArray.length) {
                    updatedArray[index] = player;
                }
                return { ...state, team: { ...state.team, [targetPosition]: updatedArray } };
            } else if (targetPosition === 'Flex') {
                return { ...state, team: { ...state.team, Flex: player } };
            } else {
                return { ...state, team: { ...state.team, [targetPosition]: player } };
            }

        case 'TRADE_PLAYER':
            const { playerForTrade, slot } = action.payload;
            
            
        // ... other actions ...
        default:
            return state;
    }
};

// Create the context
export const TeamContext = createContext();

// Define the provider component
export const TeamProvider = ({ children }) => {
    const [state, dispatch] = useReducer(teamReducer, initialRosterState);

    return (
        <TeamContext.Provider value={{ team: state.team, dispatch }}>
            {children}
        </TeamContext.Provider>
    );
};