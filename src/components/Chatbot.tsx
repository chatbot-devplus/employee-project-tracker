"use client";
import React, { useState } from "react";
import Chatbox from "./Chatbox";

const Chatbot = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);

  const toggleChatbox = () => {
    setIsChatboxOpen(!isChatboxOpen);
  };
  return (
    <>
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
          onClick={toggleChatbox}
        />
      </div>
      {isChatboxOpen && <Chatbox onClose={toggleChatbox} />}
    </>
  );
};

export default Chatbot;
