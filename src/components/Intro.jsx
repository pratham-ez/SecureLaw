import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Intro.css';

const Intro = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    const question = userInput.trim();
    if (!question) return;

    setChatHistory(history => [...history, { sender: 'user', text: question }]);

    const postData = {
        contents: [{ parts: [{ text: question }] }]
    };

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAPZwG1VkW86SzcGA1SOiQ51_Md2Wqmve0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (response.ok) {
            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;
            setChatHistory(history => [...history, { sender: 'bot', text: botResponse }]);
        } else {
            console.error('Failed to fetch response from AI API');
        }
    } catch (error) {
        console.error('Error fetching response:', error);
    }

    setUserInput('');
  };

  return (
    <div className="intro-container"> 
      <div className="header-container">
        <h1>Secure. Transparent. Efficient. <br />FIRs Reimagined with Blockchain.</h1>
      </div>
      <div className="subheader-container">
        <p>Say Goodbye to Paperwork: Embrace the Efficiency of Blockchain for FIR Management. Secure Filing, Real-Time Access, and Collaborative Investigations - A New Era of Public Safety Awaits.</p>
      </div>
      <div className="new-container">
        <div className="left-container">
          <h1>Already an authorized user?</h1>
          <button onClick={handleLoginClick}>Log In</button>
        </div>
        <div className="divider"></div>
        <div className="right-container">
          <h2>New User</h2>
          <button onClick={handleRegisterClick}>Register</button>
        </div>
      </div>
      <div className="ask-container">
        <div className="ai-info">
          <img src="/star.png" alt="Introducing AI" className="ai-image" />
          <p>Introducing AI. Get your doubts cleared related to any law concerning you.</p>
        </div>
      </div>
      <div className="container">
        <div>
          <h2>Enter your question here:</h2>
          <form onSubmit={handleQuestionSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Ask a question"
            />
            <button type="submit">Ask</button>
          </form>
          <div>
            {chatHistory.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Intro;
