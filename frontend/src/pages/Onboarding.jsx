import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Onboarding({ setJourneyData, setUserData, language }) {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [firstTime, setFirstTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    setError(null);

    const payload = { age: parseInt(age), location, firstTimeVoter: firstTime, language };

    try {
      const token = auth && auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/journey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate journey');
      }

      const data = await response.json();
      setJourneyData(data);
      setUserData(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(language === 'English' ? 'Something went wrong. Please try again.' : 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '2.2rem', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 50%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🗳️ VoteWise AI
        </h1>
        <h3 style={{ color: 'var(--accent-glow)', fontWeight: '500', fontSize: '1.1rem' }}>
          {language === 'English' ? 'Your personalized election navigator' : 'आपका व्यक्तिगत चुनाव नेविगेटर'}
        </h3>
      </div>

      {error && <div role="alert" aria-live="assertive" style={{ color: 'var(--danger-color)', marginBottom: '16px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--danger-color)' }}>{error}</div>}

      <form onSubmit={handleSubmit} aria-label="Election Onboarding Form">
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="ageInput" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {language === 'English' ? 'Age' : 'आयु'}
          </label>
          <input 
            id="ageInput"
            type="number" 
            className="input-field" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder={language === 'English' ? 'e.g. 19' : 'उदा. 19'}
            min="0"
            aria-required="true"
            aria-invalid={error && error.includes('age') ? "true" : "false"}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="locationInput" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {language === 'English' ? 'Location (City/State)' : 'स्थान (शहर/राज्य)'}
          </label>
          <input 
            id="locationInput"
            type="text" 
            className="input-field" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={language === 'English' ? 'e.g. Mumbai' : 'उदा. मुंबई'}
            aria-required="true"
          />
        </div>

        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <input 
            type="checkbox" 
            id="firstTime"
            className="custom-checkbox"
            checked={firstTime}
            onChange={(e) => setFirstTime(e.target.checked)}
            aria-label={language === 'English' ? 'First time voter checkbox' : 'पहली बार मतदाता चेकबॉक्स'}
          />
          <label htmlFor="firstTime" style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>
            {language === 'English' ? 'I am a first-time voter' : 'मैं पहली बार मतदान कर रहा हूँ'}
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
          {loading 
            ? (language === 'English' ? 'Generating Journey...' : 'यात्रा बना रहा है...') 
            : (language === 'English' ? 'Start Journey' : 'यात्रा शुरू करें')}
        </button>
      </form>
    </div>
  );
}

export default Onboarding;
