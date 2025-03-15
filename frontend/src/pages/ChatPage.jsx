import ChatUserList from '@/components/chat/ChatUserList'
import EmptyMessages from '@/components/chat/EmptyChat'
import UsersChatbox from '@/components/chat/UsersChatbox'
import React from 'react'
import { useSelector } from 'react-redux'

const ChatPage = () => {
  const {targetUser} = useSelector(store => store.chat);
 
  return (
    <div className=' ml-[16%] flex flex-1 h-screen bg-[#18181a]'>
    
    <section className='w-[22%] flex flex-col'>
     {/* <Chat/> chatuserlist */}
    <ChatUserList/>
    </section>
    <section className='flex-1 '>
        {
          targetUser ? <UsersChatbox/> : <EmptyMessages/>
        }
       
    </section>
    </div>
  )
}

export default ChatPage