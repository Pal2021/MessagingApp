import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserDashboard = () => {
  const [clientMessage, setClientMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/v1/user/Allmessage", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedMessages = response.data.data || [];
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [navigate]);

  const handleSendMessage = async () => {
    if (clientMessage.trim()) {
      const token = localStorage.getItem("token");
      const newMessage = {
        senderId: currentUserId,
        message: clientMessage,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        await axios.post(
          "/api/v1/user/sendmessage",
          { senderId: currentUserId, message: clientMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Messages</h2>
        <div className="space-y-4">
          {(messages || []).map((msg, index) => (
            <div key={index} className="flex justify-start">
              <div className="p-3 rounded-lg max-w-xs bg-gray-200 text-gray-800">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={clientMessage}
          onChange={(e) => setClientMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none "
        />
        <button
          onClick={handleSendMessage}
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-slate-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};
