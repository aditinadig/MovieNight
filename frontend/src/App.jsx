import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';  // Import ChakraProvider from Chakra UI
import Dashboard from './pages/Dashboard';  // Assuming Dashboard.js is in the pages folder
import './App.css';
import logo from './logo.svg';  // Make sure you import the logo

function App() {
  return (
    <ChakraProvider> {/* Wrap the app with ChakraProvider */}
      <Router>
        <div className="App">
          <Routes>
            {/* Define the route for the Dashboard page */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Default route */}
            <Route path="/" element={
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            } />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;