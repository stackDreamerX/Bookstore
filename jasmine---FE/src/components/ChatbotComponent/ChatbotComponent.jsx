import React, { useState, useEffect, useRef } from 'react';
import './ChatbotComponent.css';
import { useSelector } from 'react-redux';
import { processGoogleAloudQuery } from '../../services/ChatbotService';
import chatbotIcon from '../../assets/img/chatbot-icon.jpg';

const ChatbotComponent = ({ onVoiceInput }) => {
  // State quản lý trạng thái mở/đóng của chatbot
  const [isOpen, setIsOpen] = useState(false);

  // State quản lý lịch sử tin nhắn giữa user và bot
  const [messages, setMessages] = useState([
    {
      sender: 'bot', // Tin nhắn từ bot
      content: 'Xin chào! Tôi là trợ lý AI của hiệu sách BookStore. Tôi có thể giúp gì cho bạn?',
      timestamp: new Date()
    }
  ]);

  // State quản lý text người dùng nhập vào
  const [inputValue, setInputValue] = useState('');

  // State để hiển thị khi bot đang xử lý câu trả lời (hiệu ứng đang gõ)
  const [isTyping, setIsTyping] = useState(false);

  // State kiểm tra trạng thái kết nối đến API AI
  const [apiConnectionStatus, setApiConnectionStatus] = useState('unknown'); // 'unknown', 'connected', 'error'

  // Ref để scroll xuống tin nhắn mới nhất
  const messagesEndRef = useRef(null);

  // Ref để truy cập DOM của chatbot
  const chatbotRef = useRef(null);

  // Lấy thông tin user từ Redux store
  const user = useSelector((state) => state.user);

  // Tự động scroll xuống khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Kiểm tra kết nối API khi component được mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  // Điều chỉnh vị trí chatbot để đảm bảo hiển thị đúng trong viewport
  useEffect(() => {
    if (isOpen) {
      // Đảm bảo chatbot nằm trong viewport
      setTimeout(() => {
        if (chatbotRef.current) {
          const rect = chatbotRef.current.getBoundingClientRect();
          if (rect.top < 0) {
            window.scrollTo({
              top: window.scrollY + rect.top - 20,
              behavior: 'smooth'
            });
          }
        }
      }, 300);
    }
  }, [isOpen]);

  // Kiểm tra kết nối đến API Gemini để đảm bảo có thể sử dụng
  const checkApiConnection = async () => {
    try {
      // Gửi câu chào đơn giản để test API
      await processGoogleAloudQuery('hello');
      setApiConnectionStatus('connected');
    } catch (error) {
      console.error('API connection test failed:', error);
      setApiConnectionStatus('error');
    }
  };

  // Hàm cuộn xuống tin nhắn mới nhất sau khi gửi/nhận tin nhắn
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Bật/tắt cửa sổ chat khi click vào icon
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Cập nhật giá trị input khi người dùng gõ
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Xử lý việc gửi câu hỏi đến API Gemini và nhận phản hồi
  const handleQueryProcessing = async (query) => {
    setIsTyping(true); // Hiển thị trạng thái đang gõ

    try {
      // Gọi Gemini API để xử lý câu hỏi
      const response = await processGoogleAloudQuery(query);
      console.log('Google Gemini API response:', response);

      // Xử lý phản hồi để hiển thị
      let botResponse = '';

      if (response && response.status === 'OK') {
        botResponse = response.message || '';

        // Định dạng dữ liệu sản phẩm nếu có trong phản hồi
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          botResponse += '\n\n';

          // Hiển thị thông tin tối đa 3 sản phẩm đầu tiên
          response.data.slice(0, 3).forEach((book, index) => {
            botResponse += `${index + 1}. "${book.productName}" bởi ${book.author}\n`;
            botResponse += `   Giá: ${book.productPrice.toLocaleString('vi-VN')} VND\n\n`;
          });

          // Thông báo nếu còn nhiều sản phẩm khác
          if (response.data.length > 3) {
            botResponse += `...và ${response.data.length - 3} sách khác.`;
          }
        }
      } else {
        botResponse = 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.';
      }

      // Thêm phản hồi của bot vào danh sách tin nhắn với độ trễ giả lập để tạo cảm giác tự nhiên
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'bot',
            content: botResponse,
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      }, 1000); // Giả lập độ trễ API 1 giây

      // Cập nhật trạng thái kết nối API thành công
      setApiConnectionStatus('connected');

    } catch (error) {
      console.error('Error processing query:', error);

      // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'bot',
            content: 'Xin lỗi, đã xảy ra lỗi khi kết nối đến Google Gemini AI. Vui lòng kiểm tra kết nối mạng và thử lại sau.',
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      }, 1000);

      // Cập nhật trạng thái kết nối API lỗi
      setApiConnectionStatus('error');
    }
  };

  // Xử lý khi người dùng gửi tin nhắn
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = {
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue(''); // Xóa text trong ô input

    // Xử lý câu hỏi của người dùng
    await handleQueryProcessing(userMessage.content);
  };

  // Xử lý khi người dùng nhấn Enter để gửi tin nhắn
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Định dạng thời gian hiển thị trong tin nhắn
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Phần JSX để render component
  return (
    <div className="chatbot-container" ref={chatbotRef}>
      {/* Nút bật/tắt chatbot - hiển thị icon hoặc dấu X */}
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <span>&times;</span>
        ) : (
          <div className="chatbot-icon-container">
            <img src={chatbotIcon} alt="Chat Bot" className="chatbot-icon" />
          </div>
        )}
      </button>

      {/* Cửa sổ chat - chỉ hiển thị khi isOpen = true */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Phần header với tên và icon */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <img src={chatbotIcon} alt="Chat Bot" className="chatbot-header-icon" />
              <h3>Trợ lý BookStore Jasmine</h3>
              {/* Hiển thị trạng thái lỗi API nếu có */}
              {apiConnectionStatus === 'error' && (
                <div className="api-status error">
                  <span className="status-dot"></span>
                  API Lỗi
                </div>
              )}
            </div>
            <div className="chatbot-controls">
              <button className="chatbot-close" onClick={toggleChat}>
                &times;
              </button>
            </div>
          </div>

          {/* Khu vực hiển thị tin nhắn qua lại giữa user và bot */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Khu vực input để nhập và gửi tin nhắn */}
          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              disabled={isTyping || apiConnectionStatus === 'error'}
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === '' || isTyping || apiConnectionStatus === 'error'}
              className="send-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="#334e68"/>
              </svg>
            </button>
          </div>

          {apiConnectionStatus === 'error' && (
            <div className="api-error-banner">
              Không thể kết nối đến Google Gemini API. Vui lòng kiểm tra kết nối mạng và API key.
              <button onClick={checkApiConnection} className="retry-button">
                Thử lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;