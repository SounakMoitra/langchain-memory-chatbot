import { useEffect, useRef, useState } from "react";
import { Menu, Search, Lightbulb, Map, Compass, FlaskConical } from "lucide-react";
import Message from "./components/Message";
import PromptForm from "./components/PromptForm";
import Sidebar from "./components/Sidebar";


const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const typingInterval = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);
 
  const [theme, setTheme] = useState(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  
  const [conversations, setConversations] = useState([{ id: "default", title: "New Chat", messages: [] }]);
  const [activeConversation, setActiveConversation] = useState("default");
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  
  const currentConversation = conversations.find((c) => c.id === activeConversation) || conversations[0];
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };
  
  useEffect(() => { 
    scrollToBottom(); 
  }, [conversations, activeConversation]);
  
  const typingEffect = (text, messageId) => {
    let textElement = document.querySelector(`#${messageId} .text`);
    if (!textElement) return;
    
    setConversations((prev) => prev.map((conv) => conv.id === activeConversation
      ? { ...conv, messages: conv.messages.map((msg) =>
        (msg.id === messageId ? { ...msg, content: "", loading: true } : msg)) }
      : conv));
    
    textElement.textContent = "";
    
    const words = text.split(" ");
    let wordIndex = 0;
    let currentText = "";
    
    clearInterval(typingInterval.current);
    
    typingInterval.current = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
        textElement.textContent = currentText;
    
        setConversations((prev) => prev.map((conv) => conv.id === activeConversation
          ? { ...conv, messages: conv.messages.map((msg) =>
            (msg.id === messageId ? { ...msg, content: currentText, loading: true } : msg)) }
          : conv));
        scrollToBottom();
      } else {
        clearInterval(typingInterval.current);
        setConversations((prev) => prev.map((conv) => conv.id === activeConversation
          ? { ...conv, messages: conv.messages.map((msg) =>
            (msg.id === messageId ? { ...msg, content: currentText, loading: false } : msg)) }
          : conv));
    
        setIsLoading(false);
      }
    }, 40);
  };
  
  const generateResponse = async (userMessage, botMessageId) => {
    try {
      setTimeout(() => {
        const responseText = "This is a demo response. Connect your backend API to get real responses!";
        typingEffect(responseText, botMessageId);
      }, 500);
    } catch (error) {
      setIsLoading(false);
      updateBotMessage(botMessageId, error.message, true);
    }
  };

  const updateBotMessage = (botId, content, isError = false) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === botId ? { ...msg, content, loading: false, error: isError } : msg
              ),
            }
          : conv
      )
    );
  };
  
  const quickActions = [
    { icon: Search, label: "Research", color: "from-blue-500 to-cyan-500" },
    { icon: Lightbulb, label: "Learn", color: "from-amber-500 to-orange-500" },
    { icon: Map, label: "Plan", color: "from-green-500 to-emerald-500" },
    { icon: Compass, label: "Explore", color: "from-purple-500 to-pink-500" },
    { icon: FlaskConical, label: "Experiment", color: "from-red-500 to-rose-500" }
  ];
  
  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-50 text-gray-900" : "bg-gray-950 text-gray-100"}`}>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar
        conversations={conversations}
        setConversations={setConversations}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        theme={theme}
        setTheme={setTheme}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"} min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-30 backdrop-blur-sm bg-gray-950/50 border-b border-gray-800/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-gray-400" />
            </button>
          </div>
        </header>
        
        {currentConversation.messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20">
              <span className="text-3xl font-bold text-white"></span>
            </div>
            
            <h1 className="text-5xl font-light tracking-tight mb-4 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Remind
            </h1>
            
            <p className="text-gray-500 text-lg mb-12">Ask me anything about any topic. I'm here to help!</p>
            
            <div className="w-full max-w-3xl mb-8">
              <PromptForm
                conversations={conversations}
                setConversations={setConversations}
                activeConversation={activeConversation}
                generateResponse={generateResponse}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 transition-all duration-200 text-sm font-medium text-gray-300 hover:text-white group"
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-32" ref={messagesContainerRef}>
            <div className="py-8">
              {currentConversation.messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
          </div>
        )}
        
        {currentConversation.messages.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent pt-8 pb-6 px-4">
            <div className={`transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
              <PromptForm
                conversations={conversations}
                setConversations={setConversations}
                activeConversation={activeConversation}
                generateResponse={generateResponse}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

