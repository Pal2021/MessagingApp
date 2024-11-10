import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token"); // Ensure the token is consistent with UserDashboard

  // Fetch all messages on mount
  useEffect(() => {
    if (token) {
      axios
        .get("/api/v1/admin/Allmessage", {
          headers: { Authorization: `Bearer ${token.trim()}` },
        })
        .then((response) => {
          setMessages(response.data.data);
          console.log("Fetched messages:", response.data.data);
        })
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [token]);

  const handleMessageClick = (userId) => {
    const userMessages = messages.filter(
      (msg) => msg?.senderId?._id === userId
    );
    setSelectedUser({
      id: userId,
      messages: userMessages.length > 0 ? userMessages.reverse() : [],
    });
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    const newMsg = {
      senderId: selectedUser.id,
      message: newMessage,
    };

    // Optimistically update the state before making the API call
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setSelectedUser((prevUser) => ({
      ...prevUser,
      messages: [...prevUser.messages, newMsg],
    }));

    try {
      const response = await axios.post(
        "/api/v1/admin/sendmessage",
        { senderId: selectedUser.id, message: newMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.trim()}`,
          },
        }
      );

      console.log("Message sent successfully:", response.data);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const uniqueUsers = messages.reduce((acc, msg) => {
    if (msg?.senderId && !acc.find((user) => user._id === msg.senderId._id)) {
      acc.push(msg.senderId);
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Admin Dashboard
        </h1>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <div className="space-y-3">
            {uniqueUsers.map((user) => (
              <div
                key={user._id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-200 cursor-pointer"
                onClick={() => handleMessageClick(user._id)}
              >
                <p className="text-lg text-gray-800">
                  <span className="font-bold">
                    {user.firstName} {user.lastName}
                  </span>{" "}
                  ({user.username})
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">
              Messages with {selectedUser.messages[0]?.senderId?.firstName}{" "}
              {selectedUser.messages[0]?.senderId?.lastName}
            </h3>
            <div className="space-y-3 mb-6">
              {selectedUser.messages.map((msg, index) => (
                <p
                  key={index}
                  className="text-lg text-gray-700 bg-gray-100 p-4 rounded-lg"
                >
                  {msg.message}
                </p>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 "
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 "
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { AdminDashboard };
