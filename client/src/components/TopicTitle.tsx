
interface TopicTitleProps {
    topic: string;
  }
  
  const TopicTitle: React.FC<TopicTitleProps> = ({ topic }) => {
  return (
    <div className="w-full flex justify-center items-center font-bold p-4 text-4xl text-slate-300">
        {topic}
    </div>
  )
}

export default TopicTitle