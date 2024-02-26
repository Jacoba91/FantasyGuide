import './App.css';

import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { TeamProvider } from './TeamContext';
import { ComparisonProvider } from './ComparisonContext';
import WelcomePage from './pages/WelcomePage';
import Header from './components/Header';
import MainContent from './pages/MainContent';
import TeamBuilder from './pages/TeamBuilder';
import PlayerComparer from './pages/PlayerComparer';
import TradeAnalysis from './pages/TradeAnalysis';
import NewsFeed from './pages/NewsFeed';


function App() {
    return (
        <div>
            <TeamProvider> {/* Wrap Routes with TeamProvider and ComparisonProvider */}
                <ComparisonProvider>
                    <Router>
                        <Header></Header>
                            <Routes>
                                <Route path="/" element={<WelcomePage />} />
                                <Route path="/home" element={<MainContent />} />
                                <Route path="/compare" element={<PlayerComparer />} />
                                <Route path="/team-builder" element={<TeamBuilder />} />
                                <Route path="/trade-analysis" element={<TradeAnalysis />} />
                                <Route path="/news" element={<NewsFeed />} />
                            </Routes>
                    </Router>
                </ComparisonProvider>
            </TeamProvider>
        </div>
    );
};

export default App;
