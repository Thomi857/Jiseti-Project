import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import MapDisplay from './components/MapDisplay/MapDisplay';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateRecord from './pages/CreateRecord/CreateRecord'; // Import the new component

function App() {
  return (
    <Router>
      {/* Added a div for basic centering and background, assuming Tailwind CSS is set up */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<h1>Home Page</h1>} /> {/* User's existing home route */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report-location" element={<MapDisplayWrapper />} /> {/* User's existing map route */}

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* New route for creating records, protected */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateRecord />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Your existing MapDisplayWrapper function, with added styling for consistency
function MapDisplayWrapper() {
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6 my-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Report Location</h1>
      <MapDisplay setCoordinates={() => {}} />
    </div>
  );
}

export default App;
