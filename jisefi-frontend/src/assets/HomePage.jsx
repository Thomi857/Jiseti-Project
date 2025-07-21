import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <header>
                <h1>Welcome to the Home Page</h1>
            </header>
            <main>
                <p>This is the main content of the Home page.</p>
            </main>
            <footer>
                <p>&copy; 2023 Your Company</p>
            </footer>
        </div>
    );
};

export default Home;