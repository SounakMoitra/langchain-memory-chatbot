import { ArrowUp } from "lucide-react";
import { useState } from "react";

const PromptForm = ({
  conversations, setConversations, activeConversation,
  generateResponse, isLoading, setIsLoading
}) => {
  const [promptText, setPromptText] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLoading || !promptText.trim()) return;
    
    setIsLoading(true);
    
    const currentConvo = conversations.find((convo) => convo.id === activeConversation) || conversations[0];
    
    let newTitle = currentConvo.title;
    
    if (currentConvo.messages.length === 0) {
      newTitle = promptText.length > 25 ? promptText.substring(0, 25) + "..." : promptText;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
    };

    setConversations(conversations.map((conv) =>
      (conv.id === activeConversation
        ? { ...conv, title: newTitle, messages: [...conv.messages, userMessage] }
        : conv)));
    
    setPromptText("");
    
    setTimeout(() => {
      const botMessageId = `bot-${Date.now()}`;
      const botMessage = { id: botMessageId, role: "bot", content: "generating response...", loading: true };
      
      setConversations((prev) => prev.map((conv) =>
        conv.id === activeConversation
          ? { ...conv, title: newTitle, messages: [...conv.messages, botMessage] }
          : conv));
          
      generateResponse(promptText, botMessageId);
    }, 300);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl transition-all duration-300 hover:border-gray-600/50 focus-within:border-indigo-500/50">
        <input 
          placeholder="Ask anything..."
          className="w-full px-6 py-4 bg-transparent text-gray-200 placeholder-gray-500 outline-none rounded-2xl pr-24"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            title="Attach file"
            onClick={(e) => e.preventDefault()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            title="Voice input"
            onClick={(e) => e.preventDefault()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button 
            type="button"
            disabled={isLoading || !promptText.trim()}
            onClick={handleSubmit}
            className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default PromptForm;
