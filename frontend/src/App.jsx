import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ReportsList from './components/Reports/ReportsList';
import CreateReportForm from './components/Reports/CreateReportForm';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import AdminPanel from './components/Admin/AdminPanel';
import './index.css';

function App() {
  // Retrieve the API key from environment variables
  const apiKey = import.meta.env.VITE_Maps_API_KEY;

  if (!apiKey) {
    // A simple error message if the key is missing. 
    // You could render a more styled component here.
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Configuration Error</h1>
        <p>Google Maps API key is not configured. Please add VITE_Maps_API_KEY to your .env file.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ReportsList />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route 
                path="/create-report" 
                element={
                  <ProtectedRoute>
                    <CreateReportForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </APIProvider>
  );
}

export default App;