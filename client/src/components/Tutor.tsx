import React from "react";
import { useNavigate } from "react-router-dom";
import { images } from "./Topics";

interface TutorProps {
  topic: string;
  index : number
}

const Tutor: React.FC<TutorProps> = ({ topic, index }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/" + topic);
    }

    return (
        <div onClick={handleClick} className="text-white cursor-pointer hover:scale-[1.1] duration-200 hover:shadow-xl shadow-slate-900 h-[22rem] w-[20rem] bg-zinc-700 rounded-xl">
            <img src={images[index % images.length]} className="h-[18rem] rounded-t-lg w-[20rem]" alt="" />
            <div className="w-full h-[4rem] flex justify-center items-center text-4xl ">
                {topic}
            </div>
        </div>
    );
};

export default Tutor;
