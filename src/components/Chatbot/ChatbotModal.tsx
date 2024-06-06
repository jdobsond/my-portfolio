import React, { useState, useEffect } from 'react';
import homeData from "@/components/Home/HomeData";

interface ChatbotProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
    text: string;
    sender: 'user' | 'bot';
    timestamp?: string;
}

function ChatbotModal({ isOpen, setIsOpen }: ChatbotProps) {
    const defaultBotMessage: Message = {
        text: `Hello! My name is Momo, ${homeData.name}'s portfolio helper. Curious about anything? Ask away!`,
        sender: 'bot',
    };

    const [messages, setMessages] = useState<Message[]>([defaultBotMessage]);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // Track if a message is being processed
    const [questionCount, setQuestionCount] = useState(0);

    useEffect(() => {
        const storedCount = parseInt(localStorage.getItem('questionCount') || '0', 10);
        setQuestionCount(storedCount);

        // Set the timestamp for the default message on the client side
        setMessages((prevMessages) => prevMessages.map((msg, index) =>
            index === 0 ? { ...msg, timestamp: formatTime(new Date()) } : msg
        ));
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const updateQuestionCount = (newCount: number) => {
        localStorage.setItem('questionCount', newCount.toString());
        setQuestionCount(newCount);
    };

    const handleUserMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setError(''); // Clear error message on input change
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        if (input.length > 150) {
            setError('Please limit your message to 150 characters or less.');
            return;
        }
        if (questionCount >= 15) {
            setError('You have reached the maximum number of questions.');
            return;
        }

        setIsProcessing(true); // Start processing

        const userMessage: Message = {
            text: input,
            sender: 'user',
            timestamp: formatTime(new Date()),
        };
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            const botMessage: Message = {
                text: data.message.content,
                sender: 'bot',
                timestamp: formatTime(new Date()),
            };

            setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
            setInput('');
            updateQuestionCount(questionCount + 1);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsProcessing(false); // End processing
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            handleSendMessage();
        }
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 p-4 z-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md w-full bg-dark border-light border-2 p-4 rounded-t-md shadow-md md:max-w-lg md:w-auto md:bottom-4 md:right-4 md:rounded md:inset-auto">
                <button onClick={() => setIsOpen(false)} className="absolute -top-12 right-0 mt-1 text-lg mr-1 bg-red-500 px-3 py-1 rounded text-light hover:text-dark" aria-label="Close chat modal">X</button>
                <div className="chat-history overflow-y-auto pr-3 mb-4 pt-2" style={{ maxHeight: '70vh' }}>
                    {messages.map((message, index) => (
                        <div key={index} className={` ${message.sender === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                            <div className={`text-sm text-light ${message.sender === 'user' ? 'text-right' : ''}`}>
                                {message.sender === 'user' ? (
                                    <>
                                        You - <span className="ml-1">{message.timestamp}</span>
                                    </>
                                ) : (
                                    <div className="flex items-center">
                                        <img src="/lemur.svg" alt="MomoAI Icon" style={{ height: '35px', marginRight: '8px', }} />
                                        Momo - <span className="ml-1">{message.timestamp}</span>
                                    </div>
                                )}
                            </div>
                            <div className={`my-2 p-2 rounded-lg ${message.sender === 'user' ? 'bg-midlight text-white self-end max-w-xs -mb-4' : 'bg-gray-300 text-black self-start max-w-xs'}`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="input-area flex items-center">
                    <input
                        type="text"
                        placeholder="Ask a question!"
                        value={input}
                        onChange={handleUserMessageChange}
                        onKeyPress={handleKeyPress}
                        className={`flex-grow p-2 mr-1 border border-gray-300 rounded-l-md text-black ${isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}
                        disabled={isProcessing}
                    />
                    {isProcessing ? (
                        <div className="w-3 h-6 ml-2 md:w-3 md:h-6 bg-white rounded-full animate-spin mr-1"></div>
                    ) : (
                        <button onClick={handleSendMessage} className="bg-custom-orange text-white p-2 rounded-r-md mr-1">
                            Ask
                        </button>
                    )}
                    <span className="text-light text-sm ml-1">{input.length}/150</span>
                </div>

            </div>
        </div>
    );
}

export default ChatbotModal;
