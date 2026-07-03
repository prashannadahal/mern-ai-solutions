import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaXmark, FaPaperPlane } from 'react-icons/fa6';
import { chatWithAria } from '../services/api';
import './AIAssistant.css';

const SUGGESTIONS = ['What solutions do you offer?', 'Schedule a demo', 'AI integration pricing', 'How quickly can you deliver?'];

export default function AIAssistant() {
  const [open, setOpen]         = useState(false);
  const [apiKey, setApiKey]     = useState(() => localStorage.getItem('groqKey') || '');
  const [keyInput, setKeyInput] = useState('');
  const [ready, setReady]       = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
  if (apiKey) {
    setReady(true);
    setMessages([
      {
        role: 'assistant',
        content:
          "Hello! I'm **Aria**, your AI Solutions advisor. I can help you understand which of our solutions fits your needs, schedule a demo, or answer questions about AI integration.\n\nWhat can I help you with today?"
      }
    ]);
  }
}, [apiKey]); // eslint-disable-line

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const saveKey = () => {
    if (!keyInput.startsWith('gsk_')) { alert('Please enter a valid Groq key (starts with gsk_)'); return; }
    localStorage.setItem('groqKey', keyInput);
    setApiKey(keyInput);
    setReady(true);
    addAI("Hello! I'm **Aria**, your AI Solutions advisor. I can help you understand which of our solutions fits your needs, schedule a demo, or answer questions about AI integration.\n\nWhat can I help you with today?");
  };

  const addAI = (text) => setMessages(m => [...m, { role: 'assistant', content: text }]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || !ready) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setTyping(true);
    try {
      const res = await chatWithAria(newMessages, apiKey);
      setMessages(m => [...m, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Unable to reach Aria. Please check your API key and connection.' }]);
    } finally {
      setTyping(false);
    }
  };

  const renderText = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  return (
    <>
      <button className={`ai-fab${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} title="Chat with Aria">
        {open ? <FaXmark /> : <FaRobot />}
      </button>

      <div className={`ai-window${open ? ' open' : ''}`}>
        {/* Header */}
        <div className="ai-header">
          <div className="ai-avatar"><FaRobot /></div>
          <div>
            <div className="ai-name">Aria — AI Advisor</div>
            <div className="ai-status"><span className="ai-dot" /> Online · Powered by Groq</div>
          </div>
          <button className="ai-close" onClick={() => setOpen(false)}><FaXmark /></button>
        </div>

        {/* Body */}
        <div className="ai-body" ref={bodyRef}>
          {!ready && (
            <div className="ai-key-prompt">
              <p><strong>Enter your Groq API key</strong> to activate Aria. Stored locally — never shared.</p>
              <input
                className="ai-key-input"
                type="password"
                placeholder="gsk_..."
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveKey()}
              />
              <button className="ai-key-save" onClick={saveKey}>Activate Aria</button>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role === 'assistant' ? 'ai-side' : 'user-side'}`}>
              <span dangerouslySetInnerHTML={{ __html: renderText(m.content) }} />
            </div>
          ))}
          {typing && (
            <div className="ai-typing">
              <span /><span /><span />
            </div>
          )}
        </div>

        {/* Suggestions */}
        {ready && messages.length <= 1 && (
          <div className="ai-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="ai-suggest" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="ai-footer">
          <input
            className="ai-input"
            placeholder="Ask Aria anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={!ready}
          />
          <button className="ai-send" onClick={() => send()} disabled={!ready || !input.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
}
