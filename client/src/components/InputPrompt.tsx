import { useState } from "react"


interface InputPromptProps {
    handleSendMessage: (message: string) => void;
    loading: boolean;
}
  
  const InputPrompt: React.FC<InputPromptProps> = ({ handleSendMessage, loading }) => {
    const [text, setText] = useState("");
  
    const handleClick = () => {
      if (text.trim()) {
        handleSendMessage(text);
        setText("");
      }
    };
  return (
    <div className="flex flex-row gap-4 w-full">
        <input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleClick();
                }
            }}
            placeholder="Input your query"
            type="text" className='w-[90%] h-[3rem] text-xl focus:border-0 outline-none p-4 bg-slate-700 rounded-xl text-slate-300' 
        />
        <button
            disabled={loading}
            onClick={handleClick}
            className="bg-blue-500 cursor-pointer px-4 py-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            Submit
        </button>
    </div>
  )
}

export default InputPrompt