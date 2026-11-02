import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Minus, Send, Bot, User, Trash2, Phone, Calendar, MapPin, Tag, Box, Star, Info } from 'lucide-react';
import './ChatBot.css';

// --- Markdown Component ---
const MarkdownText = ({ text }) => {
  if (!text) return null;
  // Xử lý các thẻ markdown cơ bản (Bold, Italic, Link, Code, Bullet, Heading, Numbered)
  let formatted = text
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/# (.*)/g, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #d4af37; text-decoration: underline;">$1</a>')
    .replace(/`(.*?)`/g, '<code style="background: rgba(212,175,55,0.2); padding: 2px 4px; border-radius: 4px; color: #d4af37;">$1</code>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  // Bullet và Numbering (regex đơn giản)
  formatted = formatted.replace(/(?:<br\/>)?- (.*?)(?=<br\/>|$)/g, '<li style="margin-left: 16px; list-style-type: disc;">$1</li>');
  formatted = formatted.replace(/(?:<br\/>)?\d+\. (.*?)(?=<br\/>|$)/g, '<li style="margin-left: 16px; list-style-type: decimal;">$1</li>');

  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [humanRequested, setHumanRequested] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const messagesEndRef = useRef(null);
  
  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('hornet_chat_history');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'model', content: 'Dạ, chào mừng quý khách đến với HORNET ROYALE! Tôi là trợ lý ảo, quý khách cần hỗ trợ gì ạ?', time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }]);
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const saveHistory = (msgs) => {
    localStorage.setItem('hornet_chat_history', JSON.stringify(msgs));
  };

  const handleClearHistory = () => {
    const initial = [{ role: 'model', content: 'Dạ, lịch sử đã được xóa. Quý khách cần hỗ trợ gì mới ạ?', time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }];
    setMessages(initial);
    saveHistory(initial);
    setFailCount(0);
    setHumanRequested(false);
  };

  const checkHumanRequest = (text) => {
    const lower = text.toLowerCase();
    const triggers = ['gặp nhân viên', 'tư vấn trực tiếp', 'người thật', 'chat với nhân viên', 'gọi nhân viên', 'không muốn chat ai', 'muốn gặp barber', 'tư vấn viên'];
    if (triggers.some(t => lower.includes(t))) return true;
    return false;
  };

  const isFailedResponse = (text) => {
    const lower = text.toLowerCase();
    const fails = ['không có đủ thông tin', 'chưa thể hỗ trợ', 'không thể trả lời'];
    return fails.some(f => lower.includes(f));
  };

  const handleSend = async (customText) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const newMsg = { role: 'user', content: textToSend, time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) };
    const updatedMessages = [...messages, newMsg];
    
    setMessages(updatedMessages);
    saveHistory(updatedMessages);
    setInput('');
    setIsLoading(true);

    if (checkHumanRequest(textToSend)) {
      setHumanRequested(true);
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API backend (cần history không chứa thuộc tính time nếu backend dùng nó trực tiếp, nhưng ở đây backend xử lý string).
      const backendHistory = updatedMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: backendHistory })
      });
      
      const data = await response.json();
      const reply = data.reply || "Xin lỗi, hệ thống không phản hồi.";
      
      const replyMsg = { role: 'model', content: reply, time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) };
      const newMsgs = [...updatedMessages, replyMsg];
      
      setMessages(newMsgs);
      saveHistory(newMsgs);

      if (isFailedResponse(reply)) {
        const newFail = failCount + 1;
        setFailCount(newFail);
        if (newFail >= 3) {
          setHumanRequested(true);
        }
      } else {
        setFailCount(0); // reset if answered successfully
      }

    } catch (error) {
      console.error(error);
      const errMsg = { role: 'model', content: "Xin lỗi, AI hiện đang bận.\nVui lòng thử lại sau.", time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) };
      const newMsgs = [...updatedMessages, errMsg];
      setMessages(newMsgs);
      saveHistory(newMsgs);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggest = (text) => {
    handleSend(text);
  };

  return (
    <>
      {/* Nút bấm mở chat */}
      <div className={`chatbot-trigger ${isOpen ? 'hidden' : 'bounce-in'}`} onClick={() => setIsOpen(true)}>
        <Bot size={28} color="#000" />
      </div>

      {/* Cửa sổ chat */}
      <div className={`chatbot-window ${isOpen ? 'show' : 'hide'}`}>
        
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-logo-container">
              <img src="/images/logo.png" alt="Logo" className="chatbot-logo" />
              <div className="online-dot"></div>
            </div>
            <div className="chatbot-title-group">
              <span className="chatbot-title">HORNET ROYALE</span>
              <span className="chatbot-subtitle">AI Assistant</span>
            </div>
          </div>
          <div className="chatbot-header-right">
            <button title="Làm mới cuộc trò chuyện" onClick={handleClearHistory}><Trash2 size={16}/></button>
            <button onClick={() => setIsOpen(false)}><Minus size={18}/></button>
            <button onClick={() => setIsOpen(false)}><X size={18}/></button>
          </div>
        </div>

        {/* Suggestion Buttons */}
        <div className="chatbot-suggestions">
          <button onClick={() => handleSuggest('Tôi muốn đặt lịch')}><Calendar size={12}/> Đặt lịch</button>
          <button onClick={() => handleSuggest('Bảng giá dịch vụ như thế nào?')}><Tag size={12}/> Bảng giá</button>
          <button onClick={() => handleSuggest('Chi nhánh nào gần nhất?')}><MapPin size={12}/> Chi nhánh</button>
          <button onClick={() => handleSuggest('Sản phẩm nào bán chạy?')}><Box size={12}/> Sản phẩm</button>
          <button onClick={() => handleSuggest('Tôi muốn chat với nhân viên')}><Phone size={12}/> Nhân viên</button>
        </div>

        {/* Messages Body */}
        <div className="chatbot-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              {msg.role === 'model' && (
                <div className="chat-avatar model">
                  <Bot size={16} color="#d4af37" />
                </div>
              )}
              <div className="chat-bubble">
                <MarkdownText text={msg.content} />
                <span className="chat-time">{msg.time}</span>
              </div>
              {msg.role === 'user' && (
                <div className="chat-avatar user">
                  <User size={16} color="#000" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="chat-message model">
              <div className="chat-avatar model">
                <Bot size={16} color="#d4af37" />
              </div>
              <div className="chat-bubble typing">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <span className="typing-text">Đang suy nghĩ...</span>
              </div>
            </div>
          )}

          {humanRequested && (
            <div className="human-transfer-card">
              <Info size={20} color="#d4af37" />
              <p>AI không thể hỗ trợ tốt hơn.<br/>Bạn có muốn chuyển sang nhân viên tư vấn không?</p>
              <button className="transfer-btn" onClick={() => alert('Tính năng chuyển sang nhân viên sẽ được hỗ trợ trong phiên bản tiếp theo.')}>Chuyển sang nhân viên</button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="chatbot-footer">
          <textarea
            placeholder="Nhập câu hỏi của bạn... (Shift + Enter để xuống dòng)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
