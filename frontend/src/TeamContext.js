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

const teamReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_PLAYER':
            const { position, player, index } = action.payload;

            if (!position) {
                console.error("Position is null in ADD_PLAYER action");
                return state;
            }

            if (Array.isArray(state.team[position])) {
                // Array-based position logic
                if (typeof index === 'number' && index >= 0 && index < state.team[position].length) {
                    let updatedArray = [...state.team[position]];
                    updatedArray[index] = player; // Update the specific slot
                    return {
                        ...state,
                        team: { ...state.team, [position]: updatedArray }
                    };
                } else {
                    console.error("Invalid index for position:", position, "Index:", index);
                    return state;
                }
            } else {
                // For single-slot positions (e.g., QB, TE, Flex)
                return {
                    ...state,
                    team: { ...state.team, [position]: player }
                };
            }
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