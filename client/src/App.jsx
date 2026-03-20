import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [story, setStory] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // 🎙️ Voice Recognition (Set to Tamil)
  const startListening = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Tamil-ne vekkalam, idhu Tanglish and English-aiyum detect pannum
    recognition.lang = 'en-IN'; // Change from ta-IN to en-IN
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setStory(prev => prev + " " + transcript);
    };
    recognition.start();
};

  // 🤖 AI Generation (Tamil Thoughts -> English Scripts)
  const handleGenerate = async () => {
    if (!story) return alert("Please speak or type your story first!");
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-hook', { story });
      setResult(response.data.suggestion);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check if your backend server is running!");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="hero-section">
        <h1>SoulScript AI 🎙️</h1>
        <p>Speak in Tamil. Get cinematic scripts in English.</p>
      </header>

      <div className="input-container">
        <button 
          type="button" 
          className={`mic-btn ${isListening ? 'listening' : ''}`} 
          onClick={startListening}
        >
          {isListening ? "Listening (Tamil)... 🎙️" : "Speak your Story 🎤"}
        </button>

        <textarea 
          placeholder="Untha kadhaiya sollunga... (Tell your story...)"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </div>

      <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
        {loading ? "Translating & Crafting..." : "Transform to English Script"}
      </button>

      {result && (
        <div className="result-box">
          <h3>Your English Podcast Scripts:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;