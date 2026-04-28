import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import { MdLanguage } from 'react-icons/md'
import { auth, loginWithGoogle, logout } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

function App() {
  const [language, setLanguage] = useState('English')
  const [journeyData, setJourneyData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'English' ? 'Hindi' : 'English')
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      alert("Failed to sign in. Please try again.")
    }
  }

  if (loadingAuth) {
    return <div className="loading-spinner">Loading...</div>
  }

  if (!user) {
    return (
      <div className="login-container">
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '100px auto', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>🗳️ VoteWise AI</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Your personalized election navigator.</p>
          <button className="btn-primary" onClick={handleLogin} style={{ width: '100%', padding: '12px' }}>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          VoteWise AI
        </div>
        <div className="navbar-controls">
          <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle Language" style={{ marginRight: '10px' }}>
            <MdLanguage size={20} style={{verticalAlign: 'middle', marginRight: '4px'}} />
            {language}
          </button>
          <button className="btn-primary" onClick={logout} style={{ padding: '6px 12px', fontSize: '0.9rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-color)' }}>
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
    </>
  )
}

export default App
