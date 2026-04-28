import { useNavigate } from 'react-router-dom';

function Dashboard({ journeyData, userData, language }) {
  const navigate = useNavigate();

  if (!journeyData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>{language === 'English' ? 'No journey data found.' : 'कोई यात्रा डेटा नहीं मिला।'}</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ width: 'auto', marginTop: '16px' }}>
          {language === 'English' ? 'Go Back' : 'वापस जाएँ'}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '24px' }}>
        <h2>{language === 'English' ? 'Your Voting Journey' : 'आपकी मतदान यात्रा'}</h2>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/chat')}
          style={{ width: 'auto', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)' }}
        >
          {language === 'English' ? 'Ask a Question' : 'प्रश्न पूछें'}
        </button>
      </div>

      <div className="glass-panel" style={{ marginBottom: '24px', borderLeft: '4px solid var(--success-color)' }}>
        <h3 style={{ marginBottom: '8px', color: 'var(--success-color)' }}>
          {language === 'English' ? 'Next Step' : 'अगला कदम'}
        </h3>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>{journeyData.next_step}</p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{journeyData.explanation}</p>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '16px', color: 'var(--accent-color)' }}>
          {language === 'English' ? 'Important Timeline' : 'महत्वपूर्ण समयरेखा'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {journeyData.timeline && journeyData.timeline.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ 
                minWidth: '24px', height: '24px', borderRadius: '50%', 
                background: 'var(--accent-color)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', 
                fontWeight: 'bold', fontSize: '0.8rem' 
              }}>
                {idx + 1}
              </div>
              <div style={{ paddingTop: '2px', lineHeight: '1.4' }}>
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
