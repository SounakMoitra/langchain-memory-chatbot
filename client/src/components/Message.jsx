const Message = ({ message }) => (
    <div id={message.id}
      className={`message ${message.role}-message ${message.loading ? "loading" : ""} ${message.error ? "error" : ""}`}>
      {message.role === "bot" && <img className="avatar" src="chatbot_8943377.png" alt="Bot Avatar" />}
      <p className="text">{message.content}</p>
    </div>
  );
  
  export default Message;
  