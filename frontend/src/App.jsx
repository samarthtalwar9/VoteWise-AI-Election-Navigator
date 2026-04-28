import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import { MdLanguage } from 'react-icons/md'
import { auth, loginWithGoogle, logout } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: 'var(--text-secondary)' }}>We encountered an unexpected error. Please refresh the page.</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [language, setLanguage] = useState('English')
  const [journeyData, setJourneyData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let unsubscribe = () => {};
    if (auth && typeof onAuthStateChanged === 'function' && auth.currentUser !== undefined && !auth.dummy) {
      try {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser)
          setLoadingAuth(false)
        });
      } catch (e) {
        console.error("Auth listener failed", e);
        setLoadingAuth(false);
      }
    } else {
      setLoadingAuth(false);
    }
    return () => unsubscribe();
  }, [])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'English' ? 'Hindi' : 'English')
  }

  const handleLogin = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
      } else {
        throw new Error("Google login not available");
      }
    } catch (error) {
      console.warn("Falling back to Guest mode:", error);
      setIsGuest(true);
    }
  }

  const handleGuestLogin = () => {
    setIsGuest(true);
  }

  const handleLogout = async () => {
    try {
      if (logout && !isGuest) await logout();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setIsGuest(false);
  }

  if (loadingAuth) {
    return <div className="loading-spinner">Loading...</div>
  }

  if (!user && !isGuest) {
    return (
      <div className="login-container">
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '100px auto', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>🗳️ VoteWise AI</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Your personalized election navigator.</p>
          <button className="btn-primary" onClick={handleLogin} style={{ width: '100%', padding: '12px', marginBottom: '12px' }}>
            Sign in with Google
          </button>
          <button className="btn-secondary" onClick={handleGuestLogin} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)', borderRadius: '8px', cursor: 'pointer' }}>
            Continue as Guest
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          VoteWise AI
        </div>
        <div className="navbar-controls">
          <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle Language" style={{ marginRight: '10px' }}>
            <MdLanguage size={20} style={{verticalAlign: 'middle', marginRight: '4px'}} />
            {language}
          </button>
          <button className="btn-primary" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)' }}>
            Logout
          </button>
        </div>
      </nav>
      
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Onboarding setJourneyData={setJourneyData} setUserData={setUserData} language={language} />} />
          <Route path="/dashboard" element={<Dashboard journeyData={journeyData} userData={userData} language={language} />} />
          <Route path="/chat" element={<Chat userData={userData} language={language} />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App
