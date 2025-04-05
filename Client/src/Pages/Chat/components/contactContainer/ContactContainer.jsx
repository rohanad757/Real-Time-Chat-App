import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import AppContext from '@/Context/AppContext.jsx';
import NewDm from '../new_Dm/NewDm.jsx';

const ContactContainer = ({ onContactSelect, selectedContact, showNewDm, setShowNewDm }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, fetchUser, fetchImage, fetchAllContacts, getMsg, logout } = useContext(AppContext);
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [lastMessages, setLastMessages] = useState({});

    const fetchUserData = async () => {
        try {
            const userData = await fetchUser();
            const imageData = await fetchImage();
            if (userData === false) {
                navigate('/auth');
                return;
            }
            if (!userData) return;
            setName(`${userData.firstName} ${userData.lastName}`);
            if (imageData) setImage(`data:image/jpeg;base64,${imageData}`);
        } catch (error) {
            // console.error('Error fetching user data:', error);
        }
    };

    const fetchContacts = async () => {
        try {
            const res = await fetchAllContacts();
            setContacts(res);
            setFilteredContacts(res);
            fetchLastMessages(res);
        } catch (error) {
            // console.error('Error fetching contacts:', error);
        }
    };

    const fetchLastMessages = async (contactsList) => {
        const messagesMap = {};
        for (const contact of contactsList) {
            const response = await getMsg(contact._id);
            if (response && response.senderMessages && response.receiverMessages) {
                const allMessages = [
                    ...response.senderMessages,
                    ...response.receiverMessages
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                if (allMessages.length > 0) {
                    messagesMap[contact._id] = allMessages[0];
                }
            }
        }
        setLastMessages(messagesMap);
    };

    useEffect(() => {
        fetchUserData();
        fetchContacts();
    }, []);

    useEffect(() => {
        const filtered = contacts.filter((contact) =>
            `${contact.firstName} ${contact.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContacts(filtered);
    }, [searchTerm, contacts]);

    return (
        <div
            className={`h-full bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 border-r border-gray-700 shadow-2xl w-full ${
                isCollapsed ? 'md:w-20' : 'md:w-80'
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-3 md:p-4 bg-gray-950 flex items-center justify-between border-b border-gray-700 shadow-md">
                    {!isCollapsed && (
                        <NavLink to={'/chat'} ><h2 className="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                            SIGNAL
                        </h2></NavLink>
                    )}
                    <div className="flex items-center space-x-2">
                        {!isCollapsed && (
                            <button
                                onClick={() => setShowNewDm(true)}
                                className="p-2 text-gray-300 hover:text-indigo-300 hover:bg-gray-800 rounded-full transition-all duration-200 shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200 shadow-sm"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {!isCollapsed && (
                    <div className="p-3 md:p-4">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 md:p-2.5 rounded-lg bg-gray-800/50 text-gray-200 border border-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 text-sm md:text-base shadow-inner"
                        />
                    </div>
                )}

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                            <div
                                key={contact._id}
                                onClick={() => onContactSelect(contact)}
                                className={`p-3 md:p-4 flex items-center cursor-pointer transition-all duration-300 border-b border-gray-800/50 ${
                                    selectedContact?._id === contact._id
                                        ? 'bg-gradient-to-r from-indigo-700 to-purple-700 text-white'
                                        : 'hover:bg-gray-800/70 text-gray-200'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-semibold text-base md:text-lg shadow-lg ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-500/50">
                                        {contact.image ? (
                                            <img
                                                src={`data:image/png;base64,${contact.image}`}
                                                alt={`${contact.firstName} ${contact.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            `${contact.firstName.charAt(0).toUpperCase()}`
                                        )}
                                    </div>
                                </div>
                                {!isCollapsed && (
                                    <div className="ml-2 md:ml-3 flex-1 flex flex-col">
                                        <p className="font-semibold text-sm md:text-base tracking-tight">
                                            {contact.firstName} {contact.lastName === "undefined" ? "" : contact.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate tracking-wide">{contact.email}</p>
                                        {lastMessages[contact._id] && (
                                            <p className="text-xs text-gray-300 mt-1 truncate tracking-wide">
                                                {lastMessages[contact._id].message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-gray-400 text-center text-sm md:text-base font-medium">
                            {searchTerm ? "No contacts found" : "No contacts available"}
                        </p>
                    )}
                </div>

                {/* User Profile Section */}
                <div className="p-3 md:p-4 bg-gray-950 border-t border-gray-700 shadow-inner">
                    {user && (
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-500/50">
                                        {image ? (
                                            <img src={image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-semibold text-base md:text-lg">
                                                {name.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!isCollapsed && (
                                    <p className="ml-2 md:ml-3 text-white font-semibold truncate text-sm md:text-base tracking-tight">
                                        {name}
                                    </p>
                                )}
                            </div>
                            {!isCollapsed && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="p-2 text-gray-300 hover:text-indigo-300 hover:bg-gray-800 rounded-full transition-all duration-200 shadow-sm"
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (logout) await logout();
                                            navigate('/auth');
                                        }}
                                        className="p-2 text-gray-300 hover:text-red-300 hover:bg-gray-800 rounded-full transition-all duration-200 shadow-sm"
                                    >
                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showNewDm && <NewDm onClose={() => setShowNewDm(false)} onSelectContact={onContactSelect} currentContacts={contacts} />}
        </div>
    );
};

export default ContactContainer;