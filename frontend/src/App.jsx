import './App.css';

import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { TeamProvider } from './TeamContext';
import WelcomePage from './pages/WelcomePage';
import Header from './pages/Header';
import MainContent from './pages/MainContent';
import TeamBuilder from './pages/TeamBuilder';


function App() {
    return (
        <div>
            <TeamProvider> {/* Wrap Routes with TeamProvider */}
                <Router>
                    <Header></Header>
                    
                        <Routes>
                            <Route path="/" element={<WelcomePage />} />
                            <Route path="/home" element={<MainContent />} />
                            <Route path="/team-builder" element={<TeamBuilder />} />
                        </Routes>
                </Router>
            </TeamProvider>
        </div>
    );
};

export default App;
