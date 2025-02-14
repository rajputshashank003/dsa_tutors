import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from 'uuid';
import TopicTitle from "./TopicTitle";
import InputPrompt from "./InputPrompt";

interface ChatProps {
    topic: string;
}

interface Message {
    type: "user" | "ai";
    content: string;
}

const Chat: React.FC<ChatProps> = ({ topic }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [id ] = useState<string>(uuidv4());

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        setLoading(true);
        setError(null);

        setMessages((prev) => [...prev, { type: "user", content: text }]);

        try {
            const response = await fetch("https://dsa-tutors-api.vercel.app/dsa_tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, userId: id }),
            });

            if (!response.body) throw new Error("Response body is null");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            setMessages((prev) => [...prev, { type: "ai", content: "⏳ AI is thinking..." }]);
            
            const updateLastMessage = (newContent: string) => {
                setMessages((prev) => {
                    return prev.map((msg, index) =>
                        index === prev.length - 1 ? { ...msg, content: newContent } : msg
                    );
                });
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunkText = decoder.decode(value, { stream: true });
                accumulatedText += chunkText;

                updateLastMessage(accumulatedText);
            }

        } catch (error) {
            console.error("Error fetching AI response:", error);
            setError("Failed to fetch AI response. Please try again.");
            setMessages((prev) => [
                ...prev.filter((msg) => msg.content !== "⏳ AI is thinking..."), // Remove typing indicator
                { type: "ai", content: "Failed to fetch response. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (text : string) => {
        sendMessage(text);
    };
    useEffect(() => {
        sendMessage(topic);
    }, []);

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-900 text-white no-scroll">
            <TopicTitle topic={messages[0]?.content ?? "Unknown topic "} />
            <div className="flex-1 overflow-y-auto no-scrollbar mb-4">
                {messages.map((msg, index) => (
                    index != 0 &&
                    <div
                        key={index}
                        className={`p-4 my-2 rounded-lg max-w-[80%] ${
                            msg.type === "ai"
                                ? "bg-gray-800 self-start"
                                : "bg-blue-500 self-end"
                        }`}
                    >
                        {msg.type === "ai" ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="p-4 my-2 bg-gray-800 rounded-lg max-w-[80%] self-start">
                        <span className="animate-pulse">Typing...</span>
                    </div>
                )}
                {error && (
                    <div className="p-4 my-2 bg-red-500 rounded-lg max-w-[80%] self-start">
                        {error}
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="grid max-sm:flex grid-cols-3 max-sm:flex-col gap-4 justify-center items-center ">
                <div className="flex gap-8 justify-center col-span-1 w-full">
                    <button
                        disabled={loading}
                        onClick={() => handleSendMessage("Yes , I understand this lets move on to next topic")}
                        className="bg-blue-500 h-[3rem] cursor-pointer px-4 py-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Yes
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => handleSendMessage("No, I didn't understand this, please repeat this ")}
                        className="bg-blue-500 h-[3rem] cursor-pointer px-4 py-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        No
                    </button>
                </div>
                <div className="col-span-2">
                    <InputPrompt 
                        loading={loading}
                        handleSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chat;