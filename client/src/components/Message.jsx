const Message = ({ message }) => (
  <div id={message.id}
    className={`flex gap-4 px-4 py-6 max-w-4xl mx-auto ${message.role}-message ${message.loading ? "loading" : ""} ${message.error ? "error" : ""}`}>
    {message.role === "bot" && (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <span className="text-white text-sm font-bold">M</span>
      </div>
    )}
    <div className="flex-1">
      <p className={`text ${message.role === "user" ? "font-medium" : ""}`}>{message.content}</p>
    </div>
  </div>
);

export default Message;