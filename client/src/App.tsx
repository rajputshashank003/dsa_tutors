import React from "react";
import AppRoutes from "./components/AppRoutes";


const App: React.FC = () => {
    
    /*
    {messages.map((msg, index) => (
                    <p key={index} className={msg.type === "user" ? "text-blue-400" : "text-green-400"}>
                        <strong>{msg.type === "user" ? "You:" : "AI:"}</strong> {msg.content}
                    </p>
                ))}
              <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded-md text-black"
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} className="bg-blue-500 px-4 py-2 rounded-md">
                    Send
                </button>
    */

    return (
      <div className="relative bg-zinc-900 h-fit w-screen">
        <AppRoutes/>
      </div>
    );
};

export default App;
