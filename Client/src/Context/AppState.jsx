import { useState, useEffect } from "react";
import AppContext from "./AppContext.jsx";
import axios from "axios";
import { toast } from "sonner";
import { io } from "socket.io-client";

const AppState = (props) => {
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const newSocket = io("http://localhost:3000", { withCredentials: true });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        newSocket.on('newMessage', (message) => {
            const chatId = [message.senderId, message.receiverId].sort().join('_');
            setMessages((prev) => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), message],
            }));
            // toast.info("New message received!");
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (user && socket) {
            socket.emit('join', user.id);
        }
    }, [user, socket]);

    const handleReg = async (email, password, firstName) => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/auth/signup",
                { email, password, firstName },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            if (res.status === 201) {
                setUser(res.data);
                toast.success("User Created Successfully");
                return res.data;
            }
            toast.error("Error in Registering User");
            return false;
        } catch (error) {
            toast.error("Failed to register user: " + error.message);
            return false;
        }
    };

    const handleLog = async (email, password) => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/auth/login",
                { email, password },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            if (res.status === 200) {
                setUser(res.data);
                toast.success("Logged In Successfully");
                return res.data;
            }
            toast.error("Error in Logging In");
            return false;
        } catch (error) {
            toast.error("Failed to log in: " + error.message);
            return false;
        }
    };

    const fetchUser = async () => {
        try {
            // console.log("Fetching current user from: http://localhost:3000/api/auth/me");
            const res = await axios.get("http://localhost:3000/api/auth/me", {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log("Fetch user response:", res.status, res.data);
            if (res.status === 200) {
                setUser(res.data);
                return res.data;
            }
            return false;
        } catch (error) {
            // console.log("Error in Fetching User:", error.response?.data || error.message);
            return false;
        }
    };

    const fetchImage = async () => {
        try {
            // console.log("Fetching image from: http://localhost:3000/api/auth/image");
            const res = await axios.get("http://localhost:3000/api/auth/image", {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log("Fetch image response:", res.status, res.data);
            if (res.status === 200) {
                return res.data;
            }
            return false;
        } catch (error) {
            // console.log("Error in Fetching Image:", error.response?.data || error.message);
            return false;
        }
    };

    const updateUser = async (firstName, lastName, image) => {
        try {
            let formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('image', image);
            const res = await axios.put("http://localhost:3000/api/auth/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (res.status === 200) {
                setUser(res.data);
                return res.data;
            }
            toast.error("Error in Updating User");
            return false;
        } catch (error) {
            toast.error("Failed to update user");
            return false;
        }
    };

    const removeImage = async () => {
        try {
            const res = await axios.put("http://localhost:3000/api/auth/remove-img", {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.status === 200) {
                setUser((prevUser) => ({ ...prevUser, image: null }));
                return res.data;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const logout = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/auth/logout", {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.status === 200) {
                setUser(null);
                return res.data;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const searchUser = async (param) => {
        try {
            const response = await axios.post("http://localhost:3000/api/contact/search", { search: param }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
            toast.error("Unexpected error while searching contacts");
            return false;
        } catch (error) {
            toast.error("Error occurred while searching contacts");
            return false;
        }
    };

    const fetchAllContacts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/contact/search", {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.status === 200) {
                return response.data;
            }
            toast.error("Unexpected error while fetching contacts");
            return false;
        } catch (error) {
            toast.error("Error occurred while fetching contacts");
            return false;
        }
    };

    const postMessage = async (message, receiverId) => {
        try {
            const res = await axios.post(`http://localhost:3000/api/message/send/${receiverId}`, { message }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            return res.data.newMessage;
        } catch (error) {
            toast.error(`Error in Sending Message: ${error.message}`);
            return false;
        }
    };

    const getMsg = async (receiverId) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/message/get/${receiverId}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            return false;
        }
    };

    return (
        <AppContext.Provider value={{ 
            handleReg, handleLog, user, fetchUser, updateUser, fetchImage, 
            removeImage, logout, searchUser, fetchAllContacts, postMessage, getMsg, messages, socket
        }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;