import React from 'react';

interface ChatbotProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatbotNavbarButton = ({ isOpen, setIsOpen }: ChatbotProps) => {
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={toggleModal} className={`flex items-center text-white px-2 py-1 rounded bg-custom-orange z-50 ${isOpen ? 'hidden' : ''}`}>
                <span className="hidden lg:block">Chat with MomoAI</span>
                <img src="/lemur.svg" alt="Momo" className=" lg:ml-3 w-8 h-8" />
            </button>
        </div>
    );
};

export default ChatbotNavbarButton;