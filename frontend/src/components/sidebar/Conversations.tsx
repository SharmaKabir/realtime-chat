// import { DUMMY_CONVERSATIONS } from "../../dummy_data/dummy";
import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { getRandomEmoji } from "../../utils/emojis"
const Conversations = () => {
	const  {conversations, loading }=useGetConversations();
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{/* {DUMMY_CONVERSATIONS.map((conversation:any) => (
				<Conversation key={conversation.id} conversation={conversation} />
			))} */}
			{conversations.map((conversation:any) => (
				<Conversation key={conversation.id} conversation={conversation} 
				emoji={getRandomEmoji()}/>
			))}
			{loading ? (<span className="loading loading-spinner mx-auto"/>): null}
		</div>
	);
};
export default Conversations;