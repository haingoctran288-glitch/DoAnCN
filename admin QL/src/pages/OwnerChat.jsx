import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { message, Avatar, Input, Button, Spin, List, Typography, Badge, Empty, Upload } from 'antd';
import { SendOutlined, UserOutlined, PictureOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const formatTimeShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const { Text, Title } = Typography;

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return `http://localhost:8080${avatar}`;
};

const OwnerChat = () => {
  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom is no longer needed manually since we use column-reverse

  useEffect(() => {
    fetchThreads();
    const interval = setInterval(fetchThreads, 10000); // refresh thread list
    return () => clearInterval(interval);
  }, []);

  const fetchThreads = async () => {
    try {
      setLoadingThreads(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/owner-chat/admin/threads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setThreads(res.data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoadingThreads(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/owner-chat/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      // Update thread unread status locally
      setThreads(prev => prev.map(t => 
        t.user.id === userId ? { ...t, isReadByAdmin: true } : t
      ));
    } catch (error) {
      message.error('Lỗi khi tải tin nhắn');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    let interval;
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      interval = setInterval(() => fetchMessages(selectedUser.id), 5000);
    }
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      setSending(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/owner-chat/send', {
        content: newMessage,
        userId: selectedUser.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages(selectedUser.id);
    } catch (error) {
      message.error('Lỗi khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handleImageUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      setSending(true);
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const uploadRes = await axios.post('http://localhost:8080/api/upload/chat-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      const imageUrl = typeof uploadRes.data === 'string' ? uploadRes.data : uploadRes.data.url;

      await axios.post('http://localhost:8080/api/owner-chat/send', {
        content: '',
        imageUrl: imageUrl,
        userId: selectedUser.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess("ok");
      fetchMessages(selectedUser.id);
    } catch (error) {
      onError({ error });
      message.error('Lỗi tải ảnh lên');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '12px 24px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .owner-chat-layout {
            display: flex;
            flex: 1;
            background-color: #242424;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #333;
            min-height: 0;
          }
          .owner-chat-sidebar {
            width: 300px;
            border-right: 1px solid #333;
            display: flex;
            flex-direction: column;
            background-color: #1a1a1a;
          }
          @media (max-width: 768px) {
            .owner-chat-layout {
              flex-direction: column;
            }
            .owner-chat-sidebar {
              width: 100%;
              border-right: none;
              border-bottom: 1px solid #333;
              max-height: 250px;
            }
          }
        `}
      </style>
      <Title level={2} style={{ marginBottom: 12, fontSize: '1.5rem' }}><MessageOutlined /> Tin Nhắn Từ Khách Hàng</Title>
      
      <div className="owner-chat-layout">
        {/* Left Sidebar - Thread List */}
        <div className="owner-chat-sidebar">
          <div style={{ padding: 16, borderBottom: '1px solid #333' }}>
            <Text strong>Danh sách liên hệ ({threads.length})</Text>
            <Input 
              placeholder="Tìm theo tên hoặc ngày..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              prefix={<SearchOutlined style={{ color: '#888' }} />} 
              style={{ marginTop: 12, backgroundColor: '#242424', borderColor: '#444', color: '#fff' }}
              allowClear
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
              loading={loadingThreads}
              dataSource={threads.filter(item => {
                const searchStr = searchTerm.toLowerCase().replace(/\s+/g, '');
                if (!searchStr) return true;
                const name = (item.user.fullName || item.user.username || '').toLowerCase().replace(/\s+/g, '');
                
                const d = new Date(item.createdAt);
                const d1 = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`; // 10/07/2026
                const d2 = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; // 10/7/2026
                const d3 = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`; // 10/07
                const d4 = `${d.getDate()}/${d.getMonth() + 1}`; // 10/7
                
                return name.includes(searchStr) || d1.includes(searchStr) || d2.includes(searchStr) || d3.includes(searchStr) || d4.includes(searchStr);
              })}
              renderItem={item => {
                const unread = !item.isReadByAdmin && item.sender.id !== JSON.parse(localStorage.getItem('user'))?.id;
                const isSelected = selectedUser?.id === item.user.id;
                return (
                  <List.Item 
                    style={{ 
                      padding: '12px 16px', 
                      cursor: 'pointer', 
                      backgroundColor: isSelected ? '#333' : 'transparent',
                      transition: 'background-color 0.3s',
                      borderBottom: '1px solid #222'
                    }}
                    onClick={() => setSelectedUser(item.user)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={unread}>
                          <Avatar src={getAvatarUrl(item.user.avatar)} icon={<UserOutlined />} />
                        </Badge>
                      }
                      title={<Text strong={unread}>{item.user.fullName || item.user.username}</Text>}
                      description={
                        <Text type="secondary" ellipsis style={{ maxWidth: 180 }}>
                          {item.content || (item.imageUrl ? '[Hình ảnh]' : '')}
                        </Text>
                      }
                    />
                    <div style={{ fontSize: 12, color: '#999', alignSelf: 'flex-start' }}>
                      {formatTimeShort(item.createdAt)}
                    </div>
                  </List.Item>
                );
              }}
            />
          </div>
        </div>

        {/* Right Content - Chat Detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#242424' }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #333', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
                <Avatar src={getAvatarUrl(selectedUser.avatar)} icon={<UserOutlined />} size="large" />
                <div style={{ marginLeft: 16 }}>
                  <Title level={5} style={{ margin: 0 }}>{selectedUser.fullName || selectedUser.username}</Title>
                  <Text type="secondary">{selectedUser.email || selectedUser.phone || 'Khách hàng'}</Text>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column-reverse' }}>
                {loadingMessages && messages.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: 50 }}><Spin /></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 16 }}>
                    {messages.slice().reverse().map((msg, index) => {
                      const isAdmin = msg.sender.role === 'ADMIN';
                      return (
                        <div key={index} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                          {!isAdmin && <Avatar src={getAvatarUrl(msg.sender.avatar)} icon={<UserOutlined />} style={{ marginRight: 8, marginTop: 4 }} />}
                          <div style={{ maxWidth: '80%' }}>
                            <div style={{ 
                              padding: '10px 14px', 
                              backgroundColor: isAdmin ? '#d4af37' : '#333', 
                              color: isAdmin ? '#000' : '#fff',
                              borderRadius: isAdmin ? '12px 12px 0 12px' : '12px 12px 12px 0',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}>
                              {msg.imageUrl && (
                                <img 
                                  src={msg.imageUrl.startsWith('http') ? msg.imageUrl : `http://localhost:8080${msg.imageUrl}`} 
                                  alt="attachment" 
                                  style={{ maxWidth: '100%', borderRadius: 8, marginBottom: msg.content ? 8 : 0 }} 
                                />
                              )}
                              {msg.content && <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</div>}
                            </div>
                            <div style={{ fontSize: 11, color: '#888', marginTop: 4, textAlign: isAdmin ? 'right' : 'left' }}>
                              {formatDate(msg.createdAt)}
                            </div>
                          </div>
                          {isAdmin && <Avatar src={getAvatarUrl(msg.sender.avatar)} icon={<UserOutlined />} style={{ marginLeft: 8, marginTop: 4 }} />}
                        </div>
                      );
                    })}
                    {/* Spacer removed because of column-reverse */}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={{ padding: 16, backgroundColor: '#1a1a1a', borderTop: '1px solid #333' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Upload 
                    customRequest={handleImageUpload} 
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<PictureOutlined />} size="large" />
                  </Upload>
                  <Input.TextArea 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..." 
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1 }}
                    onPressEnter={e => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    size="large" 
                    onClick={handleSend}
                    loading={sending}
                    disabled={!newMessage.trim()}
                  >
                    Gửi
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Empty description="Chọn một liên hệ để xem tin nhắn" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerChat;
