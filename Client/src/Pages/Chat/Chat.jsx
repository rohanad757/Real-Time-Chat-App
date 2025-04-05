import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AppContext from '@/Context/AppContext.jsx';
import ContactContainer from './components/contactContainer/ContactContainer.jsx';
import ChatContainer from './components/chatContainer/ChatContainer.jsx';
import EmptyChatContainer from './components/emptyChatContainer/EmptyChatContainer.jsx';

const Chat = () => {
  const { user, fetchUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched) return;
      if (user !== null) {
        if (user.profileSetup === false) {
          toast("Please complete your profile to continue");
          navigate("/profile");
        }
        setHasFetched(true);
        return;
      }
      try {
        const userData = await fetchUser();
        if (!userData) {
          toast.error("Please log in to continue");
          navigate("/auth");
          return;
        }
        if (userData.profileSetup === false) {
          toast("Please complete your profile to continue");
          navigate("/profile");
        }
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Something went wrong. Please try again.");
        navigate("/auth");
      }
    };
    fetchData();
  }, [user, fetchUser, navigate, hasFetched]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsMobileMenuOpen(false);
    setShowNewDm(false);
  };

  const handleBackToContacts = () => {
    setSelectedContact(null);
  };

  const handleStartNewChat = () => {
    setShowNewDm(true);
  };

  if (user === null && !hasFetched) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-200 text-sm md:text-lg font-medium">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Mobile Menu Toggle */}
      <button
        className={`md:hidden p-3 text-gray-200 bg-gray-850 border-b border-gray-800 ${
          selectedContact ? 'hidden' : 'block'
        }`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Contact Container */}
      <div
        className={`${
          isMobileMenuOpen || !selectedContact ? 'block' : 'hidden md:block'
        } h-full absolute md:static inset-0 z-10 transition-all duration-300`}
      >
        <ContactContainer
          onContactSelect={handleContactSelect}
          selectedContact={selectedContact}
          showNewDm={showNewDm}
          setShowNewDm={setShowNewDm}
        />
      </div>

      {/* Chat Container */}
      <div className="flex-1 h-full">
        {selectedContact ? (
          <ChatContainer selectedContact={selectedContact} onBack={handleBackToContacts} />
        ) : (
          <EmptyChatContainer onStartNewChat={handleStartNewChat} />
        )}
      </div>
    </div>
  );
};

export default Chat;