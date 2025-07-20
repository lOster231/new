import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import SupportPage from './pages/SupportPage';
import VerifyEmailModal from './components/VerifyEmailModal';
import VerificationResultPage from './pages/VerificationResultPage';
import EditProfilePage from './pages/EditProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import AdminPanelPage from './pages/AdminPanelPage'; // Import AdminPanelPage

// A new component to handle rendering the popup globally
const AppContent: React.FC = () => {
    const { showVerificationPopup } = useAuth();

    return (
        <>
            {showVerificationPopup && <VerifyEmailModal />}
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/verification-result" element={<VerificationResultPage />} />
                    {/* Profile Routes */}
                    <Route path="/profile/edit" element={<EditProfilePage />} />
                    <Route path="/profile/:id" element={<PublicProfilePage />} /> {/* Can be ID or Username */}
                    {/* Admin Panel Route */}
                    <Route path="/admin" element={<AdminPanelPage />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
