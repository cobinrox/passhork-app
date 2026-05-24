import { useState } from 'react';
import { generatePassword, validatePassword } from './api';
import './App.css';

function App() {
  const [phrase, setPhrase] = useState('');
  const [length, setLength] = useState(15);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generatePassword(phrase, length);
      setResult(data);
    } catch (error) {
      console.error('Failed to generate:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.password);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Passhork v3</h1>
        <p>AI-Assisted Memorable Passwords</p>
      </header>

      <main>
        <section className="input-group">
          <label>Original Phrase (optional)</label>
          <input 
            type="text" 
            value={phrase} 
            onChange={(e) => setPhrase(e.target.value)} 
            placeholder="e.g. To be or not to be"
          />
          
          <label>Target Length: {length}</label>
          <input 
            type="range" 
            min="12" 
            max="20" 
            value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))} 
          />
          
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : '🎲 Generate Password'}
          </button>
        </section>

        {result && (
          <section className="result-card">
            <div className="password-display">
              <code>{result.password}</code>
              <button onClick={copyToClipboard}>📋</button>
            </div>
            <p className="original-phrase">Original: "{result.original}"</p>
            
            <div className="stats">
              <div className="stat">
                <span>Ergonomics:</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${result.ergoScore}%`, backgroundColor: result.ergoScore > 70 ? '#10B981' : '#F59E0B' }}
                  ></div>
                </div>
                <span>{result.ergoScore}%</span>
              </div>
              
              <div className="stat">
                <span>Complexity:</span>
                <span className={result.complexity.isValid ? 'valid' : 'invalid'}>
                  {result.complexity.isValid ? '✓ All met' : '✗ Needs fix'}
                </span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
