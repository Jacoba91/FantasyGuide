// Create TeamContext for centralized roster mgmt, cross-page updates
import React, { createContext, useReducer } from 'react';

// Define initial roster state
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
    trade: {
        get: Array(5).fill({ name: null, photo: null }),
        give: Array(5).fill({ name: null, photo: null }),
    }
};

// Combine initial states
const initialState = {
    ...initialRosterState,
    ...initialTradeState
};

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

        case 'ADD_TO_TRADE':
            console.log('Current state:', state);
            console.log('Action payload:', action.payload);
            const { slotType, player: tradePlayer, index: tradeIndex } = action.payload; // slotType is 'get' or 'give'
            let updatedTradeArray = [...state.trade[slotType]];
            if (tradeIndex >= 0 && tradeIndex < updatedTradeArray.length) {
                updatedTradeArray[tradeIndex] = tradePlayer;
            }
            return { ...state, trade: { ...state.trade, [slotType]: updatedTradeArray } };

        default:
            return state;
    }
};

// Create the context
export const TeamContext = createContext();

// Define the provider component
export const TeamProvider = ({ children }) => {
    const [state, dispatch] = useReducer(teamReducer, initialState);

    return (
        <TeamContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TeamContext.Provider>
    );
};