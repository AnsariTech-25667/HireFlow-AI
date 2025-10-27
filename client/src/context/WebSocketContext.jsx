import { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);

  const connect = () => {
    try {
      // In a real app, this would be your WebSocket server URL
      const ws = new WebSocket(
        process.env.REACT_APP_WS_URL || 'ws://localhost:5000'
      );

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setReconnectAttempts(0);
        setSocket(ws);
      };

      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);

          // Handle different message types
          switch (data.type) {
            case 'JOB_APPLICATION_UPDATE':
              // Handle job application status updates
              break;
            case 'NEW_JOB_POSTED':
              // Handle new job notifications
              break;
            case 'INTERVIEW_SCHEDULED':
              // Handle interview notifications
              break;
            case 'MESSAGE_RECEIVED':
              // Handle chat messages
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setSocket(null);

        // Attempt to reconnect
        if (reconnectAttempts < 5) {
          setTimeout(
            () => {
              setReconnectAttempts(prev => prev + 1);
              connect();
            },
            1000 * Math.pow(2, reconnectAttempts)
          ); // Exponential backoff
        }
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const sendMessage = message => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  const value = {
    socket,
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    reconnectAttempts,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
      <ConnectionStatus
        isConnected={isConnected}
        reconnectAttempts={reconnectAttempts}
      />
    </WebSocketContext.Provider>
  );
};

// Connection status indicator
const ConnectionStatus = ({ isConnected, reconnectAttempts }) => {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (!isConnected && reconnectAttempts > 0) {
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, reconnectAttempts]);

  if (!showStatus) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
          isConnected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
        }`}
      >
        {isConnected ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Connected
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            Reconnecting... ({reconnectAttempts}/5)
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WebSocketProvider;
