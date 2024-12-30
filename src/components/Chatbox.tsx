import React from 'react';
import Image from "next/image";
interface ChatboxProps {
  onClose: () => void;
}
const Chatbox: React.FC<ChatboxProps> = ({ onClose }) => {
  return (
    <div
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      width: '300px',
      zIndex: 1000
    }}
    >
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-lg font-semibold">Chatbot</h3>
        <button  onClick={onClose} className='text-gray-500 hover:text-gray-700 font-bold'> <Image src="/close.png" alt="" width={20} height={20} /> </button>
      </div>
      <div className="mb-4">
        {/* Nội dung chatbox ở đây*/}
        <p>Xin chào! Bạn có câu hỏi gì không?</p>
      </div>
       <div className="flex">
         <input placeholder='Type your message here...' className='p-2 border-2 border-gray-200 rounded-md flex-1'></input>
         <button className='p-2  bg-blue-500 hover:bg-blue-700 text-white rounded-md ml-2'>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;