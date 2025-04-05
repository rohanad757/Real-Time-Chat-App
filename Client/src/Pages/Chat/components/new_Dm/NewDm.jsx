import React, { useState, useContext, useEffect, useCallback } from "react";
import AppContext from "@/Context/AppContext.jsx";

const NewDm = ({ onClose, onSelectContact, currentContacts = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { searchUser, fetchAllContacts } = useContext(AppContext);

  // Fetch all contacts initially
  useEffect(() => {
    const getAllContacts = async () => {
      try {
        setIsLoading(true);
        const allContacts = await fetchAllContacts();
        console.log("Initial contacts:", allContacts);
        setFilteredContacts(allContacts || []);
      } catch (error) {
        console.error("Error fetching all contacts:", error);
        setFilteredContacts(currentContacts);
      } finally {
        setIsLoading(false);
      }
    };
    getAllContacts();
  }, [fetchAllContacts, currentContacts]);

  // Debounced search function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(async (term) => {
    console.log("Searching for:", term);
    if (term.trim() === "") {
      const allContacts = await fetchAllContacts();
      console.log("All contacts when empty:", allContacts);
      setFilteredContacts(allContacts || []);
    } else {
      try {
        setIsLoading(true);
        const results = await searchUser(term);
        console.log("Search results:", results);
        const filtered = (results || []).filter((result) => {
          const fullName = `${result.firstName} ${result.lastName}`.toLowerCase();
          const email = result.email.toLowerCase();
          const termLower = term.toLowerCase();
          const matches = fullName.includes(termLower) || email.includes(termLower);
          console.log(`Contact: ${fullName}, Matches: ${matches}`);
          return matches;
        });
        console.log("Filtered contacts:", filtered);
        setFilteredContacts(filtered);
      } catch (error) {
        console.error("Error searching contacts:", error);
        setFilteredContacts([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [searchUser, fetchAllContacts]);

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleContactSelect = (contact) => {
    onSelectContact(contact);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50, // Above EmptyChatContainer
        overflow: 'hidden',
      }}
    >
      {/* 3D Background Container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom right, #111827, #1F2937)', // from-gray-900 to-gray-800
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom right, #6366F1, #9333EA, #111827)', // from-indigo-500 via-purple-600 to-gray-900
              opacity: 0.5,
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              transform: 'translateZ(-300px) rotateX(45deg) rotateY(45deg)',
              borderRadius: '50%',
              filter: 'blur(50px)',
              animation: 'spin-slow 15s linear infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
          />
        </div>
      </div>

      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(31, 41, 55, 0.9)', // gray-800/90
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          maxWidth: '448px',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(55, 65, 81, 0.5)', // gray-700/50
          zIndex: 50, // Ensure above background
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 800,
              background: 'linear-gradient(to right, #A5B4FC, #C084FC)', // from-indigo-400 to-purple-500
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            New Conversation
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              color: '#D1D5DB', // gray-300
              borderRadius: '9999px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#FFFFFF';
              e.target.style.backgroundColor = '#374151'; // gray-700
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#D1D5DB';
              e.target.style.backgroundColor = 'transparent';
            }}
            aria-label="Close modal"
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(31, 41, 55, 0.5)', // gray-800/50
            color: '#E5E7EB', // gray-200
            border: '1px solid rgba(55, 65, 81, 0.5)', // gray-700/50
            outline: 'none',
            transition: 'all 0.2s',
            fontSize: '14px',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#6366F1'; // indigo-500
            e.target.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(55, 65, 81, 0.5)';
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2)';
          }}
          aria-label="Search contacts"
        />

        <div
          style={{
            maxHeight: '256px',
            overflowY: 'auto',
            msOverflowStyle: 'none', // IE and Edge
            scrollbarWidth: 'none', // Firefox
          }}
        >
          {isLoading ? (
            <p
              style={{
                color: '#9CA3AF', // gray-400
                textAlign: 'center',
                padding: '16px 0',
                fontWeight: 500,
                letterSpacing: '0.025em',
              }}
            >
              Loading...
            </p>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <button
                key={contact._id}
                onClick={() => handleContactSelect(contact)}
                style={{
                  width: '100%',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(31, 41, 55, 0.5)', // gray-800/50
                  transition: 'all 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.7)')} // gray-700/70
                onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                onFocus={(e) => (e.target.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.5)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      background: 'linear-gradient(to bottom right, #6366F1, #9333EA)', // from-indigo-600 to-purple-500
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      ring: '2px solid rgba(99, 102, 241, 0.5)', // ring-indigo-500/50
                      ringOffset: '2px',
                      ringOffsetColor: '#111827', // gray-900
                    }}
                  >
                    {contact.image ? (
                      <img
                        src={`data:image/png;base64,${contact.image}`}
                        alt={`${contact.firstName} ${contact.lastName}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(to bottom right, #6366F1, #9333EA)', // from-indigo-600 to-purple-500
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '18px',
                        }}
                      >
                        {contact.firstName?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '10px',
                      height: '10px',
                      borderRadius: '9999px',
                      border: '2px solid #111827', // gray-950
                      backgroundColor: contact.status === "online" ? '#34D399' : '#6B7280', // green-400 or gray-500
                    }}
                  />
                </div>
                <div
                  style={{
                    marginLeft: '12px',
                    textAlign: 'left',
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '14px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {contact.firstName} {contact.lastName === "undefined" ? "" : contact.lastName}
                  </p>
                  <p
                    style={{
                      color: '#9CA3AF', // gray-400
                      fontSize: '12px',
                      letterSpacing: '0.025em',
                    }}
                  >
                    {contact.email}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <p
              style={{
                color: '#9CA3AF', // gray-400
                textAlign: 'center',
                padding: '16px 0',
                fontWeight: 500,
                letterSpacing: '0.025em',
              }}
            >
              {searchTerm ? "No contacts found" : "No contacts available"}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '16px',
            width: '100%',
            padding: '8px',
            background: 'linear-gradient(to right, #374151, #4B5563)', // from-gray-700 to-gray-600
            color: '#FFFFFF',
            borderRadius: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#4B5563'; // gray-600
            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(to right, #374151, #4B5563)';
            e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
          }}
          onFocus={(e) => (e.target.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.5)')}
          onBlur={(e) => (e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)')}
        >
          Cancel
        </button>
      </div>
      {/* Inline Animation Styles */}
      <style>
        {`
          @keyframes spin-slow {
            0% { transform: translateZ(-300px) rotateX(45deg) rotateY(45deg); }
            100% { transform: translateZ(-300px) rotateX(405deg) rotateY(405deg); }
          }
          div[style*="max-h-64"]::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default NewDm;