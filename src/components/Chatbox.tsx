"use client";
import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import TextArea from "antd/lib/input/TextArea";
import runChat from '../app/config/Gemini';

const ChatBox: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ content: string; sender: "user" | "bot"; timestamp: string }[]>([]);

  const onSent = async (prompt: string) => {
    if (!prompt.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { content: prompt, sender: "user", timestamp }]);
    try {
      const response = await runChat(prompt);
      setMessages((prev) => [...prev, { content: response, sender: "bot", timestamp }]);
    } catch (error) {
      console.error("Error while running chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };
  const closeModel = () => {
    setIsExpanded(false);
  };

  return (
    <div id="chat-bot" className="fixed bottom-5 right-5 z-[999999999]">
      <div>
        {!isExpanded && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              cursor: "pointer",
            }}
          >
            <img
              src="/chatbot.gif"
              alt="Chatbot"
              className="w-32 h-auto rounded-full object-cover"
              onClick={toggleChat}
            />
          </div>
        )}
        <div
          className={`user ${isExpanded ? "visible ml-0" : "hidden -ml-[100px]"
            } transition-all duration-500 bg-green-900 shadow-lg p-4 rounded-lg w-[370px] flex items-end justify-between`}
        >
          <i className="bi bi-person-circle mr-2"></i> Adnan Khan
          <i className="bi bi-x-lg cursor-pointer " onClick={closeModel}></i>
        </div>
      </div>

      <div
        className={`messenger bg-white border border-green-200 shadow-lg p-4 rounded-lg mt-2 ${isExpanded ? "h-[390px] w-[370px] visible" : "h-0 w-0 invisible"
          } transition-all duration-700`}
      >
        <div className="chatroom flex flex-col h-72 overflow-y-auto scrollbar-hidden pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`msg mb-3 ${message.sender === "user" ? "msg-right" : "msg-left"} flex items-start space-x-2`}
            >
              {message.sender !== "user" && (
                <img
                  src="/chatbot.gif" 
                  alt="Chatbot Avatar"
                  className="w-10 h-8 rounded-full"
                />
              )}
              <div
                className={`bubble ${message.sender === "user"
                    ? "bg-green-100 text-green-800 ml-auto"
                    : "bg-blue-100 text-gray-700"
                  } p-3 rounded-lg`}
              >
                <div>{message.content}</div>
                <div className="timestamp text-xs text-gray-500 mt-1 ml-auto flex items-center space-x-1">
                  <span>{message.timestamp}</span>
                  <i className="bi bi-check text-green-500"></i>
                </div>
              </div>
            </div>

          ))}

        </div>
        <div className="type-area mt-3 relative">
          <TextArea
            className="typing w-full border border-gray-300 rounded-md p-2 pl-3 pr-8 text-sm focus:outline-none text-gray-500"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() !== "" && !loading) {
                  onSent(input);
                }
              }
            }}
            value={input}
            placeholder="Enter the Prompt Here"
            autoSize={{ minRows: 1, maxRows: 6 }}
          />
          <span
            className="send absolute right-2 top-2 text-lg cursor-pointer"
            onClick={() => {
              if (input.trim() !== "" && !loading) {
                onSent(input);
              }
            }}
          >
            <i className="bi bi-arrow-return-left text-gray-500"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

<style jsx>{`
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
`}</style>
