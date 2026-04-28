import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSend, MdArrowBack } from 'react-icons/md';
import { auth } from '../firebase';

function Chat({ userData, language }) {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ 
          query: userMessage.content, 
          context: userData, 
          language 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch answer');
      }

      setChatHistory(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'error', content: 'Failed to connect to AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          ←
        </button>
        <h2>{language === 'English' ? 'Ask VoteWise AI' : 'VoteWise AI से पूछें'}</h2>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chatHistory.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 'auto', marginBottom: 'auto' }}>
              {language === 'English' 
                ? 'Ask me anything about voting, registration, or IDs!' 
                : 'मुझसे मतदान, पंजीकरण या आईडी के बारे में कुछ भी पूछें!'}
            </div>
          )}
          
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
              padding: '12px 16px',
              borderRadius: '12px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
              borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '12px',
              maxWidth: '80%',
              color: msg.role === 'error' ? 'var(--danger-color)' : 'white'
            }}>
              {msg.content}
            </div>
          ))}
          
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)' }}>
              {language === 'English' ? 'AI is typing...' : 'AI लिख रहा है...'}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          className="input-field" 
          style={{ marginBottom: 0 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === 'English' ? 'Type your question...' : 'अपना प्रश्न टाइप करें...'}
          disabled={loading}
        />
        <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={loading}>
          {language === 'English' ? 'Send' : 'भेजें'}
        </button>
      </form>
    </div>
  );
}

export default Chat;
