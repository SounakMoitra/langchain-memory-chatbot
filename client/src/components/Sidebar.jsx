import { Menu, Plus, Moon, Sun, Trash2, Sparkles } from "lucide-react";


const Sidebar = ({
  isSidebarOpen, setIsSidebarOpen,
  conversations, setConversations,
  activeConversation, setActiveConversation,
  theme, setTheme
}) => {
  
  const createNewConversation = () => {
    const emptyConversation = conversations.find((conv) => conv.messages.length === 0);
    
    if (emptyConversation) {
      setActiveConversation(emptyConversation.id);
      return;
    }
    
    const newId = `conv-${Date.now()}`;
    
    setConversations([{ id: newId, title: "New Chat", messages: [] }, ...conversations]);
    setActiveConversation(newId);
  };
  
  const deleteConversation = (id, e) => {
    e.stopPropagation();
    
    if (conversations.length === 1) {
      const newConversation = { id: "default", title: "New Chat", messages: [] };
      
      setConversations([newConversation]);
      setActiveConversation("default");
    } else {
      const updatedConversations = conversations.filter((conv) => conv.id !== id);
      
      setConversations(updatedConversations);
      
      if (activeConversation === id) {
        setActiveConversation(updatedConversations[0].id);
      }
    }
  };

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 ${isSidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setIsSidebarOpen((prev) => !prev)}>
            <Menu size={18} className="text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium text-gray-200" onClick={createNewConversation}>
            <Plus size={18} /> New chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Chat history</h2>
          <ul className="space-y-1">
            {conversations.map((conv) => (
              <li 
                key={conv.id} 
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all group ${activeConversation === conv.id ? "bg-indigo-600/20 text-indigo-400" : "hover:bg-gray-800 text-gray-400"}`}
                onClick={() => setActiveConversation(conv.id)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Sparkles size={14} className="flex-shrink-0" />
                  <span className="text-sm truncate">{conv.title}</span>
                </div>
                <button
                  className={`p-1 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100 ${(conversations.length > 1 || conv.title !== "New Chat") ? "" : "hidden"}`}
                  onClick={(e) => deleteConversation(conv.id, e)}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-gray-800">
          <button 
            className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200 text-sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
