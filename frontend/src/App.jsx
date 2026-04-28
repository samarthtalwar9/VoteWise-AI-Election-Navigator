import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import { MdLanguage } from 'react-icons/md'

function App() {
  const [language, setLanguage] = useState('English')
  const [journeyData, setJourneyData] = useState(null)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'English' ? 'Hindi' : 'English')
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          VoteWise AI
        </div>
        <div className="navbar-controls">
          <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle Language">
            <MdLanguage size={20} style={{verticalAlign: 'middle', marginRight: '4px'}} />
            {language}
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
