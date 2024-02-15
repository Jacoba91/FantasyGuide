import './App.css';

import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { TeamProvider } from './TeamContext';
import { ComparisonProvider } from './ComparisonContext';
import WelcomePage from './pages/WelcomePage';
import Header from './pages/Header';
import MainContent from './pages/MainContent';
import TeamBuilder from './pages/TeamBuilder';
import PlayerComparer from './pages/PlayerComparer';
import TradeAnalysis from './pages/TradeAnalysis';


function App() {
    return (
        <div>
            <TeamProvider> {/* Wrap Routes with TeamProvider */}
                <ComparisonProvider>
                    <Router>
                        <Header></Header>
                        
                            <Routes>
                                <Route path="/" element={<WelcomePage />} />
                                <Route path="/home" element={<MainContent />} />
                                <Route path="/compare" element={<PlayerComparer />} />
                                <Route path="/team-builder" element={<TeamBuilder />} />
                                <Route path="/trade-analysis" element={<TradeAnalysis />} />
                            </Routes>
                    </Router>
                </ComparisonProvider>
            </TeamProvider>
        </div>
    );
};

export default App;
