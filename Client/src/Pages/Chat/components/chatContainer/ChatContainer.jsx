import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from "react";
import AppContext from "@/Context/AppContext.jsx";

const ChatHeader = ({ selectedContact, onBack }) => (
    <div className="p-3 md:p-4 bg-gray-950 border-b border-gray-700 flex items-center justify-between shadow-md">
        <div className="flex items-center">
            <button
                onClick={onBack}
                className="md:hidden mr-2 p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200 shadow-sm"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-semibold text-base md:text-lg shadow-lg ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-500/50">
                    {selectedContact.image ? (
                        <img
                            src={`data:image/png;base64,${selectedContact.image}`}
                            alt={`${selectedContact.firstName} ${selectedContact.lastName}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        `${selectedContact.firstName?.charAt(0).toUpperCase() || "?"}`
                    )}
                </div>
                <span
                    className={`absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-gray-950 ${
                        selectedContact.status === "online" ? "bg-green-400" : "bg-gray-500"
                    }`}
                />
            </div>
            <div className="ml-3 md:ml-4">
                <p className="text-white font-semibold text-base md:text-lg tracking-tight">
                    {selectedContact.firstName} {selectedContact.lastName === "undefined" ? "" : selectedContact.lastName}
                </p>
                <p className="text-xs md:text-sm text-gray-400 tracking-wide">
                    {selectedContact.status === "online" ? "Active now" : "Last seen recently"}
                </p>
            </div>
        </div>
    </div>
);

const MessageList = ({ chatMessages }) => {
    const lastMessageRef = useRef(null);

    // Scroll to the last message when chatMessages change
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    return (
        <div className="flex-1 p-4 md:p-6 overflow-y-auto hide-scrollbar flex flex-col w-full gap-4">
            {chatMessages.map((message, index) => (
                <div
                    key={message._id}
                    ref={index === chatMessages.length - 1 ? lastMessageRef : null} // Attach ref to the last message
                    className={`flex w-full ${message.isSender ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`max-w-[60%] p-3 md:p-4 rounded-2xl shadow-lg ${
                            message.isSender
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                : "bg-gray-700 text-gray-200"
                        }`}
                    >
                        <p className="text-sm md:text-base">{message.message}</p>
                        <p className={`text-xs text-gray-400 mt-1 ${message.isSender ? "text-right" : "text-left"}`}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MessageInput = ({ messageInput, setMessageInput, sendMessage }) => (
    <div className="p-3 md:p-4 bg-gray-950 border-t border-gray-700 flex items-center space-x-2 md:space-x-3 shadow-inner">
        <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-2 md:p-3 rounded-full bg-gray-800/50 text-gray-200 border border-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 shadow-inner text-sm md:text-base"
        />
        <button
            onClick={sendMessage}
            className="p-2 md:p-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        </button>
    </div>
);

const ChatContainer = ({ selectedContact, onBack }) => {
    const { user, postMessage, getMsg, messages, socket } = useContext(AppContext);
    const [messageInput, setMessageInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const chatId = useMemo(() => {
        return selectedContact ? [user?.id, selectedContact._id].sort().join('_') : null;
    }, [user, selectedContact]);

    const sendMessage = useCallback(async () => {
        if (!messageInput.trim() || !socket) return;
        const newMessage = await postMessage(messageInput, selectedContact._id);
        if (newMessage) {
            // console.log("New Message Sent:", newMessage);
            setChatMessages((prev) => {
                const updatedMessages = [...prev, { ...newMessage, isSender: true }];
                return updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            });
            setMessageInput("");
        } else {
            // console.log("Failed to send message");
        }
    }, [messageInput, socket, postMessage, selectedContact]);

    useEffect(() => {
        if (!selectedContact) return;

        setChatMessages([]);
        setIsLoading(true);

        // console.log("Fetching messages for Contact ID:", selectedContact._id);
        getMsg(selectedContact._id).then((response) => {
            if (response && response.senderMessages && response.receiverMessages) {
                // console.log("Fetched Response:", response);
                const allMessages = [
                    ...response.senderMessages.map(msg => ({ ...msg, isSender: true })),
                    ...response.receiverMessages.map(msg => ({ ...msg, isSender: false }))
                ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setChatMessages(allMessages);
            } else {
                // console.log("No valid messages fetched:", response);
                setChatMessages([]);
            }
            setIsLoading(false);
        });

        if (chatId && messages[chatId]) {
            setChatMessages((prev) => {
                const mergedMessages = [...prev, ...messages[chatId].filter(msg => 
                    !prev.some(existing => existing._id === msg._id)
                )].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                return mergedMessages;
            });
        }
    }, [selectedContact, getMsg, chatId, messages]);

    if (!user) {
        return (
            <div className="flex-1 h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 text-sm md:text-base font-medium tracking-wide">
                Please log in to start chatting
            </div>
        );
    }

    if (!selectedContact) {
        return (
            <div className="flex-1 h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 text-sm md:text-base font-medium tracking-wide">
                Select a contact to start chatting
            </div>
        );
    }

    return (
        <div className="flex-1 h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
            <ChatHeader selectedContact={selectedContact} onBack={onBack} />
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <MessageList chatMessages={chatMessages} />
            )}
            <MessageInput 
                messageInput={messageInput} 
                setMessageInput={setMessageInput} 
                sendMessage={sendMessage} 
            />
        </div>
    );
};

export default ChatContainer;