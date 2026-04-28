import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Onboarding({ setJourneyData, setUserData, language }) {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [firstTime, setFirstTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!age || !location) {
      setError(language === 'English' ? 'Please fill all fields' : 'कृपया सभी फ़ील्ड भरें');
      return;
    }
    if (age < 0) {
      setError(language === 'English' ? 'Invalid age' : 'अमान्य आयु');
      return;
    }

    setLoading(true);
    setError('');

    const payload = { age: parseInt(age), location, firstTimeVoter: firstTime, language };
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/journey` : 'http://localhost:5000/api/journey';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch journey');
      }

      setJourneyData(data);
      setUserData(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '40px' }}>
      <h1 style={{ marginBottom: '16px' }}>
        {language === 'English' ? 'Welcome to VoteWise AI' : 'VoteWise AI में आपका स्वागत है'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        {language === 'English' 
          ? 'Enter your details to get a personalized election journey.' 
          : 'अपना व्यक्तिगत चुनाव यात्रा प्राप्त करने के लिए अपना विवरण दर्ज करें।'}
      </p>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '16px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            {language === 'English' ? 'Age' : 'आयु'}
          </label>
          <input 
            type="number" 
            className="input-field" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={language === 'English' ? 'e.g. 19' : 'उदा. 19'}
            min="0"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            {language === 'English' ? 'Location (City/State)' : 'स्थान (शहर/राज्य)'}
          </label>
          <input 
            type="text" 
            className="input-field" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={language === 'English' ? 'e.g. Mumbai' : 'उदा. मुंबई'}
          />
        </div>

        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="firstTime"
            checked={firstTime}
            onChange={(e) => setFirstTime(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label htmlFor="firstTime">
            {language === 'English' ? 'I am a first-time voter' : 'मैं पहली बार मतदान कर रहा हूँ'}
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading 
            ? (language === 'English' ? 'Generating Journey...' : 'यात्रा बना रहा है...') 
            : (language === 'English' ? 'Start Journey' : 'यात्रा शुरू करें')}
        </button>
      </form>
    </div>
  );
}

export default Onboarding;
