import React from 'react';

const EmptyChatContainer = ({ onStartNewChat }) => {
  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#1F2937', // gray-900
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0, // Base layer, below modals
      }}
    >
      {/* 3D Blockchain Chain Background */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          perspective: '800px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'spin3d-slow 20s linear infinite',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(99, 102, 241, 0.2)', // indigo-500/20
                border: '2px solid rgba(99, 102, 241, 0.5)', // indigo-400/50
                borderRadius: '50%',
                transform: `
                  rotateY(${i * 60}deg) 
                  translateZ(100px) 
                  translateX(${Math.cos(i * (Math.PI / 3)) * 80}px) 
                  translateY(${Math.sin(i * (Math.PI / 3)) * 80}px)
                `,
                animation: `pulse-slow 2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '24px',
          backgroundColor: 'rgba(31, 41, 55, 0.9)', // gray-800/90
          borderRadius: '12px',
          maxWidth: '320px',
          width: '100%',
          zIndex: 1, // Above background, below modals
        }}
      >
        <svg
          style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#6366F1' }} // indigo-500
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>

        <h3
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '8px',
          }}
        >
          What's up Doc?
        </h3>

        <p
          style={{
            color: '#9CA3AF', // gray-400
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          Link a new conversation
        </p>

        <button
          onClick={onStartNewChat}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366F1', // indigo-500
            color: '#FFFFFF',
            borderRadius: '6px',
            transition: 'background-color 0.15s',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#4F46E5')} // indigo-600
          onMouseOut={(e) => (e.target.style.backgroundColor = '#6366F1')}
        >
          Start New Chat
        </button>
      </div>

      {/* Inline Animation Styles */}
      <style>
        {`
          @keyframes spin3d-slow {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  );
};

export default EmptyChatContainer;