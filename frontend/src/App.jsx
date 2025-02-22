
import './App.css'
// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Test from './components/Test';
import Dashboard from './components/Dashboard';
import TestCompleted from './components/TestCompleted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test-completed" element={<TestCompleted />} />
      </Routes>
    </Router>
  );
}

export default App;
