import { Send } from "lucide-react";

export function ChatbotPreview() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#EAF9FF]">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#004C8C] to-[#00ADEF] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-6 h-6 bg-white rounded-full" />
          </div>
          <div>
            <h3 className="text-white font-medium">Travel Assistant</h3>
            <p className="text-blue-100 text-sm">Online</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-4 space-y-4 min-h-[320px] bg-gradient-to-b from-[#EAF9FF]/30 to-white">
        {/* Assistant Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#004C8C] to-[#00ADEF] rounded-full flex-shrink-0" />
          <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-[#EAF9FF] max-w-[85%]">
            <p className="text-sm text-gray-700">
              Hi! I'm your AI travel assistant. Where would you like to go?
            </p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 justify-end">
          <div className="bg-gradient-to-r from-[#00ADEF] to-[#6BD9FF] p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%]">
            <p className="text-sm text-white">
              I'm planning a trip to Tokyo next month
            </p>
          </div>
        </div>

        {/* Assistant Response */}
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#004C8C] to-[#00ADEF] rounded-full flex-shrink-0" />
          <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-[#EAF9FF] max-w-[85%]">
            <p className="text-sm text-gray-700">
              Great choice! I can help you find flights, hotels, and create a personalized itinerary. What's your budget?
            </p>
          </div>
        </div>

        {/* Typing Indicator */}
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#004C8C] to-[#00ADEF] rounded-full flex-shrink-0" />
          <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-[#EAF9FF]">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 items-center bg-[#EAF9FF]/50 rounded-xl p-2 border border-[#EAF9FF]">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-2 py-1 outline-none text-sm"
            disabled
          />
          <button className="bg-gradient-to-r from-[#00ADEF] to-[#6BD9FF] text-white p-2 rounded-lg hover:from-[#004C8C] hover:to-[#00ADEF] transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
