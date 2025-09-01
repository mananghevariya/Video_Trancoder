import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';
import BatchUpload from './components/BatchUpload/BatchUpload';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/batch" element={<BatchUpload />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;