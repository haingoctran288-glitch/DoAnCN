import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Image as ImageIcon, X, Loader2, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const ContactOwner = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      addToast({ title: 'Yêu Cầu Đăng Nhập', message: 'Để liên hệ với ban quản lý, bạn cần đăng nhập tài khoản trước!', type: 'auth_warning' });
      navigate('/login');
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [navigate, addToast]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/owner-chat/my-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast({ title: 'Lỗi', message: 'Kích thước ảnh không được vượt quá 5MB', type: 'error' });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:8080/api/upload/chat-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data; // assuming it returns the Cloudinary URL as plain text or JSON
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;

    try {
      setIsUploading(true);
      let imageUrl = null;
      if (selectedImage) {
        const uploadRes = await uploadImage(selectedImage);
        imageUrl = typeof uploadRes === 'string' ? uploadRes : uploadRes.url;
      }

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/owner-chat/send', {
        content: newMessage,
        imageUrl: imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewMessage('');
      removeImage();
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      addToast({ title: 'Lỗi', message: 'Không thể gửi tin nhắn. Vui lòng thử lại sau.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary flex justify-center items-start px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-card rounded-2xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative flex flex-col h-[75vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-[#111] rounded-t-2xl flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-white/5 rounded-full transition-colors group"
              title="Quay lại"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <div className="w-12 h-12 bg-accent/20 border border-accent/50 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-white">Liên Hệ Chủ Tiệm</h2>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Ban quản lý HORNET ROYALE
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0a0a] relative scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShieldCheck className="w-16 h-16 opacity-50" />
              <p>Chưa có tin nhắn nào. Hãy gửi tin nhắn đầu tiên cho chúng tôi!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender.id === user.id;
              return (
                <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center mr-3 mt-1 shrink-0">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${isMine ? 'order-1' : 'order-2'}`}>
                    <div 
                      className={`p-4 rounded-2xl ${
                        isMine 
                          ? 'bg-[#222] border border-gray-700/50 text-gray-200 rounded-tr-sm shadow-md' 
                          : 'bg-accent/10 border border-accent/20 text-accent rounded-tl-sm shadow-md'
                      }`}
                    >
                      {msg.imageUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden">
                          <img 
                            src={msg.imageUrl.startsWith('http') ? msg.imageUrl : `http://localhost:8080${msg.imageUrl}`} 
                            alt="Attachment" 
                            className="w-full max-h-60 object-cover" 
                          />
                        </div>
                      )}
                      {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                    </div>
                    <div className={`text-xs mt-1 ${isMine ? 'text-right text-gray-500' : 'text-left text-accent/60'}`}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

          {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-[#151515] rounded-b-2xl">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border border-gray-700" />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
            <div className="flex-1 bg-[#222] border border-gray-700 rounded-xl overflow-hidden focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all flex items-end">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhắn tin cho tiệm..."
                className="w-full bg-transparent text-gray-200 p-4 focus:outline-none resize-none max-h-32 min-h-[56px] text-sm md:text-base leading-relaxed"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-colors"
                disabled={isUploading}
              >
                <ImageIcon className="w-6 h-6" />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>
              
              <button
                type="submit"
                disabled={isUploading || (!newMessage.trim() && !selectedImage)}
                className="p-3 bg-accent text-primary rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactOwner;
