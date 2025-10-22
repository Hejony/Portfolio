// FIX: Reverted `import * as React from 'react'` to the standard `import React, { ... } from 'react'`. The `* as React` form can cause issues with JSX type resolution, and this change to standard imports and hook usage (e.g., `useState` instead of `React.useState`) resolves these JSX intrinsic element errors.
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { portfolioData } from '../constants';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface Message {
    role: 'user' | 'model';
    text: string;
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('api key not valid')) {
            return 'AI 어시스턴트 설정에 문제가 있습니다. API 키를 확인해주세요.';
        }
        if (message.includes('rate limit')) {
            return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        }
        if (message.includes('fetch') || message.includes('network')) {
            return '네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.';
        }
    }
    return '죄송합니다. 답변을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
};


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [isShowingTypingIndicator, setIsShowingTypingIndicator] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            const summarizedData = {
                name: portfolioData.about.name,
                introduction: portfolioData.about.introduction,
                skills: portfolioData.about.skills.map(s => ({ category: s.category, tools: s.tools.map(t => t.name) })),
                experience: portfolioData.about.experience.map(e => `${e.period}: ${e.title} - ${e.description}`),
                awards: portfolioData.about.awards.map(a => `${a.date}: ${a.title}`),
                projects: portfolioData.projects.map(p => ({
                    title: p.title,
                    overview: p.overview,
                    details: p.details.map(d => {
                        if (typeof d.description === 'string') {
                            return `${d.title}: ${d.description}`;
                        }
                        // FIX: Added type guards to correctly handle the union type of `d.description`. The previous implementation failed to account for the `ProductCarouselData` object type, causing a runtime error when trying to call `.map()` on it. This now correctly checks if the description is an array (`BrandIdentityComponent[]`) or an object (`ProductCarouselData`) before attempting to process it.
                        if (Array.isArray(d.description)) {
                            // Handle BrandIdentityComponent[]
                            const brandIdentityText = d.description.map(item => `${item.title} - ${item.description}`).join('; ');
                            return `${d.title}: ${brandIdentityText}`;
                        } else if (typeof d.description === 'object' && d.description !== null && 'slides' in d.description) {
                            // Handle ProductCarouselData
                            const slidesSummary = d.description.slides.map(slide => slide.title).join(', ');
                            return `${d.title} (${d.description.introTitle}): Contains slides about ${slidesSummary}.`;
                        }
                        return `${d.title}: Contains complex visual data.`;
                    })
                }))
            };

            const systemInstruction = `You are an AI assistant for the portfolio of 이혜정, a content designer. Your primary function is to provide objective, factual information based *only* on the provided portfolio data. Do not use subjective or overly expressive language. Stick strictly to the facts presented in the data. For example, avoid phrases like '브랜드의 진정한 이야기를 만들어내는 디자이너'. If asked for an opinion or information not present in the data, politely state that you can only provide the information available in the portfolio. All responses must be in Korean. Here is the portfolio data in JSON format: ${JSON.stringify(summarizedData)}`;
            
            try {
                // FIX: Removed unsafe check for `process` which fails in browser-only environments like AI Studio.
                // Directly access `process.env.API_KEY` and handle the case where it might be missing gracefully
                // instead of throwing an error that crashes the app.
                const apiKey = process.env.API_KEY;

                if (!apiKey) {
                   setMessages([{ role: 'model', text: 'AI 어시스턴트가 비활성화되었습니다. API 키가 설정되지 않았습니다.' }]);
                   return; // Stop initialization
                }
                const ai = new GoogleGenAI({ apiKey });
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
                setChat(newChat);

                setMessages([{ role: 'model', text: '안녕하세요! 디자이너 이혜정의 포트폴리오 어시스턴트입니다. 무엇이 궁금하신가요?' }]);
            } catch (error) {
                console.error("Error initializing Gemini:", error);
                const errorMessage = (error instanceof Error && error.message.toLowerCase().includes('api key'))
                    ? 'AI 어시스턴트 초기화에 실패했습니다. API 키 설정을 확인해주세요.'
                    : 'AI 어시스턴트를 초기화하는 중 오류가 발생했습니다.';
                setMessages([{ role: 'model', text: errorMessage }]);
            }
        }
    }, [isOpen, chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isShowingTypingIndicator]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isWaitingForResponse || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsWaitingForResponse(true);
        setIsShowingTypingIndicator(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            let isFirstChunk = true;
            let modelResponse = '';

            for await (const chunk of responseStream) {
                if (isFirstChunk) {
                    setIsShowingTypingIndicator(false);
                    isFirstChunk = false;
                }
                modelResponse += chunk.text;
                
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage?.role === 'model') {
                        lastMessage.text = modelResponse;
                    } else {
                        newMessages.push({ role: 'model', text: modelResponse });
                    }
                    return newMessages;
                });
            }
             if (isFirstChunk) {
                setIsShowingTypingIndicator(false);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = getErrorMessage(error);
            setIsShowingTypingIndicator(false);
             setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'model') {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = errorMessage;
                    return newMessages;
                }
                return [...prev, { role: 'model', text: errorMessage }];
            });
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-5 sm:right-10 z-[100] w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="font-bold text-lg font-alexandria">AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] py-2 px-4 rounded-2xl ${msg.role === 'user' ? 'bg-white text-black rounded-br-none' : 'bg-white/10 rounded-bl-none'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isShowingTypingIndicator && (
                         <div className="flex justify-start">
                            <div className="max-w-[80%] py-2 px-4 rounded-2xl bg-white/10 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse [animation-delay:0.15s]"></span>
                                    <span className="w-2 h-2 bg-white/50 rounded-full animate-pulse [animation-delay:0.3s]"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                    <div className="flex items-center bg-black/50 rounded-full">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="질문을 입력하세요..."
                            className="flex-1 bg-transparent py-2 px-4 focus:outline-none text-white"
                            disabled={isWaitingForResponse || !chat}
                        />
                        <button type="submit" disabled={isWaitingForResponse || !chat} className="p-2 text-white disabled:text-white/50 transition-opacity hover:opacity-80">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
            
            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-24 sm:right-28 z-[101] w-16 h-16 bg-white text-black rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:opacity-90"
                aria-label="Toggle AI Assistant"
                data-cursor-hover="true"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </>
    );
};

export default Chatbot;