import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Paperclip, Mic } from "lucide-react";
import { Button } from "./ui/button";
import logo from "figma:asset/e5106dc76e4a5b520e307d80648f962a463ac75e.png";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI travel assistant. I'm here to help you plan the perfect trip. Where would you like to go?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great choice! I'd love to help you plan your trip. What's your budget range and how long are you planning to stay?",
        "That sounds like an amazing destination! Are you looking for flights, accommodations, or would you like me to help plan activities too?",
        "Perfect! Let me help you find the best options. What dates are you thinking of traveling?",
        "Excellent! I can help you plan everything from flights to local experiences. What's most important to you - budget, luxury, or unique experiences?",
        "I'm excited to help you plan this trip! Are you traveling solo, with family, or friends? This will help me tailor my recommendations.",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#EAF9FF] to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Smart Travel Assistant" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-[#004C8C] font-bold text-lg">Smart Travel Assistant</h1>
              <p className="text-sm text-gray-500">Online • Ready to help plan your trip</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 bg-gradient-to-br from-[#004C8C] to-[#00ADEF] rounded-full flex-shrink-0 mt-1" />
              )}
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  message.isUser
                    ? "bg-gradient-to-r from-[#00ADEF] to-[#6BD9FF] text-white rounded-tr-sm"
                    : "bg-white border border-gray-200 text-gray-900 rounded-tl-sm shadow-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.isUser ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.isUser && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 mt-1" />
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#004C8C] to-[#00ADEF] rounded-full flex-shrink-0 mt-1" />
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setInputText("I want to plan a trip to Paris")}
              className="px-4 py-2 bg-[#EAF9FF] hover:bg-[#00ADEF]/10 rounded-full text-sm text-[#004C8C] transition-colors"
            >
              Plan a trip to Paris
            </button>
            <button
              onClick={() => setInputText("Find me budget-friendly accommodations")}
              className="px-4 py-2 bg-[#EAF9FF] hover:bg-[#00ADEF]/10 rounded-full text-sm text-[#004C8C] transition-colors"
            >
              Budget accommodations
            </button>
            <button
              onClick={() => setInputText("What's the weather like in Tokyo?")}
              className="px-4 py-2 bg-[#EAF9FF] hover:bg-[#00ADEF]/10 rounded-full text-sm text-[#004C8C] transition-colors"
            >
              Check weather
            </button>
          </div>

          {/* Input Area */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full p-4 pr-24 border border-gray-300 rounded-2xl resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-[#00ADEF] focus:border-transparent"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-gradient-to-r from-[#00ADEF] to-[#6BD9FF] hover:from-[#004C8C] hover:to-[#00ADEF] p-3 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}