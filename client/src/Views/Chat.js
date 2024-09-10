import React, { useEffect, useState } from 'react';
import Main from '../Components/Main';
import { useParams } from "react-router-dom";

export default function Chat({ user }) {
  const { recepientId } = useParams();

  const [formData, setFormData] = useState({
    senderId: user._id,
    recepientId: recepientId,
    messageType: "text",
    messageText: "",
    file: null,
  });

  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/messages/${user._id}/${recepientId}`
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messages", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/user/${recepientId}`
        );

        const data = await response.json();

        setRecepientData(data);
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchRecepientData();
  }, [recepientId]);

  const handleSend = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/messages", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setFormData({
          ...formData,
          messageText: ""
        });
        fetchMessages();
      }
    } catch (error) {
      console.log("Error sending a message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Main center>
      <div className="ChatScreen">
        <div className="ChatScreen__Header">
          <h3>My chat with {recepientData ? recepientData.username : "Chat"}</h3>
        </div>
        <div className="ChatScreen__Messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`Message ${msg.senderId._id === user._id ? 'sent' : 'received'}`}
            >
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="ChatScreen__Input">
          <input
            type="text"
            placeholder="Write a message..."
            value={formData.messageText}
            onChange={(e) => setFormData({ ...formData, messageText: e.target.value })}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </Main>
  );
}



